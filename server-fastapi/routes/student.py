from fastapi import APIRouter, Depends, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from controllers import student_controller
from schemas.student import StudentProfileUpdate, StudentProfileResponse
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter(prefix="/api/students", tags=["Students"])


class AddSkillRequest(BaseModel):
    skill_name: str


@router.get("/profile", response_model=StudentProfileResponse)
async def get_student_profile(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get current student's profile"""
    return student_controller.get_student_profile(token_data["user_id"], db)


@router.put("/profile")
async def update_student_profile(
    profile_data: Optional[str] = Form(None),
    profile_picture: Optional[UploadFile] = File(None),
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update current student's profile with optional profile picture"""
    # Parse profile_data if provided
    parsed_data = None
    if profile_data:
        try:
            parsed_data = json.loads(profile_data)
        except:
            parsed_data = None
    
    return student_controller.update_student_profile_with_picture(
        token_data["user_id"], 
        parsed_data, 
        profile_picture, 
        db
    )


@router.post("/profile/picture")
async def upload_profile_picture(
    file: UploadFile = File(...),
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Upload student profile picture"""
    return student_controller.upload_profile_picture(token_data["user_id"], file, db)


@router.get("/skills")
async def get_all_skills(db: Session = Depends(get_db)):
    """Get all available skills"""
    return student_controller.get_all_skills(db)


@router.post("/skills")
async def add_student_skill(
    request: AddSkillRequest,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Add skill to student profile"""
    return student_controller.add_student_skill(token_data["user_id"], request.skill_name, db)


@router.delete("/skills/{skill_id}")
async def remove_student_skill(
    skill_id: int,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Remove skill from student profile"""
    return student_controller.remove_student_skill(token_data["user_id"], skill_id, db)


@router.get("/class-info")
async def get_student_class_info(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get student's class information including program, department, coordinator, and dean"""
    return student_controller.get_student_class_info(token_data["user_id"], db)


@router.get("/hiring-status")
async def get_hiring_status(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get student's hiring status and requirements validation status"""
    from models import Student, InternshipApplication, RequirementSubmission, Internship, Employer, TraineeSupervisor
    from sqlalchemy import text
    
    print(f"🔍 Checking hiring status for user_id: {token_data['user_id']}")
    
    # Get student record
    student = db.query(Student).filter(Student.user_id == token_data["user_id"]).first()
    if not student:
        print(f"❌ No student found for user_id: {token_data['user_id']}")
        return {
            "is_hired": False,
            "employer_info": None,
            "all_requirements_validated": False
        }
    
    print(f"✅ Found student: {student.student_id}")
    
    # Check if student has an accepted internship application
    accepted_application = db.query(InternshipApplication).filter(
        InternshipApplication.student_id == student.student_id,
        InternshipApplication.status == 'accepted'
    ).first()
    
    print(f"📋 Accepted application: {accepted_application}")
    
    employer_info = None
    if accepted_application:
        internship = db.query(Internship).filter(
            Internship.internship_id == accepted_application.internship_id
        ).first()
        
        if internship:
            employer = db.query(Employer).filter(
                Employer.employer_id == internship.employer_id
            ).first()
            
            # Get assigned supervisor for this student
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
                print(f"🏢 Employer info: {employer_info}")
    
    # Check if all submitted requirements are validated
    all_requirements_validated = False
    if student.student_id:
        # Get all requirement submissions for this student
        submissions = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == student.student_id
        ).all()
        
        print(f"📄 Total submissions: {len(submissions)}")
        
        # Check if there are any submissions and if all are validated
        if submissions:
            validated_count = sum(1 for sub in submissions if sub.validated)
            print(f"✅ Validated: {validated_count}/{len(submissions)}")
            
            # Check if all submitted requirements are validated
            all_validated = all(sub.validated for sub in submissions if sub.status == 'submitted' or sub.validated)
            # Must have at least some validated requirements to be considered complete
            has_validated = any(sub.validated for sub in submissions)
            all_requirements_validated = all_validated and has_validated
    
    # Determine if student can start OJT (all conditions met)
    can_start_ojt = (
        accepted_application is not None and 
        all_requirements_validated and 
        accepted_application.ojt_start_date is not None
    )
    
    # Check if OJT period has already started (current date >= start date)
    from datetime import datetime, date
    has_ojt_started = False
    if can_start_ojt and accepted_application.ojt_start_date:
        # Compare dates only (ignore time)
        start_date = accepted_application.ojt_start_date.date() if hasattr(accepted_application.ojt_start_date, 'date') else accepted_application.ojt_start_date
        today = date.today()
        has_ojt_started = today >= start_date
        print(f"📅 OJT Start Date: {start_date}, Today: {today}, Has Started: {has_ojt_started}")
    
    result = {
        "is_hired": accepted_application is not None,
        "employer_info": employer_info,
        "all_requirements_validated": all_requirements_validated,
        "can_start_ojt": can_start_ojt,
        "has_ojt_started": has_ojt_started,  # NEW: OJT period has begun
        "ojt_readiness": {
            "has_accepted_application": accepted_application is not None,
            "requirements_validated": all_requirements_validated,
            "has_start_date": accepted_application.ojt_start_date is not None if accepted_application else False,
            "ready_to_start": can_start_ojt,
            "ojt_active": has_ojt_started  # NEW: Can now log hours and submit daily accomplishments
        }
    }
    
    print(f"🎯 Final result: {result}")
    return result


@router.get("/ongoing-ojts")
async def get_all_ongoing_ojts(
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all ongoing OJT records (for OJT Coordinator/Head view)"""
    from datetime import datetime
    
    # Query all accepted applications with start dates
    ongoing_ojts = db.query(
        InternshipApplication,
        Student,
        Internship,
        Employer
    ).join(
        Student, InternshipApplication.student_id == Student.student_id
    ).join(
        Internship, InternshipApplication.internship_id == Internship.internship_id
    ).join(
        Employer, Internship.employer_id == Employer.employer_id
    ).filter(
        InternshipApplication.status == 'accepted',
        InternshipApplication.ojt_start_date.isnot(None)
    ).all()
    
    result = []
    for application, student, internship, employer in ongoing_ojts:
        # Check if requirements are validated
        submissions = db.query(RequirementSubmission).filter(
            RequirementSubmission.student_id == student.student_id
        ).all()
        
        all_validated = False
        if submissions:
            all_validated = all(sub.validated for sub in submissions if sub.status == 'submitted' or sub.validated)
            has_validated = any(sub.validated for sub in submissions)
            all_validated = all_validated and has_validated
        
        # Determine OJT status
        ojt_status = "Not Started"
        if application.ojt_start_date:
            if datetime.utcnow().date() >= application.ojt_start_date.date():
                ojt_status = "Ongoing" if all_validated else "Waiting for Requirements Validation"
            else:
                ojt_status = "Scheduled"
        
        result.append({
            "student_id": student.student_id,
            "student_name": f"{student.first_name} {student.last_name}",
            "sr_code": student.sr_code,
            "email": student.email,
            "company_name": employer.company_name,
            "position": internship.title,
            "ojt_start_date": application.ojt_start_date.isoformat() if application.ojt_start_date else None,
            "requirements_validated": all_validated,
            "ojt_status": ojt_status,
            "application_id": application.application_id,
            "internship_id": internship.internship_id
        })
    
    return {
        "total": len(result),
        "ongoing_ojts": result
    }


class GradeSubmission(BaseModel):
    grade: str


@router.post("/{student_id}/grade")
async def submit_student_grade(
    student_id: int,
    grade_data: GradeSubmission,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Submit final grade for a student (OJT Coordinator only)"""
    from models import Student
    from sqlalchemy import text
    
    # Verify that user is OJT Coordinator
    if token_data.get("role") != "ojt_coordinator":
        return {"success": False, "message": "Only OJT Coordinators can submit grades"}
    
    # Get student record
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        return {"success": False, "message": "Student not found"}
    
    # Update student's final grade
    try:
        student.final_grade = grade_data.grade
        db.commit()
        return {
            "success": True,
            "message": "Grade submitted successfully",
            "student_id": student_id,
            "grade": grade_data.grade
        }
    except Exception as e:
        db.rollback()
        print(f"Error submitting grade: {str(e)}")
        return {"success": False, "message": "Failed to submit grade"}

