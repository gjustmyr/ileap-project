from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from middleware.auth import get_current_user
from controllers.class_controller import (
    create_class_with_students,
    process_csv_file,
    get_classes_by_coordinator,
    get_programs_by_department
)
from schemas.class_schema import ClassCreate, ClassResponse, ClassWithStudents
from models import OJTCoordinator, Section, Program
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/classes", tags=["Classes"])


def send_student_credentials_email(email: str, sr_code: str, first_name: str, last_name: str, password: str):
    """Send account credentials to student via email"""
    try:
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASSWORD")
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your ILEAP Student Account Has Been Created"
        message["From"] = sender_email
        message["To"] = email
        
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                    <h2 style="color: #2563eb;">Welcome to ILEAP!</h2>
                    <p>Dear {first_name} {last_name},</p>
                    <p>Your student account has been successfully created. Below are your login credentials:</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>SR Code:</strong> {sr_code}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> {email}</p>
                        <p style="margin: 5px 0;"><strong>Password:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 3px;">{password}</code></p>
                    </div>
                    
                    <p><strong>Important:</strong> Please change your password after your first login.</p>
                    
                    <p>You can now log in to the ILEAP system to manage your OJT requirements and applications.</p>
                    
                    <p>If you have any questions, please contact your OJT Coordinator.</p>
                    
                    <p>Best regards,<br>ILEAP System</p>
                </div>
            </body>
        </html>
        """
        
        part = MIMEText(html_content, "html")
        message.attach(part)
        
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        
        print(f"Email sent successfully to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {str(e)}")


async def send_all_credentials(credentials_list: list):
    """Background task to send all student credentials"""
    for cred in credentials_list:
        send_student_credentials_email(
            cred['email'],
            cred['sr_code'],
            cred['first_name'],
            cred['last_name'],
            cred['password']
        )


@router.post("", response_model=dict)
async def create_class(
    background_tasks: BackgroundTasks,
    school_year: str = Form(...),
    semester: str = Form(...),
    program: str = Form(...),
    section: str = Form(...),
    class_section: str = Form(...),
    students_csv: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new class and import students from CSV"""
    
    # Verify user is an OJT Coordinator
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can create classes")
    
    # Get coordinator info
    coordinator = db.query(OJTCoordinator).filter(
        OJTCoordinator.user_id == current_user['user_id']
    ).first()
    
    if not coordinator:
        raise HTTPException(status_code=404, detail="OJT Coordinator profile not found")
    
    # Validate CSV file
    if not students_csv.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be a CSV")
    
    # Process CSV file
    students_data = await process_csv_file(students_csv)
    
    # Create class data
    class_data = ClassCreate(
        school_year=school_year,
        semester=semester,
        program=program,
        section=section,
        class_section=class_section
    )
    
    # Create class and students
    result = create_class_with_students(
        db=db,
        class_data=class_data,
        coordinator_id=coordinator.ojt_coordinator_id,
        students_data=students_data
    )
    
    # Send credentials emails in background
    background_tasks.add_task(send_all_credentials, result['credentials'])
    
    new_count = len(result['students'])
    enrolled_count = len(result.get('enrolled_students', []))
    
    message_parts = []
    if new_count > 0:
        message_parts.append(f"{new_count} new student(s) created")
    if enrolled_count > 0:
        message_parts.append(f"{enrolled_count} existing student(s) enrolled")
    
    detail_message = " and ".join(message_parts) if message_parts else "no students"
    
    return {
        "status": "success",
        "message": f"Class {class_section} created successfully with {detail_message}",
        "class_id": result['class'].class_id,
        "total_students": result['total_students'],
        "new_students": new_count,
        "enrolled_students": enrolled_count
    }


@router.get("", response_model=dict)
def get_my_classes(
    skip: int = 0,
    limit: int = 100,
    school_year: Optional[str] = None,
    semester: Optional[str] = None,
    program: Optional[str] = None,
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all classes for the current OJT Coordinator"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can access this endpoint")
    
    coordinator = db.query(OJTCoordinator).filter(
        OJTCoordinator.user_id == current_user['user_id']
    ).first()
    
    if not coordinator:
        raise HTTPException(status_code=404, detail="OJT Coordinator profile not found")
    
    result = get_classes_by_coordinator(
        db=db,
        coordinator_id=coordinator.ojt_coordinator_id,
        skip=skip,
        limit=limit,
        school_year=school_year,
        semester=semester,
        program=program,
        search=search
    )
    
    # Format response
    classes_data = []
    for cls in result['classes']:
        # Count students through enrollments
        students_count = len(cls.enrollments)
        # TODO: Add pass/fail tracking when status field is added to students
        passed = 0
        failed = 0
        
        classes_data.append({
            'class_id': cls.class_id,
            'schoolyear': cls.school_year,
            'semester': cls.semester,
            'classSection': cls.class_section,
            'students': students_count,
            'passed': passed,
            'failed': failed
        })
    
    return {
        "status": "success",
        "total": result['total'],
        "classes": classes_data
    }


@router.get("/{class_id}/students", response_model=dict)
def get_class_students(
    class_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all students in a specific class"""
    from models import Class, Student, ClassEnrollment, RequirementSubmission, Internship, Employer, InternshipApplication, DailyTimeLog
    from sqlalchemy import func
    from datetime import time as dt_time
    import json
    
    # Get the class
    class_obj = db.query(Class).filter(Class.class_id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found")
    
    # Get all students enrolled in this class through the junction table
    students = db.query(Student).join(
        ClassEnrollment, 
        Student.student_id == ClassEnrollment.student_id
    ).filter(
        ClassEnrollment.class_id == class_id,
        ClassEnrollment.status == "active"
    ).all()
    
    # Total pre-OJT requirements (hardcoded count based on frontend list)
    total_pre_ojt_requirements = 15
    
    students_data = []
    for s in students:
        # Debug: Check all requirement submissions for this student
        all_submissions = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == s.student_id
        ).all()
        
        print(f"\n=== Student: {s.first_name} {s.last_name} (ID: {s.student_id}) ===")
        print(f"Total submissions in DB: {len(all_submissions)}")
        for sub in all_submissions:
            print(f"  - Req ID: {sub.requirement_id}, Status: {sub.status}, Returned: {sub.returned}, Validated: {sub.validated}")
        
        # Get company name if student has accepted internship application
        company_name = None
        accepted_application = db.query(InternshipApplication).filter(
            InternshipApplication.student_id == s.student_id,
            InternshipApplication.status == "accepted"
        ).first()
        
        if accepted_application:
            internship = db.query(Internship).filter(
                Internship.internship_id == accepted_application.internship_id
            ).first()
            
            if internship:
                employer = db.query(Employer).filter(
                    Employer.employer_id == internship.employer_id
                ).first()
                company_name = employer.company_name if employer else None
        
        # Count submitted pre-OJT requirements that haven't been returned (requirement_id 1-15)
        # Status can be "submitted" or "approved"
        accomplished_requirements = db.query(func.count(RequirementSubmission.id)).filter(
            RequirementSubmission.student_id == s.student_id,
            RequirementSubmission.requirement_id <= 15,  # Pre-OJT requirements
            RequirementSubmission.returned == False
        ).scalar() or 0
        
        print(f"Student {s.first_name} {s.last_name}: {accomplished_requirements} requirements counted")
        
        # Determine OJT status
        ojt_status = "Not Started"
        if accomplished_requirements == total_pre_ojt_requirements:
            # All pre-OJT requirements completed
            if accepted_application and accepted_application.ojt_start_date:
                ojt_status = "Ongoing"  # Or "Completed" based on hours
            else:
                ojt_status = "Not Started"
        
        # Calculate total OJT hours from daily time logs (only valid logs)
        time_logs = db.query(DailyTimeLog).filter(
            DailyTimeLog.student_id == s.student_id,
            DailyTimeLog.status == "complete"
        ).all()
        
        total_ojt_hours = 0
        invalid_logs_count = 0
        
        # Get employer work schedule for validation
        work_schedule = None
        if accepted_application:
            internship = db.query(Internship).filter(
                Internship.internship_id == accepted_application.internship_id
            ).first()
            if internship:
                employer = db.query(Employer).filter(
                    Employer.employer_id == internship.employer_id
                ).first()
                if employer and employer.work_schedule:
                    try:
                        work_schedule = json.loads(employer.work_schedule)
                    except json.JSONDecodeError:
                        work_schedule = None
        
        # Validate each log and sum only valid hours
        for log in time_logs:
            is_invalid = False
            
            if work_schedule and log.time_in:
                log_day = log.time_in.strftime('%A')
                day_schedule = work_schedule.get(log_day)
                
                if day_schedule is None:
                    is_invalid = True  # Non-working day
                elif day_schedule.get('start') and day_schedule.get('end') and log.time_out:
                    try:
                        start_parts = day_schedule['start'].split(':')
                        end_parts = day_schedule['end'].split(':')
                        work_start = dt_time(int(start_parts[0]), int(start_parts[1]))
                        work_end = dt_time(int(end_parts[0]), int(end_parts[1]))
                        
                        time_in_time = log.time_in.time()
                        time_out_time = log.time_out.time()
                        
                        # Flag invalid if completely outside working hours or same time
                        if time_out_time < work_start or time_in_time > work_end or time_in_time == time_out_time:
                            is_invalid = True
                    except (KeyError, ValueError, IndexError):
                        pass
            
            if not is_invalid:
                total_ojt_hours += float(log.total_hours) if log.total_hours else 0
            else:
                invalid_logs_count += 1
        
        # Check if OJT is completed (all hours done)
        student_required_hours = s.required_hours or 486
        if total_ojt_hours >= student_required_hours and ojt_status == "Ongoing":
            ojt_status = "Completed"
        
        # Count post-OJT requirements (requirement_id 16-19) that are validated
        post_ojt_completed = db.query(func.count(RequirementSubmission.id)).filter(
            RequirementSubmission.student_id == s.student_id,
            RequirementSubmission.requirement_id >= 16,  # Post-OJT requirements
            RequirementSubmission.requirement_id <= 19,
            RequirementSubmission.validated == True
        ).scalar() or 0
        
        students_data.append({
            "student_id": s.student_id,
            "sr_code": s.sr_code,
            "name": f"{s.first_name} {s.last_name}",
            "email": s.email,
            "contact_number": s.contact_number,
            "status": s.status,
            "company": company_name,
            "accomplished": accomplished_requirements,
            "total": total_pre_ojt_requirements,
            "ojtStatus": ojt_status,
            "hoursCompleted": total_ojt_hours,
            "hoursRequired": student_required_hours,
            "invalidLogsCount": invalid_logs_count,
            "postCompleted": post_ojt_completed,
            "postTotal": 4,  # Default post-OJT requirements
            "finalGrade": s.final_grade,  # Include final grade
            "selectedGrade": "",  # For frontend binding
            "gradeSaving": False  # For frontend state
        })
    
    return {
        "status": "success",
        "students": students_data,
        "total": len(students_data)
    }


@router.get("/programs", response_model=list)
def get_department_programs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all programs for the coordinator's department"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can access this endpoint")
    
    coordinator = db.query(OJTCoordinator).filter(
        OJTCoordinator.user_id == current_user['user_id']
    ).first()
    
    if not coordinator:
        raise HTTPException(status_code=404, detail="OJT Coordinator profile not found")
    
    programs = get_programs_by_department(db, coordinator.department_id)
    
    return [
        {
            "label": program.program_name,
            "value": program.abbrev if program.abbrev else program.program_name
        }
        for program in programs
    ]


@router.get("/sections/{program_abbrev}", response_model=list)
def get_program_sections(
    program_abbrev: str,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all sections for a specific program"""
    
    if current_user['role'] != 'ojt_coordinator':
        raise HTTPException(status_code=403, detail="Only OJT Coordinators can access this endpoint")
    
    # Find program by abbreviation
    program = db.query(Program).filter(Program.abbrev == program_abbrev).first()
    
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    # Get all active sections for this program
    sections = db.query(Section).filter(
        Section.program_id == program.program_id,
        Section.status == "active"
    ).order_by(Section.year_level, Section.section_name).all()
    
    return [
        {
            "label": f"Year {section.year_level} - {section.section_name}",
            "value": section.section_name
        }
        for section in sections
    ]
