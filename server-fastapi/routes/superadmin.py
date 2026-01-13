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


# ============= MAJORS =============
@router.get("/programs/{program_id}/majors")
async def get_majors_by_program(
    program_id: int,
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all majors for a program (superadmin)"""
    from controllers import major_controller
    return major_controller.get_all_majors(program_id, pageNo, pageSize, keyword, db)


@router.post("/programs/{program_id}/majors", status_code=status.HTTP_201_CREATED)
async def create_major(
    program_id: int,
    major: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new major (superadmin only)"""
    from controllers import major_controller
    from schemas.major import MajorCreate
    major_data = MajorCreate(**major, program_id=program_id)
    return major_controller.add_major(major_data, db)


@router.put("/majors/{major_id}")
async def update_major(
    major_id: int,
    major: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a major (superadmin only)"""
    from controllers import major_controller
    from schemas.major import MajorUpdate
    major_data = MajorUpdate(**major)
    return major_controller.update_major(major_id, major_data, db)


@router.delete("/majors/{major_id}")
async def delete_major(
    major_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Delete a major (superadmin only)"""
    from controllers import major_controller
    return major_controller.remove_major(major_id, db)


# ============= SECTIONS =============
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
    return section_controller.get_all_sections(major_id, pageNo, pageSize, keyword, db)


@router.post("/majors/{major_id}/sections", status_code=status.HTTP_201_CREATED)
async def create_section(
    major_id: int,
    section: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Create a new section (superadmin only)"""
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
        alumni.updated_at = datetime.utcnow()
        
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
