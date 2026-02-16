from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from controllers import (
    campus_controller,
    department_controller,
    program_controller,
    employer_controller,
    industry_controller,
    ojt_coordinator_controller
)
from schemas.campus import CampusCreate, CampusUpdate
from schemas.department import DepartmentCreate, DepartmentUpdate
from schemas.program import ProgramCreate, ProgramUpdate
from schemas.employer import EmployerCreate, EmployerUpdate
from schemas.industry import IndustryCreate, IndustryUpdate
from typing import Optional

router = APIRouter(prefix="/api/superadmin", tags=["Superadmin"])


def verify_superadmin(token_data: dict = Depends(verify_token)):
    """Verify that the user is a superadmin"""
    if token_data.get("role") != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmin can access this resource"
        )
    return token_data


# ============= CAMPUSES =============
@router.get("/campuses/main/list")
async def get_main_campuses(
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all main campuses for superadmin"""
    return campus_controller.get_main_campuses(db)


@router.get("/campuses")
async def get_all_campuses(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all campuses for superadmin"""
    return campus_controller.get_all_campuses(pageNo, pageSize, keyword, db)


@router.post("/campuses", status_code=status.HTTP_201_CREATED)
async def create_campus(
    campus: CampusCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new campus (superadmin only)"""
    return campus_controller.add_campus(campus, db)


@router.put("/campuses/{campus_id}")
async def update_campus(
    campus_id: int,
    campus: CampusUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a campus (superadmin only)"""
    return campus_controller.update_campus(campus_id, campus, db)


@router.delete("/campuses/{campus_id}")
async def delete_campus(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete a campus (superadmin only)"""
    return campus_controller.remove_campus(campus_id, db)


@router.put("/campuses/{campus_id}/toggle-status")
async def toggle_campus_status(
    campus_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Toggle campus status (superadmin only)"""
    return campus_controller.toggle_campus_status(campus_id, db)


# ============= DEPARTMENTS =============
@router.get("/departments")
async def get_all_departments(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all departments for superadmin with campus filtering"""
    return department_controller.get_all_departments(pageNo, pageSize, keyword, campus_id, db)


@router.post("/departments", status_code=status.HTTP_201_CREATED)
async def create_department(
    department: DepartmentCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new department (superadmin only)"""
    return department_controller.add_department(department, db)


@router.put("/departments/{department_id}")
async def update_department(
    department_id: int,
    department: DepartmentUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a department (superadmin only)"""
    return department_controller.update_department(department_id, department, db)


@router.delete("/departments/{department_id}")
async def delete_department(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete a department (superadmin only)"""
    return department_controller.remove_department(department_id, db)


@router.put("/departments/{department_id}/toggle-status")
async def toggle_department_status(
    department_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Toggle department status (superadmin only)"""
    return department_controller.toggle_department_status(department_id, db)


# ============= PROGRAMS =============
@router.get("/programs")
async def get_all_programs(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all programs for superadmin with department filtering"""
    return program_controller.get_all_programs(pageNo, pageSize, keyword, department_id, db)


@router.post("/programs", status_code=status.HTTP_201_CREATED)
async def create_program(
    program: ProgramCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new program (superadmin only)"""
    return program_controller.add_program(program, db)


@router.put("/programs/{program_id}")
async def update_program(
    program_id: int,
    program: ProgramUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a program (superadmin only)"""
    return program_controller.update_program(program_id, program, db)


@router.delete("/programs/{program_id}")
async def delete_program(
    program_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete a program (superadmin only)"""
    return program_controller.remove_program(program_id, db)


@router.put("/programs/{program_id}/toggle-status")
async def toggle_program_status(
    program_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Toggle program status (superadmin only)"""
    return program_controller.toggle_program_status(program_id, db)


# ============= EMPLOYERS =============
@router.get("/employers")
async def get_all_employers(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    industry_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all employers for superadmin"""
    return employer_controller.get_all_employers(db=db, page=pageNo, per_page=pageSize, keyword=keyword, industry_id=industry_id)


@router.post("/employers", status_code=status.HTTP_201_CREATED)
async def create_employer(
    employer: EmployerCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new employer (superadmin only)"""
    return employer_controller.register_employer(employer, db)


@router.put("/employers/{employer_id}")
async def update_employer(
    employer_id: int,
    employer: EmployerUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update an employer (superadmin only)"""
    return employer_controller.update_employer(employer_id, employer, db)


@router.delete("/employers/{employer_id}")
async def delete_employer(
    employer_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete an employer (superadmin only)"""
    return employer_controller.remove_employer(employer_id, db)


# ============= INDUSTRIES =============
@router.get("/industries")
async def get_all_industries(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all industries for superadmin"""
    return industry_controller.get_all_industries(db, pageNo, pageSize, keyword)


@router.post("/industries", status_code=status.HTTP_201_CREATED)
async def create_industry(
    industry: IndustryCreate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new industry (superadmin only)"""
    return industry_controller.create_industry(industry, db)


@router.put("/industries/{industry_id}")
async def update_industry(
    industry_id: int,
    industry: IndustryUpdate,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update an industry (superadmin only)"""
    return industry_controller.update_industry(industry_id, industry, db)


@router.delete("/industries/{industry_id}")
async def delete_industry(
    industry_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete an industry (superadmin only)"""
    return industry_controller.delete_industry(industry_id, db)


# ============= SECTIONS =============
@router.get("/sections")
async def get_all_sections(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    program_id: int = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all sections with optional filters (superadmin)"""
    from controllers import section_controller
    return section_controller.get_all_sections(pageNo, pageSize, keyword, program_id, db)


@router.post("/sections", status_code=status.HTTP_201_CREATED)
async def create_section(
    section: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new section (superadmin only)"""
    from controllers import section_controller
    from schemas.section import SectionCreate
    section_data = SectionCreate(**section)
    return section_controller.add_section(section_data, db)


@router.get("/majors/{major_id}/sections")
async def get_sections_by_major(
    major_id: int,
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all sections for a major (superadmin)"""
    from controllers import section_controller
    return section_controller.get_all_sections(pageNo, pageSize, keyword, None, major_id, db)


@router.post("/majors/{major_id}/sections", status_code=status.HTTP_201_CREATED)
async def create_section_for_major(
    major_id: int,
    section: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new section for a major (superadmin only)"""
    from controllers import section_controller
    from schemas.section import SectionCreate
    section_data = SectionCreate(**section, major_id=major_id)
    return section_controller.add_section(section_data, db)


@router.put("/sections/{section_id}")
async def update_section(
    section_id: int,
    section: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a section (superadmin only)"""
    from controllers import section_controller
    from schemas.section import SectionUpdate
    section_data = SectionUpdate(**section)
    return section_controller.update_section(section_id, section_data, db)


@router.delete("/sections/{section_id}")
async def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete a section (superadmin only)"""
    from controllers import section_controller
    return section_controller.remove_section(section_id, db)


@router.put("/sections/{section_id}/toggle-status")
async def toggle_section_status(
    section_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Toggle section status (superadmin only)"""
    from controllers import section_controller
    return section_controller.toggle_section_status(section_id, db)

# OJT Coordinator endpoints
@router.post("/ojt-coordinators/{user_id}/send-new-password")
async def send_new_password_superadmin(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Send new password to OJT coordinator (superadmin only - bypasses campus validation)"""
    from controllers import ojt_coordinator_controller
    # Superadmin can reset any coordinator's password without campus checks
    # We pass None as ojt_head_user_id since superadmin doesn't need campus validation
    return ojt_coordinator_controller.send_new_password_superadmin(user_id, db)

# Student Trainee endpoints
@router.get("/student-trainees")
async def get_all_student_trainees(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: Optional[int] = None,
    program_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all student trainees for superadmin"""
    from models import Student, User, ClassEnrollment, Class, Program, Department, Campus
    from sqlalchemy import or_
    
    # Base query with joins
    query = db.query(
        Student.student_id,
        Student.user_id,
        Student.sr_code,
        Student.first_name,
        Student.middle_name,
        Student.last_name,
        Student.email,
        User.email_address,
        Campus.campus_name,
        Campus.campus_id,
        Program.program_name,
        Program.program_id
    ).join(User, User.user_id == Student.user_id)\
     .outerjoin(ClassEnrollment, ClassEnrollment.student_id == Student.student_id)\
     .outerjoin(Class, Class.class_id == ClassEnrollment.class_id)\
     .outerjoin(Program, Program.program_id == Class.program_id)\
     .outerjoin(Department, Department.department_id == Program.department_id)\
     .outerjoin(Campus, Campus.campus_id == Department.campus_id)
    
    # Apply filters
    if keyword:
        search_filter = or_(
            Student.first_name.ilike(f"%{keyword}%"),
            Student.last_name.ilike(f"%{keyword}%"),
            Student.sr_code.ilike(f"%{keyword}%"),
            Student.email.ilike(f"%{keyword}%"),
            User.email_address.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
    
    if campus_id:
        query = query.filter(Campus.campus_id == campus_id)
    
    if program_id:
        query = query.filter(Program.program_id == program_id)
    
    # Get total count
    total_records = query.distinct().count()
    
    # Apply pagination
    offset = (pageNo - 1) * pageSize
    students_data = query.distinct().offset(offset).limit(pageSize).all()
    
    # Transform to response format
    students = []
    for s in students_data:
        students.append({
            "student_id": s.student_id,
            "user_id": s.user_id,
            "sr_code": s.sr_code,
            "first_name": s.first_name,
            "middle_name": s.middle_name,
            "last_name": s.last_name,
            "email": s.email_address or s.email,
            "campus_name": s.campus_name,
            "campus_id": s.campus_id,
            "program_name": s.program_name,
            "program_id": s.program_id
        })
    
    return {
        "status": "success",
        "data": students,
        "pagination": {
            "page": pageNo,
            "per_page": pageSize,
            "total_records": total_records,
            "total_pages": (total_records + pageSize - 1) // pageSize
        }
    }

@router.post("/student-trainees/{user_id}/send-new-password")
async def send_new_password_student(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Send new password to student trainee (superadmin only)"""
    from models import Student, User
    import bcrypt
    import secrets
    import string
    import os
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    # Get student
    user = db.query(User).filter(User.user_id == user_id, User.role == "student").first()
    if not user:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student = db.query(Student).filter(Student.user_id == user_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    try:
        # Generate new password
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        new_password = ''.join(secrets.choice(characters) for _ in range(12))
        new_password = new_password[:72]  # BCrypt limit
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            new_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Update password
        user.password = hashed_password
        db.commit()
        db.refresh(user)
        
        # Send email
        email_body = f"""Hello {student.first_name} {student.last_name},

Your password has been reset by the System Administrator.

Email: {user.email_address}
New Password: {new_password}

Please login and change your password immediately for security.

Best regards,
ILEAP System"""
        
        try:
            msg = MIMEMultipart()
            msg['From'] = os.getenv("EMAIL_USER")
            msg['To'] = user.email_address
            msg['Subject'] = "Password Reset - ILEAP System"
            msg.attach(MIMEText(email_body, 'plain'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
            server.quit()
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")
        
        return {
            "status": "SUCCESS",
            "data": [],
            "message": "New password generated and sent to email successfully."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reset password: {str(e)}"
        )

# Alumni endpoints
@router.get("/alumni")
async def get_all_alumni(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    program_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all alumni for superadmin"""
    from models import Alumni, Program
    from sqlalchemy import or_
    
    # Base query
    query = db.query(
        Alumni.alumni_id,
        Alumni.sr_code,
        Alumni.first_name,
        Alumni.middle_name,
        Alumni.last_name,
        Alumni.email,
        Alumni.graduation_year,
        Program.program_name,
        Program.program_id
    ).outerjoin(Program, Program.program_id == Alumni.program_id)
    
    # Apply filters
    if keyword:
        search_filter = or_(
            Alumni.first_name.ilike(f"%{keyword}%"),
            Alumni.last_name.ilike(f"%{keyword}%"),
            Alumni.sr_code.ilike(f"%{keyword}%"),
            Alumni.email.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
    
    if program_id:
        query = query.filter(Alumni.program_id == program_id)
    
    # Get total count
    total_records = query.count()
    
    # Apply pagination
    offset = (pageNo - 1) * pageSize
    alumni_data = query.offset(offset).limit(pageSize).all()
    
    # Transform to response format
    alumni = []
    for a in alumni_data:
        alumni.append({
            "alumni_id": a.alumni_id,
            "sr_code": a.sr_code,
            "first_name": a.first_name,
            "middle_name": a.middle_name,
            "last_name": a.last_name,
            "email": a.email,
            "graduation_year": a.graduation_year,
            "program_name": a.program_name,
            "program_id": a.program_id
        })
    
    return {
        "status": "success",
        "data": alumni,
        "pagination": {
            "page": pageNo,
            "per_page": pageSize,
            "total_records": total_records,
            "total_pages": (total_records + pageSize - 1) // pageSize
        }
    }


@router.post("/alumni")
async def create_alumni(
    alumni_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create new alumni"""
    from models import Alumni
    
    try:
        new_alumni = Alumni(
            sr_code=alumni_data.get('sr_code'),
            first_name=alumni_data['first_name'],
            middle_name=alumni_data.get('middle_name'),
            last_name=alumni_data['last_name'],
            email=alumni_data['email'],
            program_id=alumni_data.get('program_id'),
            graduation_year=alumni_data.get('graduation_year')
        )
        
        db.add(new_alumni)
        db.commit()
        db.refresh(new_alumni)
        
        return {
            "status": "success",
            "data": {
                "alumni_id": new_alumni.alumni_id,
                "message": "Alumni created successfully"
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create alumni: {str(e)}"
        )


@router.put("/alumni/{alumni_id}")
async def update_alumni(
    alumni_id: int,
    alumni_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update alumni"""
    from models import Alumni
    
    alumni = db.query(Alumni).filter(Alumni.alumni_id == alumni_id).first()
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    try:
        alumni.sr_code = alumni_data.get('sr_code')
        alumni.first_name = alumni_data['first_name']
        alumni.middle_name = alumni_data.get('middle_name')
        alumni.last_name = alumni_data['last_name']
        alumni.email = alumni_data['email']
        alumni.program_id = alumni_data.get('program_id')
        alumni.graduation_year = alumni_data.get('graduation_year')
        alumni.updated_at = philippine_utcnow()
        
        db.commit()
        db.refresh(alumni)
        
        return {
            "status": "success",
            "data": {
                "alumni_id": alumni.alumni_id,
                "message": "Alumni updated successfully"
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update alumni: {str(e)}"
        )


@router.delete("/alumni/{alumni_id}")
async def delete_alumni(
    alumni_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete alumni"""
    from models import Alumni
    
    alumni = db.query(Alumni).filter(Alumni.alumni_id == alumni_id).first()
    if not alumni:
        raise HTTPException(status_code=404, detail="Alumni not found")
    
    try:
        db.delete(alumni)
        db.commit()
        
        return {
            "status": "success",
            "data": {
                "message": "Alumni deleted successfully"
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete alumni: {str(e)}"
        )


# ============= JOB PLACEMENT OFFICERS =============
@router.get("/jp-officers")
async def get_all_jp_officers(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all job placement officers (superadmin only)"""
    from models import User, JobPlacementOfficer, Campus
    from sqlalchemy import or_
    
    try:
        # Query with join to JobPlacementOfficer profile
        query = db.query(
            User.user_id,
            User.email_address,
            JobPlacementOfficer.first_name,
            JobPlacementOfficer.last_name,
            JobPlacementOfficer.contact_number,
            JobPlacementOfficer.position_title,
            JobPlacementOfficer.campus_id,
            JobPlacementOfficer.status,
            JobPlacementOfficer.created_at,
            Campus.campus_name
        ).join(
            JobPlacementOfficer, User.user_id == JobPlacementOfficer.user_id
        ).outerjoin(
            Campus, JobPlacementOfficer.campus_id == Campus.campus_id
        ).filter(User.role == "job_placement_officer")
        
        # Apply search filter
        if keyword:
            search_filter = or_(
                JobPlacementOfficer.first_name.ilike(f"%{keyword}%"),
                JobPlacementOfficer.last_name.ilike(f"%{keyword}%"),
                User.email_address.ilike(f"%{keyword}%")
            )
            query = query.filter(search_filter)
        
        # Get total count
        total_records = query.count()
        
        # Apply pagination
        offset = (pageNo - 1) * pageSize
        jpo_data = query.offset(offset).limit(pageSize).all()
        
        # Transform to response format
        jpo_list = []
        for row in jpo_data:
            jpo_list.append({
                "user_id": row.user_id,
                "email_address": row.email_address,
                "first_name": row.first_name,
                "last_name": row.last_name,
                "contact_number": row.contact_number,
                "position_title": row.position_title,
                "campus_id": row.campus_id,
                "campus_name": row.campus_name,
                "status": row.status,
                "created_at": row.created_at.isoformat() if row.created_at else None
            })
        
        return {
            "status": "success",
            "data": jpo_list,
            "pagination": {
                "page": pageNo,
                "per_page": pageSize,
                "total_records": total_records,
                "total_pages": (total_records + pageSize - 1) // pageSize
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job placement officers: {str(e)}"
        )


@router.get("/jp-officers/{user_id}")
async def get_jp_officer_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get a specific job placement officer by user_id (superadmin only)"""
    from models import User, JobPlacementOfficer, Campus
    
    try:
        # Query with join
        result = db.query(
            User.user_id,
            User.email_address,
            JobPlacementOfficer.first_name,
            JobPlacementOfficer.last_name,
            JobPlacementOfficer.contact_number,
            JobPlacementOfficer.position_title,
            JobPlacementOfficer.campus_id,
            JobPlacementOfficer.status,
            Campus.campus_name
        ).join(
            JobPlacementOfficer, User.user_id == JobPlacementOfficer.user_id
        ).outerjoin(
            Campus, JobPlacementOfficer.campus_id == Campus.campus_id
        ).filter(
            User.user_id == user_id,
            User.role == "job_placement_officer"
        ).first()
        
        if not result:
            raise HTTPException(status_code=404, detail="Job placement officer not found")
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": result.user_id,
                "email_address": result.email_address,
                "first_name": result.first_name,
                "last_name": result.last_name,
                "contact_number": result.contact_number,
                "position_title": result.position_title,
                "campus_id": result.campus_id,
                "campus_name": result.campus_name,
                "status": result.status
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job placement officer: {str(e)}"
        )


@router.post("/jp-officers/register", status_code=status.HTTP_201_CREATED)
async def register_jp_officer(
    jpo_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Register a new job placement officer with auto-generated password (superadmin only)"""
    from models import User, JobPlacementOfficer, Campus
    from utils.datetime_helper import utcnow
    import bcrypt
    import secrets
    import string
    import os
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(
            User.email_address == jpo_data['email_address']
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email address already exists"
            )
        
        # Check if campus exists (if provided)
        if jpo_data.get('campus_id'):
            campus = db.query(Campus).filter(Campus.campus_id == jpo_data['campus_id']).first()
            if not campus:
                raise HTTPException(status_code=404, detail="Campus not found")
        
        # Generate random password
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        temp_password = ''.join(secrets.choice(characters) for _ in range(12))
        temp_password = temp_password[:72]  # BCrypt limit
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            temp_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create new user
        new_user = User(
            email_address=jpo_data['email_address'],
            password=hashed_password,
            role="job_placement_officer"
        )
        
        db.add(new_user)
        db.flush()
        
        # Create Job Placement Officer profile
        new_jpo = JobPlacementOfficer(
            user_id=new_user.user_id,
            first_name=jpo_data['first_name'],
            last_name=jpo_data['last_name'],
            contact_number=jpo_data.get('contact_number'),
            position_title=jpo_data.get('position_title'),
            campus_id=jpo_data.get('campus_id'),
            status=jpo_data.get('status', 'active'),
            created_at=utcnow(),
            updated_at=utcnow()
        )
        db.add(new_jpo)
        db.commit()
        db.refresh(new_user)
        
        # Send email with temporary password
        try:
            email_body = f"""Hello {jpo_data['first_name']} {jpo_data['last_name']},

You have been registered as a Job Placement Officer in the ILEAP System.

Email: {jpo_data['email_address']}
Temporary Password: {temp_password}

Please login and change your password immediately for security.

Best regards,
ILEAP System"""
            
            msg = MIMEMultipart()
            msg['From'] = os.getenv("EMAIL_USER")
            msg['To'] = jpo_data['email_address']
            msg['Subject'] = "Job Placement Officer Account - ILEAP System"
            msg.attach(MIMEText(email_body, 'plain'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
            server.quit()
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")
            # Don't fail the registration if email fails
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": new_user.user_id,
                "email_address": new_user.email_address
            },
            "message": "Job placement officer registered successfully. Temporary password sent to email."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to register job placement officer: {str(e)}"
        )


@router.patch("/jp-officers/{user_id}")
async def update_jp_officer(
    user_id: int,
    jpo_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a job placement officer (superadmin only)"""
    from models import User, JobPlacementOfficer
    from utils.datetime_helper import utcnow
    
    try:
        user = db.query(User).filter(
            User.user_id == user_id,
            User.role == "job_placement_officer"
        ).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Job placement officer not found")
        
        jpo_profile = db.query(JobPlacementOfficer).filter(
            JobPlacementOfficer.user_id == user_id
        ).first()
        
        if not jpo_profile:
            raise HTTPException(status_code=404, detail="Job placement officer profile not found")
        
        # Update User fields
        if 'email_address' in jpo_data:
            # Check if new email already exists
            existing = db.query(User).filter(
                User.email_address == jpo_data['email_address'],
                User.user_id != user_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")
            user.email_address = jpo_data['email_address']
        
        if 'status' in jpo_data:
            jpo_profile.status = jpo_data['status']
        
        # Update JobPlacementOfficer profile fields
        if 'first_name' in jpo_data:
            jpo_profile.first_name = jpo_data['first_name']
        if 'last_name' in jpo_data:
            jpo_profile.last_name = jpo_data['last_name']
        if 'contact_number' in jpo_data:
            jpo_profile.contact_number = jpo_data['contact_number']
        if 'position_title' in jpo_data:
            jpo_profile.position_title = jpo_data['position_title']
        if 'campus_id' in jpo_data:
            jpo_profile.campus_id = jpo_data['campus_id']
        
        jpo_profile.updated_at = utcnow()
        
        db.commit()
        db.refresh(user)
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": user.user_id,
                "message": "Job placement officer updated successfully"
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update job placement officer: {str(e)}"
        )


# ============= OJT HEAD =============
@router.get("/ojt-heads")
async def get_all_ojt_heads(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all OJT heads (superadmin only)"""
    from controllers import ojt_head_controller
    return ojt_head_controller.get_all_ojt_heads(db, pageNo, pageSize, keyword, campus_id)


@router.post("/ojt-heads/register", status_code=status.HTTP_201_CREATED)
async def register_ojt_head(
    ojt_head_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Register a new OJT head (superadmin only)"""
    from controllers import ojt_head_controller
    from schemas.ojt_head import OJTHeadCreate
    ojt_head = OJTHeadCreate(**ojt_head_data)
    return ojt_head_controller.register_ojt_head(ojt_head, db)


@router.patch("/ojt-heads/{user_id}")
async def update_ojt_head(
    user_id: int,
    ojt_head_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update an OJT head (superadmin only)"""
    from controllers import ojt_head_controller
    from schemas.ojt_head import OJTHeadUpdate
    ojt_head = OJTHeadUpdate(**ojt_head_data)
    return ojt_head_controller.update_ojt_head(user_id, ojt_head, db)


@router.post("/ojt-heads/{user_id}/send-new-password")
async def send_new_password_ojt_head(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Send new password to OJT head (superadmin only)"""
    from controllers import ojt_head_controller
    return ojt_head_controller.send_new_password(user_id, db)


# ============= OJT COORDINATORS =============
@router.get("/ojt-coordinators")
async def get_all_ojt_coordinators(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    campus_id: Optional[int] = None,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all OJT coordinators (superadmin only)"""
    from controllers import ojt_coordinator_controller
    # Superadmin can see all coordinators across all campuses
    return ojt_coordinator_controller.get_all_ojt_coordinators_for_superadmin(db, pageNo, pageSize, keyword, campus_id)


@router.post("/ojt-coordinators/register", status_code=status.HTTP_201_CREATED)
async def register_ojt_coordinator(
    coordinator_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Register a new OJT coordinator (superadmin only)"""
    from models import User, OJTCoordinator, Campus, Department
    from utils.datetime_helper import utcnow
    import bcrypt
    import secrets
    import string
    import os
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(
            User.email_address == coordinator_data['email_address']
        ).first()
        
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email address already exists"
            )
        
        # Check if campus exists
        campus = db.query(Campus).filter(
            Campus.campus_id == coordinator_data['campus_id']
        ).first()
        if not campus:
            raise HTTPException(status_code=404, detail="Campus not found")
        
        # Check if department exists
        department = db.query(Department).filter(
            Department.department_id == coordinator_data['department_id']
        ).first()
        if not department:
            raise HTTPException(status_code=404, detail="Department not found")
        
        # Generate random password
        characters = string.ascii_letters + string.digits + "!@#$%^&*"
        temp_password = ''.join(secrets.choice(characters) for _ in range(12))
        temp_password = temp_password[:72]  # BCrypt limit
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            temp_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create new user
        new_user = User(
            email_address=coordinator_data['email_address'],
            password=hashed_password,
            role="ojt_coordinator",
            created_at=utcnow(),
            updated_at=utcnow()
        )
        
        db.add(new_user)
        db.flush()
        
        # Create OJT Coordinator profile
        new_coordinator = OJTCoordinator(
            user_id=new_user.user_id,
            first_name=coordinator_data['first_name'],
            last_name=coordinator_data['last_name'],
            contact_number=coordinator_data.get('contact_number'),
            position_title=coordinator_data.get('position_title'),
            campus_id=coordinator_data['campus_id'],
            department_id=coordinator_data['department_id'],
            status="active"
        )
        db.add(new_coordinator)
        db.commit()
        db.refresh(new_user)
        
        # Send email with temporary password
        try:
            email_body = f"""Hello {coordinator_data['first_name']} {coordinator_data['last_name']},

You have been registered as an OJT Coordinator in the ILEAP System.

Email: {coordinator_data['email_address']}
Temporary Password: {temp_password}

Please login and change your password immediately for security.

Best regards,
ILEAP System"""
            
            msg = MIMEMultipart()
            msg['From'] = os.getenv("EMAIL_USER")
            msg['To'] = coordinator_data['email_address']
            msg['Subject'] = "OJT Coordinator Account - ILEAP System"
            msg.attach(MIMEText(email_body, 'plain'))
            
            server = smtplib.SMTP('smtp.gmail.com', 587)
            server.starttls()
            server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
            server.send_message(msg)
            server.quit()
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")
            # Don't fail the registration if email fails
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": new_user.user_id,
                "email_address": new_user.email_address
            },
            "message": "OJT coordinator registered successfully. Temporary password sent to email."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to register OJT coordinator: {str(e)}"
        )


@router.patch("/ojt-coordinators/{user_id}")
async def update_ojt_coordinator(
    user_id: int,
    coordinator_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update an OJT coordinator (superadmin only)"""
    from controllers import ojt_coordinator_controller
    from schemas.ojt_coordinator import OJTCoordinatorUpdate
    coordinator = OJTCoordinatorUpdate(**coordinator_data)
    return ojt_coordinator_controller.update_ojt_coordinator_superadmin(user_id, coordinator, db)
