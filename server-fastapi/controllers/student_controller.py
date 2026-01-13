from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile
from models import Student, User, Skill, ClassEnrollment, Class, Program, Department, OJTCoordinator
import os
import uuid
from pathlib import Path


def get_student_profile(user_id: int, db: Session):
    """Get student profile by user_id"""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    user = db.query(User).filter(User.user_id == user_id).first()
    
    # Get student skills
    skills = [{"skill_id": skill.skill_id, "skill_name": skill.skill_name} for skill in student.skills]
    
    # Get campus info from class enrollment
    campus_name = None
    if student.class_enrollments:
        enrollment = student.class_enrollments[0]  # Get first enrollment
        if enrollment.class_enrolled and enrollment.class_enrolled.program:
            program = enrollment.class_enrolled.program
            if program.department and program.department.campus:
                campus_name = program.department.campus.campus_name
    
    return {
        "status": "success",
        "message": "Profile retrieved successfully",
        "data": {
            "student_id": student.student_id,
            "sr_code": student.sr_code,
            "first_name": student.first_name,
            "middle_name": student.middle_name,
            "last_name": student.last_name,
            "email": user.email_address if user else student.email,
            "age": student.age,
            "sex": student.sex,
            "height": student.height,
            "weight": student.weight,
            "complexion": student.complexion,
            "disability": student.disability,
            "birthdate": str(student.birthdate) if student.birthdate else None,
            "birthplace": student.birthplace,
            "citizenship": student.citizenship,
            "civil_status": student.civil_status,
            "about": student.about,
            "present_address": student.present_address,
            "provincial_address": student.provincial_address,
            "contact_number": student.contact_number,
            "tel_no_present": student.tel_no_present,
            "tel_no_provincial": student.tel_no_provincial,
            "father_name": student.father_name,
            "father_occupation": student.father_occupation,
            "mother_name": student.mother_name,
            "mother_occupation": student.mother_occupation,
            "parents_address": student.parents_address,
            "parents_tel_no": student.parents_tel_no,
            "guardian_name": student.guardian_name,
            "guardian_tel_no": student.guardian_tel_no,
            "program": student.program,
            "major": student.major,
            "department": student.department,
            "year_level": student.year_level,
            "length_of_program": student.length_of_program,
            "school_address": student.school_address,
            "ojt_coordinator": student.ojt_coordinator,
            "ojt_coordinator_tel": student.ojt_coordinator_tel,
            "ojt_head": student.ojt_head,
            "ojt_head_tel": student.ojt_head_tel,
            "dean": student.dean,
            "dean_tel": student.dean_tel,
            "emergency_contact_name": student.emergency_contact_name,
            "emergency_contact_relationship": student.emergency_contact_relationship,
            "emergency_contact_address": student.emergency_contact_address,
            "emergency_contact_tel": student.emergency_contact_tel,
            "profile_picture": student.profile_picture,
            "status": student.status,
            "campus_name": campus_name,
            "skills": skills
        }
    }


def update_student_profile(user_id: int, profile_data: dict, db: Session):
    """Update student profile"""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Update only provided fields
    update_data = profile_data.dict(exclude_unset=True)
    
    print(f"\n=== PROFILE UPDATE ===")
    print(f"User ID: {user_id}")
    print(f"Fields to update: {list(update_data.keys())}")
    print(f"Data received: {update_data}")
    
    updated_fields = []
    for field, value in update_data.items():
        if hasattr(student, field):
            setattr(student, field, value)
            updated_fields.append(field)
            print(f"✓ Updated {field}: {value}")
        else:
            print(f"✗ Field {field} not found on Student model")
    
    print(f"Total fields updated: {len(updated_fields)}")
    
    # Update email in User table if provided and different
    if 'email' in update_data:
        user = db.query(User).filter(User.user_id == user_id).first()
        if user and user.email_address != update_data['email']:
            # Check if email already exists for another user
            existing_user = db.query(User).filter(
                User.email_address == update_data['email'],
                User.user_id != user_id
            ).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already exists")
            user.email_address = update_data['email']
            print(f"✓ Updated email in User table")
    
    db.commit()
    db.refresh(student)
    print(f"✓ Profile saved to database\n")
    
    return {
        "status": "success",
        "message": "Profile updated successfully",
        "data": {
            "student_id": student.student_id,
            "updated_fields": updated_fields
        }
    }


def upload_profile_picture(user_id: int, file: UploadFile, db: Session):
    """Upload student profile picture"""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Validate file type
    allowed_types = ["image/jpeg", "image/jpg", "image/png"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only JPEG and PNG images are allowed")
    
    # Get upload directory from config
    from config import get_upload_path
    upload_dir = get_upload_path("profile_pictures")
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = upload_dir / unique_filename
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    # Update student record
    student.profile_picture = str(file_path)
    db.commit()
    db.refresh(student)
    
    return {
        "status": "success",
        "message": "Profile picture uploaded successfully",
        "data": {
            "profile_picture": str(file_path)
        }
    }


def get_all_skills(db: Session):
    """Get all available skills"""
    skills = db.query(Skill).filter(Skill.status == "active").all()
    return {
        "status": "success",
        "data": [{"skill_id": skill.skill_id, "skill_name": skill.skill_name} for skill in skills]
    }


def add_student_skill(user_id: int, skill_name: str, db: Session):
    """Add a skill to student profile. Create skill if it doesn't exist."""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Check if skill exists, create if not
    skill = db.query(Skill).filter(Skill.skill_name == skill_name).first()
    if not skill:
        skill = Skill(skill_name=skill_name, status="active")
        db.add(skill)
        db.commit()
        db.refresh(skill)
    
    # Check if student already has this skill
    if skill in student.skills:
        raise HTTPException(status_code=400, detail="Skill already added")
    
    # Add skill to student
    student.skills.append(skill)
    db.commit()
    
    return {
        "status": "success",
        "message": "Skill added successfully",
        "data": {"skill_id": skill.skill_id, "skill_name": skill.skill_name}
    }


def remove_student_skill(user_id: int, skill_id: int, db: Session):
    """Remove a skill from student profile"""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    skill = db.query(Skill).filter(Skill.skill_id == skill_id).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    if skill not in student.skills:
        raise HTTPException(status_code=400, detail="Student doesn't have this skill")
    
    student.skills.remove(skill)
    db.commit()
    
    return {
        "status": "success",
        "message": "Skill removed successfully"
    }


def get_student_class_info(user_id: int, db: Session):
    """Get student's class information with program, department, coordinator, and dean details"""
    student = db.query(Student).filter(Student.user_id == user_id).first()
    
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found")
    
    # Get the student's active class enrollment
    enrollment = db.query(ClassEnrollment).filter(
        ClassEnrollment.student_id == student.student_id,
        ClassEnrollment.status == "active"
    ).first()
    
    if not enrollment:
        return {
            "status": "success",
            "message": "No active class enrollment found",
            "data": None
        }
    
    # Get the class
    class_info = db.query(Class).filter(Class.class_id == enrollment.class_id).first()
    if not class_info:
        return {
            "status": "success",
            "message": "Class not found",
            "data": None
        }
    
    # Get the program
    program = db.query(Program).filter(Program.program_id == class_info.program_id).first()
    if not program:
        return {
            "status": "success",
            "message": "Program not found",
            "data": None
        }
    
    # Get the department
    department = db.query(Department).filter(Department.department_id == program.department_id).first()
    
    # Get the OJT coordinator
    coordinator = db.query(OJTCoordinator).filter(
        OJTCoordinator.ojt_coordinator_id == class_info.ojt_coordinator_id
    ).first()
    
    return {
        "status": "success",
        "message": "Class information retrieved successfully",
        "data": {
            "class_section": class_info.class_section,
            "school_year": class_info.school_year,
            "semester": class_info.semester,
            "program": {
                "program_id": program.program_id,
                "program_name": program.program_name,
                "abbrev": program.abbrev
            },
            "department": {
                "department_id": department.department_id,
                "department_name": department.department_name,
                "abbrev": department.abbrev,
                "dean_name": department.dean_name,
                "dean_email": department.dean_email,
                "dean_contact": department.dean_contact
            } if department else None,
            "ojt_coordinator": {
                "ojt_coordinator_id": coordinator.ojt_coordinator_id,
                "first_name": coordinator.first_name,
                "last_name": coordinator.last_name,
                "contact_number": coordinator.contact_number,
                "position_title": coordinator.position_title
            } if coordinator else None
        }
    }
