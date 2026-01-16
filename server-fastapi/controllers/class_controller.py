from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException
from models import Class, Student, User, Program, ClassEnrollment
from schemas.class_schema import ClassCreate, StudentCSVRow
import csv
import io
import secrets
import string
from passlib.context import CryptContext
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def generate_password(length=12):
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password


def validate_sr_code(sr_code: str) -> bool:
    """Validate SR Code format XX-XXXXX"""
    if not sr_code or len(sr_code) != 8:
        return False
    parts = sr_code.split('-')
    if len(parts) != 2:
        return False
    if len(parts[0]) != 2 or len(parts[1]) != 5:
        return False
    if not parts[0].isdigit() or not parts[1].isdigit():
        return False
    return True


async def process_csv_file(csv_file: UploadFile) -> list:
    """Process CSV file and return list of student records"""
    try:
        contents = await csv_file.read()
        decoded = contents.decode('utf-8')
        csv_reader = csv.DictReader(io.StringIO(decoded))
        
        students = []
        for row_num, row in enumerate(csv_reader, start=2):
            # Validate required fields
            sr_code = row.get('SR Code', '').strip()
            first_name = row.get('First Name', '').strip()
            last_name = row.get('Last Name', '').strip()
            email = row.get('Email', '').strip()
            
            if not all([sr_code, first_name, last_name, email]):
                raise HTTPException(
                    status_code=400,
                    detail=f"Row {row_num}: Missing required fields"
                )
            
            # Validate SR Code format
            if not validate_sr_code(sr_code):
                raise HTTPException(
                    status_code=400,
                    detail=f"Row {row_num}: Invalid SR Code format. Expected XX-XXXXX (e.g., 12-34567)"
                )
            
            students.append({
                'sr_code': sr_code,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
                'required_hours': int(row.get('Required Hours', 486) or 486)  # Default to 486 if not provided
            })
        
        if not students:
            raise HTTPException(
                status_code=400,
                detail="CSV file is empty or contains no valid data"
            )
        
        return students
    
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid CSV file encoding. Please use UTF-8"
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing CSV file: {str(e)}"
        )


def create_class_with_students(
    db: Session,
    class_data: ClassCreate,
    coordinator_id: int,
    students_data: list
):
    """Create a new class and associated student accounts"""
    
    # Get program_id from program code
    program = db.query(Program).filter(Program.abbrev == class_data.program).first()
    if not program:
        raise HTTPException(status_code=404, detail=f"Program {class_data.program} not found")
    
    # Create the class
    new_class = Class(
        ojt_coordinator_id=coordinator_id,
        program_id=program.program_id,
        school_year=class_data.school_year,
        semester=class_data.semester,
        section=class_data.section,
        class_section=class_data.class_section,
        status="active"
    )
    db.add(new_class)
    db.flush()  # Get the class_id
    
    created_students = []
    enrolled_students = []
    student_credentials = []
    
    for student_data in students_data:
        # Check if student already exists by SR Code
        existing_student = db.query(Student).filter(Student.sr_code == student_data['sr_code']).first()
        
        if existing_student:
            # Student exists, just enroll them in this class
            # Check if already enrolled in this class
            existing_enrollment = db.query(ClassEnrollment).filter(
                ClassEnrollment.student_id == existing_student.student_id,
                ClassEnrollment.class_id == new_class.class_id
            ).first()
            
            if not existing_enrollment:
                # Create new enrollment for existing student
                new_enrollment = ClassEnrollment(
                    student_id=existing_student.student_id,
                    class_id=new_class.class_id,
                    enrollment_date=datetime.utcnow(),
                    status="active"
                )
                db.add(new_enrollment)
                enrolled_students.append(existing_student)
            # If already enrolled, skip silently
            continue
        
        # Check if email already exists (but student doesn't - edge case)
        existing_user = db.query(User).filter(User.email_address == student_data['email']).first()
        if existing_user:
            # Email exists but no student record - this shouldn't happen normally
            # Skip this student to avoid conflicts
            continue
        
        # Generate password
        plain_password = generate_password()
        hashed_password = pwd_context.hash(plain_password)
        
        # Create user account
        new_user = User(
            email_address=student_data['email'],
            password=hashed_password,
            role="student"
        )
        db.add(new_user)
        db.flush()
        
        # Create student record
        new_student = Student(
            user_id=new_user.user_id,
            sr_code=student_data['sr_code'],
            first_name=student_data['first_name'],
            last_name=student_data['last_name'],
            email=student_data['email'],
            required_hours=student_data.get('required_hours', 486),
            status="active"
        )
        db.add(new_student)
        db.flush()  # Get the student_id
        
        # Create enrollment record
        new_enrollment = ClassEnrollment(
            student_id=new_student.student_id,
            class_id=new_class.class_id,
            enrollment_date=datetime.utcnow(),
            status="active"
        )
        db.add(new_enrollment)
        created_students.append(new_student)
        student_credentials.append({
            'email': student_data['email'],
            'sr_code': student_data['sr_code'],
            'first_name': student_data['first_name'],
            'last_name': student_data['last_name'],
            'password': plain_password
        })
    
    db.commit()
    db.refresh(new_class)
    
    total_students = len(created_students) + len(enrolled_students)
    
    return {
        'class': new_class,
        'students': created_students,
        'enrolled_students': enrolled_students,
        'total_students': total_students,
        'credentials': student_credentials
    }


def get_classes_by_coordinator(
    db: Session,
    coordinator_id: int,
    skip: int = 0,
    limit: int = 100,
    school_year: str = None,
    semester: str = None,
    program: str = None,
    search: str = None
):
    """Get all classes for a specific coordinator with filters"""
    query = db.query(Class).filter(Class.ojt_coordinator_id == coordinator_id)
    
    if school_year:
        query = query.filter(Class.school_year == school_year)
    
    if semester:
        query = query.filter(Class.semester == semester)
    
    if program:
        query = query.join(Program).filter(Program.abbrev == program)
    
    if search:
        query = query.filter(
            (Class.class_section.ilike(f"%{search}%")) |
            (Class.school_year.ilike(f"%{search}%"))
        )
    
    total = query.count()
    classes = query.offset(skip).limit(limit).all()
    
    return {'total': total, 'classes': classes}


def get_programs_by_department(db: Session, department_id: int):
    """Get all active programs for a specific department"""
    programs = db.query(Program).filter(
        Program.department_id == department_id,
        Program.status == "active"
    ).all()
    
    return programs
