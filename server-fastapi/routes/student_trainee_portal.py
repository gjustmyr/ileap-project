"""
Student Trainee Portal Routes
All endpoints for the Student Trainee portal with /api/student-trainee prefix
Only accessible by users with student_trainee role
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import User, Student, Internship, InternshipApplication, Employer, Industry
from middleware.auth import verify_token
import json

# Import only the student controller functions that exist
from controllers.student_controller import (
    get_student_profile,
    update_student_profile_with_picture,
    upload_profile_picture,
    get_all_skills,
    add_student_skill,
    remove_student_skill,
    get_student_class_info
)

router = APIRouter(prefix="/api/student-trainee", tags=["Student Trainee Portal"])


def verify_student_trainee(token_data: dict = Depends(verify_token)):
    """Verify that the current user has student role"""
    if token_data.get("role") != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Only students can access this endpoint."
        )
    return token_data


# ============================================================================
# PROFILE ENDPOINTS
# ============================================================================

@router.get("/profile")
def student_get_profile(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get student profile"""
    return get_student_profile(token_data["user_id"], db)


@router.put("/profile")
def student_update_profile(
    profile_data: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Update student profile"""
    # Parse profile_data if provided
    parsed_data = None
    if profile_data:
        try:
            parsed_data = json.loads(profile_data)
        except:
            parsed_data = None
    
    return update_student_profile_with_picture(
        token_data["user_id"],
        parsed_data,
        profile_picture,
        db
    )


@router.post("/profile/picture")
def student_upload_profile_picture(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Upload student profile picture"""
    return upload_profile_picture(token_data["user_id"], file, db)


@router.get("/class-info")
def student_get_class_info(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get student class information"""
    return get_student_class_info(token_data["user_id"], db)


@router.get("/hiring-status")
def student_get_hiring_status(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get student hiring status"""
    from models import Student, InternshipApplication, RequirementSubmission, Internship, Employer
    from sqlalchemy import text
    from datetime import datetime, date
    
    # Get student record
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        return {
            "is_hired": False,
            "employer_info": None,
            "all_requirements_validated": False
        }
    
    # Check if student has an accepted internship application
    accepted_application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted'
    ).first()
    
    employer_info = None
    if accepted_application:
        internship = db.query(Internship).filter(
            Internship.internship_id == accepted_application.internship_id
        ).first()
        
        if internship:
            employer = db.query(Employer).filter(
                Employer.employer_id == internship.employer_id
            ).first()
            
            # Get assigned supervisor
            supervisor_name = None
            supervisor_query = db.execute(
                text("""
                SELECT ts.first_name, ts.last_name
                FROM student_supervisor_assignments ssa
                JOIN trainee_supervisors ts ON ssa.supervisor_id = ts.supervisor_id
                WHERE ssa.student_id = :student_id 
                  AND ssa.internship_application_id = :application_id
                  AND ssa.status = 'active'
                LIMIT 1
                """),
                {
                    "student_id": student.student_id,
                    "application_id": accepted_application.application_id
                }
            )
            supervisor_row = supervisor_query.fetchone()
            if supervisor_row:
                supervisor_name = f"{supervisor_row[0]} {supervisor_row[1]}"
            
            if employer:
                employer_info = {
                    "company_name": employer.company_name,
                    "position": internship.title,
                    "internship_id": internship.internship_id,
                    "ojt_start_date": accepted_application.ojt_start_date.isoformat() if accepted_application.ojt_start_date else None,
                    "supervisor_name": supervisor_name
                }
    
    # Check if all submitted requirements are validated
    all_requirements_validated = False
    if student.student_id:
        submissions = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == student.student_id
        ).all()
        
        if submissions:
            all_validated = all(sub.validated for sub in submissions if sub.status == 'submitted' or sub.validated)
            has_validated = any(sub.validated for sub in submissions)
            all_requirements_validated = all_validated and has_validated
    
    # Determine if student can start OJT
    can_start_ojt = (
        accepted_application is not None and 
        all_requirements_validated and 
        accepted_application.ojt_start_date is not None
    )
    
    # Check if OJT period has started
    has_ojt_started = False
    if can_start_ojt and accepted_application.ojt_start_date:
        start_date = accepted_application.ojt_start_date.date() if hasattr(accepted_application.ojt_start_date, 'date') else accepted_application.ojt_start_date
        today = date.today()
        has_ojt_started = today >= start_date
    
    return {
        "is_hired": accepted_application is not None,
        "employer_info": employer_info,
        "all_requirements_validated": all_requirements_validated,
        "can_start_ojt": can_start_ojt,
        "has_ojt_started": has_ojt_started,
        "ojt_readiness": {
            "has_accepted_application": accepted_application is not None,
            "requirements_validated": all_requirements_validated,
            "has_start_date": accepted_application.ojt_start_date is not None if accepted_application else False,
            "ready_to_start": can_start_ojt,
            "ojt_active": has_ojt_started
        }
    }


@router.get("/personal-history-statement-data")
def student_get_phs_data(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get personal history statement data"""
    from models import Student, Class, Department, Campus, OJTCoordinator, OJTHead, Program, ClassEnrollment, InternshipApplication, Internship, Employer, TraineeSupervisor
    
    # Get student record
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        return {"status": "error", "message": "Student not found"}
    
    # Get class through enrollment
    enrollment = db.query(ClassEnrollment).filter(
        ClassEnrollment.student_id == student.student_id,
        ClassEnrollment.status == "active"
    ).first()
    
    student_class = None
    department = None
    campus = None
    program = None
    ojt_coordinator = None
    ojt_head = None
    
    if enrollment:
        student_class = db.query(Class).filter(Class.class_id == enrollment.class_id).first()
        
        if student_class:
            program = db.query(Program).filter(
                Program.program_id == student_class.program_id
            ).first()
            
            if program:
                department = db.query(Department).filter(
                    Department.department_id == program.department_id
                ).first()
                
                if department:
                    campus = db.query(Campus).filter(
                        Campus.campus_id == department.campus_id
                    ).first()
                    
                    ojt_head = db.query(OJTHead).filter(
                        OJTHead.campus_id == department.campus_id
                    ).first()
            
            if student_class.ojt_coordinator_id:
                ojt_coordinator = db.query(OJTCoordinator).filter(
                    OJTCoordinator.ojt_coordinator_id == student_class.ojt_coordinator_id
                ).first()
    
    # Get internship/hiring information through application
    application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == "accepted"
    ).first()
    
    employer = None
    supervisor = None
    company_name = None
    company_address = None
    company_department = None
    company_representative = None
    supervisor_name = None
    training_schedule = None
    ojt_start_date = None
    ojt_end_date = None
    
    if application:
        internship = db.query(Internship).filter(
            Internship.internship_id == application.internship_id
        ).first()
        
        if internship:
            employer = db.query(Employer).filter(
                Employer.employer_id == internship.employer_id
            ).first()
            
            if employer:
                company_name = employer.company_name
                company_address = employer.address
                company_representative = employer.representative_name
                
                # Parse work_schedule JSON to format training schedule
                if employer.work_schedule:
                    try:
                        import json
                        from datetime import datetime
                        schedule = json.loads(employer.work_schedule)
                        
                        # Helper function to convert 24-hour to 12-hour format
                        def format_time(time_str):
                            try:
                                time_obj = datetime.strptime(time_str, "%H:%M")
                                return time_obj.strftime("%I:%M %p").lstrip('0')
                            except:
                                return time_str
                        
                        # Collect days and times
                        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                        working_days = []
                        time_ranges = {}
                        
                        for day in day_order:
                            if day in schedule and schedule[day] and isinstance(schedule[day], dict):
                                hours = schedule[day]
                                if 'start' in hours and 'end' in hours:
                                    working_days.append(day)
                                    time_key = f"{hours['start']}-{hours['end']}"
                                    if time_key not in time_ranges:
                                        time_ranges[time_key] = []
                                    time_ranges[time_key].append(day)
                        
                        # Format the schedule string
                        if working_days:
                            schedule_parts = []
                            for time_key, days in time_ranges.items():
                                start_time, end_time = time_key.split('-')
                                formatted_start = format_time(start_time)
                                formatted_end = format_time(end_time)
                                
                                # Group consecutive days
                                if len(days) > 1 and days == day_order[day_order.index(days[0]):day_order.index(days[-1])+1]:
                                    day_str = f"{days[0]}-{days[-1]}"
                                else:
                                    day_str = ", ".join(days)
                                
                                schedule_parts.append(f"{day_str}: {formatted_start} - {formatted_end}")
                            
                            training_schedule = "; ".join(schedule_parts)
                    except:
                        training_schedule = None
        
        # Get assigned supervisor from student_supervisor_assignments
        from models import StudentSupervisorAssignment
        assignment = db.query(StudentSupervisorAssignment).filter(
            StudentSupervisorAssignment.student_id == student.student_id,
            StudentSupervisorAssignment.internship_application_id == application.application_id,
            StudentSupervisorAssignment.status == "active"
        ).first()
        
        if assignment:
            supervisor = db.query(TraineeSupervisor).filter(
                TraineeSupervisor.supervisor_id == assignment.supervisor_id
            ).first()
            
            if supervisor:
                supervisor_name = f"{supervisor.first_name} {supervisor.last_name}"
                # Get supervisor's department as company department
                if supervisor.department:
                    company_department = supervisor.department
        
        ojt_start_date = application.ojt_start_date
        
        # Calculate end date based on required hours (assuming 8 hours per day)
        if ojt_start_date and student.required_hours:
            from datetime import timedelta
            days_needed = student.required_hours / 8
            ojt_end_date = ojt_start_date + timedelta(days=int(days_needed))
    
    return {
        "status": "success",
        "data": {
            "first_name": student.first_name,
            "middle_name": student.middle_name or "",
            "last_name": student.last_name,
            "age": student.age,
            "sex": student.sex,
            "height": student.height,
            "weight": student.weight,
            "complexion": student.complexion,
            "disability": student.disability or "",
            "birthdate": student.birthdate,
            "birthplace": student.birthplace,
            "citizenship": student.citizenship,
            "civil_status": student.civil_status,
            "present_address": student.present_address,
            "contact_number": student.contact_number,
            "tel_no_present": student.tel_no_present or "",
            "provincial_address": student.provincial_address or "",
            "tel_no_provincial": student.tel_no_provincial or "",
            "father_name": student.father_name or "",
            "father_occupation": student.father_occupation or "",
            "mother_name": student.mother_name or "",
            "mother_occupation": student.mother_occupation or "",
            "parents_address": student.parents_address or "",
            "parents_tel_no": student.parents_tel_no or "",
            "guardian_name": student.guardian_name or "",
            "guardian_tel_no": student.guardian_tel_no or "",
            "program": program.program_name if program else (student.program or ""),
            "major": student.major or "",
            "department": department.department_name if department else (student.department or ""),
            "year_level": student.year_level or "",
            "program_length": student.length_of_program or "",
            "length_of_program": student.length_of_program or "",
            "school_address": campus.campus_address if campus else (student.school_address or ""),
            "campus_name": campus.campus_name if campus else "",
            "campus": campus.campus_name if campus else "",
            "college": department.department_name if department else "",
            "ojt_coordinator": f"{ojt_coordinator.first_name} {ojt_coordinator.last_name}" if ojt_coordinator else (student.ojt_coordinator or ""),
            "ojt_coordinator_tel": ojt_coordinator.contact_number if ojt_coordinator else (student.ojt_coordinator_tel or ""),
            "ojt_head": f"{ojt_head.first_name} {ojt_head.last_name}" if ojt_head else (student.ojt_head or ""),
            "ojt_head_tel": ojt_head.contact_number if ojt_head else (student.ojt_head_tel or ""),
            "dean": department.dean_name if department else (student.dean or ""),
            "dean_tel": department.dean_contact if department else (student.dean_tel or ""),
            "emergency_contact_name": student.emergency_contact_name or "",
            "emergency_contact_relationship": student.emergency_contact_relationship or "",
            "emergency_contact_address": student.emergency_contact_address or "",
            "emergency_contact_tel": student.emergency_contact_tel or "",
            "profile_picture": student.profile_picture or "",
            "required_hours": student.required_hours or 486,
            "company_name": company_name or "",
            "company_address": company_address or "",
            "company_department": company_department or "",
            "company_representative": company_representative or "",
            "supervisor_name": supervisor_name or "",
            "training_schedule": training_schedule or "",
            "ojt_start_date": str(ojt_start_date) if ojt_start_date else "",
            "ojt_end_date": str(ojt_end_date) if ojt_end_date else ""
        }
    }


# ============================================================================
# SKILLS ENDPOINTS
# ============================================================================

@router.get("/skills")
def student_get_all_skills(db: Session = Depends(get_db)):
    """Get all available skills"""
    return get_all_skills(db)


@router.post("/skills")
def student_add_skill(
    skill_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Add skill to student profile"""
    skill_name = skill_data.get("skill_name")
    return add_student_skill(token_data["user_id"], skill_name, db)


@router.delete("/skills/{skill_id}")
def student_remove_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Remove skill from student profile"""
    return remove_student_skill(token_data["user_id"], skill_id, db)


# ============================================================================
# INTERNSHIP ENDPOINTS
# ============================================================================

@router.get("/internships/available")
def student_get_available_internships(
    keyword: Optional[str] = Query(None),
    industry_id: Optional[int] = Query(None),
    employer_id: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get available internship opportunities"""
    query = db.query(Internship).filter(Internship.status == "open")
    
    if keyword:
        query = query.filter(Internship.title.ilike(f"%{keyword}%"))
    
    if industry_id:
        query = query.join(Employer).filter(Employer.industry_id == industry_id)
    
    if employer_id:
        query = query.filter(Internship.employer_id == employer_id)
    
    internships = query.all()
    
    result = []
    for internship in internships:
        employer = db.query(Employer).filter(Employer.employer_id == internship.employer_id).first()
        industry = db.query(Industry).filter(Industry.industry_id == employer.industry_id).first() if employer else None
        
        # Get skills for this internship
        skills = [{"skill_id": skill.skill_id, "skill_name": skill.skill_name} for skill in internship.skills]
        
        result.append({
            "internship_id": internship.internship_id,
            "title": internship.title,
            "description": internship.full_description,
            "full_description": internship.full_description,
            "posting_type": internship.posting_type,
            "status": internship.status,
            "created_at": internship.created_at.isoformat() if internship.created_at else None,
            "updated_at": internship.updated_at.isoformat() if internship.updated_at else None,
            "company_name": employer.company_name if employer else None,
            "employer_id": employer.employer_id if employer else None,
            "industry_name": industry.industry_name if industry else None,
            "industry_id": industry.industry_id if industry else None,
            "address": employer.address if employer else None,
            "skills": skills
        })
    
    return {"data": result}


@router.get("/internships/my-applications")
def student_get_my_applications(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get student's internship applications"""
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        return {"data": []}
    
    applications = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id
    ).all()
    
    result = []
    for app in applications:
        internship = db.query(Internship).filter(Internship.internship_id == app.internship_id).first()
        employer = db.query(Employer).filter(Employer.employer_id == internship.employer_id).first() if internship else None
        
        result.append({
            "application_id": app.application_id,
            "internship_id": app.internship_id,
            "status": app.status,
            "created_at": app.created_at.isoformat() if app.created_at else None,
            "application_letter": app.application_letter,
            "resume_path": app.resume_path,
            "remarks": app.remarks,
            "internship": {
                "title": internship.title if internship else None,
                "company_name": employer.company_name if employer else None
            } if internship else None
        })
    
    return {"data": result}


@router.get("/internships/{internship_id}")
def student_get_internship_details(
    internship_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get internship details by ID"""
    internship = db.query(Internship).filter(Internship.internship_id == internship_id).first()
    if not internship:
        raise HTTPException(status_code=404, detail="Internship not found")
    
    employer = db.query(Employer).filter(Employer.employer_id == internship.employer_id).first()
    industry = db.query(Industry).filter(Industry.industry_id == employer.industry_id).first() if employer else None
    
    # Get skills for this internship
    skills = [{"skill_id": skill.skill_id, "skill_name": skill.skill_name} for skill in internship.skills]
    
    return {
        "data": {
            "internship_id": internship.internship_id,
            "title": internship.title,
            "description": internship.full_description,
            "full_description": internship.full_description,
            "posting_type": internship.posting_type,
            "status": internship.status,
            "created_at": internship.created_at.isoformat() if internship.created_at else None,
            "updated_at": internship.updated_at.isoformat() if internship.updated_at else None,
            "company_name": employer.company_name if employer else None,
            "employer_id": employer.employer_id if employer else None,
            "industry_name": industry.industry_name if industry else None,
            "address": employer.address if employer else None,
            "skills": skills
        }
    }


@router.post("/internships/{internship_id}/apply")
def student_apply_to_internship(
    internship_id: int,
    application_letter: str = Form(...),
    resume: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Apply to an internship"""
    from config import get_upload_path
    import uuid
    from pathlib import Path
    
    # Get student
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Check if already applied
    existing = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.internship_id == internship_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already applied to this internship")
    
    # Handle resume upload
    resume_path = None
    if resume:
        upload_dir = Path(get_upload_path("resumes"))
        upload_dir.mkdir(parents=True, exist_ok=True)
        
        file_ext = Path(resume.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = upload_dir / unique_filename
        
        with open(file_path, "wb") as f:
            f.write(resume.file.read())
        
        resume_path = f"uploads/resumes/{unique_filename}"
    
    # Create application
    application = InternshipApplication(
        student_id=student.student_id,
        internship_id=internship_id,
        application_letter=application_letter,
        resume_path=resume_path,
        status="pending"
    )
    
    db.add(application)
    db.commit()
    
    return {
        "success": True,
        "message": "Application submitted successfully",
        "application_id": application.application_id
    }


@router.delete("/internships/applications/{application_id}")
def student_withdraw_application(
    application_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Withdraw an internship application"""
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    application = db.query(InternshipApplication).filter(
        InternshipApplication.application_id == application_id,
        InternshipApplication.student_id == student.student_id
    ).first()
    
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != "pending":
        raise HTTPException(status_code=400, detail="Can only withdraw pending applications")
    
    db.delete(application)
    db.commit()
    
    return {"success": True, "message": "Application withdrawn successfully"}


# ============================================================================
# REFERENCE DATA ENDPOINTS
# ============================================================================

@router.get("/companies")
def student_get_companies(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get all companies/employers"""
    employers = db.query(Employer).filter(Employer.status == "active").all()
    return {
        "data": [
            {
                "employer_id": e.employer_id,
                "company_name": e.company_name,
                "address": e.address
            }
            for e in employers
        ]
    }


@router.get("/industries")
def student_get_industries(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get all industries"""
    industries = db.query(Industry).filter(Industry.status == "active").all()
    return {
        "data": [
            {
                "industry_id": i.industry_id,
                "industry_name": i.industry_name
            }
            for i in industries
        ]
    }


# ============================================================================
# REQUIREMENTS ENDPOINTS
# ============================================================================

@router.get("/requirements/student/{student_id}")
def student_get_requirements(
    student_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Get student requirements - students can only view their own"""
    from models import RequirementSubmission, RequirementTemplate
    
    # Get student to verify ownership
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student or student.student_id != student_id:
        raise HTTPException(
            status_code=403,
            detail="You can only view your own requirements"
        )
    
    # Get all requirement submissions for this student
    submissions = db.query(RequirementSubmission).filter(
        RequirementSubmission.student_id == student_id
    ).all()
    
    result = []
    for sub in submissions:
        template = db.query(RequirementTemplate).filter(
            RequirementTemplate.requirement_id == sub.requirement_id
        ).first()
        
        result.append({
            "submission_id": sub.id,  # Changed from sub.submission_id to sub.id
            "requirement_id": sub.requirement_id,
            "requirement_name": template.title if template else "Unknown",
            "file_url": sub.file_url,
            "status": sub.status,
            "validated": sub.validated,
            "returned": sub.returned,
            "remarks": sub.remarks,
            "submitted_at": sub.submitted_at.isoformat() if sub.submitted_at else None
        })
    
    return {"status": "success", "requirements": result}


@router.post("/requirements/upload")
def student_upload_requirement(
    requirement_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_student_trainee)
):
    """Upload a requirement file"""
    from models import RequirementSubmission, ClassEnrollment
    from config import get_upload_path
    import uuid
    from pathlib import Path
    from utils.datetime_helper import now as philippine_now, utcnow as philippine_utcnow
    
    # Get student
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get student's class enrollment
    enrollment = db.query(ClassEnrollment).filter(
        ClassEnrollment.student_id == student.student_id
    ).first()
    
    if not enrollment:
        raise HTTPException(status_code=400, detail="Student is not enrolled in any class")
    
    # Handle file upload
    upload_dir = Path(get_upload_path("requirements"))
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate unique filename
    timestamp = philippine_now().strftime("%Y%m%d_%H%M%S")
    file_ext = Path(file.filename).suffix
    unique_filename = f"student_{student.student_id}_req_{requirement_id}_{timestamp}{file_ext}"
    file_path = upload_dir / unique_filename
    
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    
    file_url = f"uploads/requirements/{unique_filename}"
    
    # Check if submission already exists
    existing = db.query(RequirementSubmission).filter(
        RequirementSubmission.student_id == student.student_id,
        RequirementSubmission.requirement_id == requirement_id
    ).first()
    
    if existing:
        # Update existing submission
        existing.file_url = file_url
        existing.status = "submitted"
        existing.validated = False
        existing.returned = False
        existing.submitted_at = philippine_utcnow()
    else:
        # Create new submission
        submission = RequirementSubmission(
            student_id=student.student_id,
            class_id=enrollment.class_id,  # Get class_id from enrollment
            requirement_id=requirement_id,
            file_url=file_url,
            status="submitted",
            validated=False,
            submitted_at=philippine_utcnow()
        )
        db.add(submission)
    
    db.commit()
    
    return {
        "success": True,
        "message": "Requirement uploaded successfully",
        "file_url": file_url
    }
