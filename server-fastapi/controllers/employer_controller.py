from sqlalchemy.orm import Session
def get_all_companies(db: Session):
    """Return all companies (employer_id and company_name) in standard router response format."""
    companies = db.query(Employer.employer_id, Employer.company_name).all()
    result = [
        {"employer_id": c.employer_id, "company_name": c.company_name}
        for c in companies
    ]
    return {
        "status": "success",
        "data": result,
        "pagination": {
            "pageNo": 1,
            "pageSize": len(result),
            "totalRecords": len(result),
            "totalPages": 1
        }
    }
from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import Optional
import secrets
import string
import bcrypt
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

from models import Employer, User, Industry
from schemas.employer import EmployerCreate, EmployerUpdate, EmployerResponse, EmployerInternshipMinimalCreate, EmployerSimpleCreate


def generate_password(length=12):
    """Generate a random password"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*()"
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    return password[:72]  # BCrypt has a 72 byte limit


def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def send_email(to: str, subject: str, body: str):
    """Send email"""
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = os.getenv("EMAIL_USER")
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
        
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def get_all_employers(
    db: Session,
    page: int = 1,
    per_page: int = 10,
    keyword: Optional[str] = None,
    industry_id: Optional[int] = None,
    eligibility: Optional[str] = None,
    status_filter: Optional[str] = None
):
    """Get all employers with pagination, search, and filters"""
    
    # Base query with join to get industry name
    query = db.query(
        Employer.employer_id,
        Employer.user_id,
        Employer.company_name,
        Employer.company_overview,
        Employer.representative_name,
        Employer.company_size,
        Employer.industry_id,
        Industry.industry_name,
        Employer.email,
        Employer.phone_number,
        Employer.address,
        Employer.website,
        Employer.facebook,
        Employer.linkedin,
        Employer.twitter,
        Employer.logo,
        Employer.eligibility,
        Employer.internship_validity,
        Employer.job_placement_validity,
        Employer.moa_file,
        Employer.status,
        Employer.created_at,
        Employer.updated_at,
        User.email_address,
        User.user_id
    ).join(User, User.user_id == Employer.user_id)\
     .join(Industry, Industry.industry_id == Employer.industry_id)
    
    # Apply filters
    if keyword:
        search_filter = or_(
            Employer.company_name.ilike(f"%{keyword}%"),
            Employer.representative_name.ilike(f"%{keyword}%"),
            Employer.email.ilike(f"%{keyword}%"),
            Industry.industry_name.ilike(f"%{keyword}%"),
            User.email_address.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
    
    if industry_id:
        query = query.filter(Employer.industry_id == industry_id)
    
    if eligibility:
        query = query.filter(Employer.eligibility == eligibility)
    
    if status_filter:
        query = query.filter(Employer.status == status_filter)
    
    # Get total count
    total_records = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    employers_data = query.order_by(Employer.created_at.desc()).offset(offset).limit(per_page).all()
    
    # Transform to response format
    employers = []
    for emp in employers_data:
        employers.append({
            "employer_id": emp.employer_id,
            "user_id": emp.user_id,
            "email_address": emp.email_address,
            "company_name": emp.company_name,
            "company_overview": emp.company_overview,
            "representative_name": emp.representative_name,
            "company_size": emp.company_size,
            "industry_id": emp.industry_id,
            "industry_name": emp.industry_name,
            "email": emp.email,
            "phone_number": emp.phone_number,
            "address": emp.address,
            "website": emp.website,
            "facebook": emp.facebook,
            "linkedin": emp.linkedin,
            "twitter": emp.twitter,
            "logo": emp.logo,
            "eligibility": emp.eligibility,
            "internship_validity": emp.internship_validity,
            "job_placement_validity": emp.job_placement_validity,
            "moa_file": emp.moa_file,
            "status": emp.status,
            "created_at": emp.created_at,
            "updated_at": emp.updated_at
        })
    
    return {
        "status": "success",
        "data": employers,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total_records": total_records,
            "total_pages": (total_records + per_page - 1) // per_page
        }
    }


def register_employer(employer_data: EmployerCreate, db: Session):
    """Register a new employer"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email_address == employer_data.email_address).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email address already registered"
        )
    
    # Check if company email already exists
    existing_employer = db.query(Employer).filter(Employer.email == employer_data.email).first()
    if existing_employer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company email already registered"
        )
    
    # Check if industry exists
    industry = db.query(Industry).filter(Industry.industry_id == employer_data.industry_id).first()
    if not industry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Industry not found"
        )
    
    try:
        # Generate password
        generated_password = generate_password()
        hashed_password = hash_password(generated_password)
        
        # Create user account
        new_user = User(
            email_address=employer_data.email_address,
            password=hashed_password,
            role="employer"
        )
        db.add(new_user)
        db.flush()  # Get the user_id
        
        # Create employer profile
        new_employer = Employer(
            user_id=new_user.user_id,
            company_name=employer_data.company_name,
            company_overview=employer_data.company_overview,
            representative_name=employer_data.representative_name,
            company_size=employer_data.company_size,
            industry_id=employer_data.industry_id,
            email=employer_data.email,
            phone_number=employer_data.phone_number,
            address=employer_data.address,
            website=employer_data.website,
            facebook=employer_data.facebook,
            internship_validity=employer_data.internship_validity,
            job_placement_validity=employer_data.job_placement_validity,
            moa_file=employer_data.moa_file,
            linkedin=employer_data.linkedin,
            twitter=employer_data.twitter,
            eligibility=employer_data.eligibility,
            status="pending"
        )
        db.add(new_employer)
        db.commit()
        db.refresh(new_employer)
        
        # Send email with credentials
        email_subject = "Your Employer Account Has Been Created - ILEAP"
        email_body = f"""
        <h2>Welcome to ILEAP!</h2>
        <p>Dear {employer_data.representative_name},</p>
        <p>Your employer account for <strong>{employer_data.company_name}</strong> has been successfully created.</p>
        <p>Your login credentials are:</p>
        <ul>
            <li><strong>Email:</strong> {employer_data.email_address}</li>
            <li><strong>Password:</strong> {generated_password}</li>
        </ul>
        <p><strong>Eligibility:</strong> You are eligible to post for <strong>{employer_data.eligibility.replace('_', ' ').title()}</strong></p>
        <p>Please change your password after your first login.</p>
        <p>Your account status is currently <strong>pending</strong> approval. You will be notified once approved.</p>
        <br>
        <p>Best regards,<br>ILEAP Team</p>
        """
        
        send_email(employer_data.email_address, email_subject, email_body)
        
        return {
            "message": "Employer registered successfully. Credentials sent to email.",
            "employer_id": new_employer.employer_id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering employer: {str(e)}"
        )


def register_employer_internship_minimal(data: EmployerInternshipMinimalCreate, db: Session):
    """Register internship access with minimal data or merge with existing employer."""
    try:
        # Check if a user already exists
        user = db.query(User).filter(User.email_address == data.email_address).first()

        if user:
            # Try to find existing employer profile
            employer = db.query(Employer).filter(Employer.user_id == user.user_id).first()
            if employer:
                # Merge eligibility
                if str(employer.eligibility) == 'job_placement':
                    employer.eligibility = 'both'
                elif str(employer.eligibility) not in ['internship', 'both']:
                    employer.eligibility = 'internship'
                # Set validity (store end date only per current schema)
                employer.internship_validity = data.internship_end
                # Set MOA
                employer.moa_file = data.moa_file
                db.commit()
                return {"message": "Employer updated: internship access enabled", "employer_id": employer.employer_id}

        # No user or employer: create minimal account
        generated_password = generate_password()
        hashed_password = hash_password(generated_password)

        new_user = User(
            email_address=data.email_address,
            password=hashed_password,
            role="employer"
        )
        db.add(new_user)
        db.flush()

        new_employer = Employer(
            user_id=new_user.user_id,
            company_name=data.company_name,
            email=data.email_address,
            eligibility='internship',
            internship_validity=data.internship_end,
            moa_file=data.moa_file,
            status="pending"
        )
        db.add(new_employer)
        db.commit()
        db.refresh(new_employer)

        # Send email with credentials
        email_subject = "Your Employer Internship Access - ILEAP"
        email_body = f"""
        <h2>Employer Internship Access Created</h2>
        <p>Your employer account for <strong>{data.company_name}</strong> has been created with internship access.</p>
        <ul>
            <li><strong>Email:</strong> {data.email_address}</li>
            <li><strong>Password:</strong> {generated_password}</li>
            <li><strong>Validity:</strong> {data.internship_start} to {data.internship_end}</li>
        </ul>
        <p>Please change your password after first login.</p>
        """
        send_email(data.email_address, email_subject, email_body)

        return {"message": "Internship employer created successfully.", "employer_id": new_employer.employer_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating internship employer: {str(e)}"
        )


def register_employer_simple(data: EmployerSimpleCreate, db: Session, moa_file_path: Optional[str] = None):
    """Register a minimal employer with industry and validity.
    Generates a password and emails credentials.
    """
    try:
        # Check if login email already exists
        existing_user = db.query(User).filter(User.email_address == data.email_address).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email address already registered")

        # Validate industry
        industry = db.query(Industry).filter(Industry.industry_id == data.industry_id).first()
        if not industry:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Industry not found")

        # Generate password
        generated_password = generate_password()
        hashed_password = hash_password(generated_password)

        # Create user
        new_user = User(email_address=data.email_address, password=hashed_password, role="employer")
        db.add(new_user)
        db.flush()

        # Create employer
        new_employer = Employer(
            user_id=new_user.user_id,
            company_name=data.company_name,
            representative_name=data.representative_name,
            phone_number=data.phone_number,
            industry_id=data.industry_id,
            email=data.email_address,
            eligibility='internship',
            internship_validity=data.validity_end,
            moa_file=moa_file_path,
            status="pending",
        )
        db.add(new_employer)
        db.commit()
        db.refresh(new_employer)

        # Email credentials
        email_subject = "Your Employer Account - ILEAP"
        email_body = f"""
        <h2>Employer Account Created</h2>
        <p>Company: <strong>{data.company_name}</strong></p>
        <ul>
            <li><strong>Login Email:</strong> {data.email_address}</li>
            <li><strong>Password:</strong> {generated_password}</li>
            <li><strong>Validity:</strong> {data.validity_start} to {data.validity_end}</li>
        </ul>
        <p>Please change your password after first login.</p>
        """
        send_email(data.email_address, email_subject, email_body)

        return {"message": "Employer created successfully.", "employer_id": new_employer.employer_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating employer: {str(e)}")


def update_employer(employer_id: int, employer_data: EmployerUpdate, db: Session):
    """Update employer details"""
    
    # Get employer
    employer = db.query(Employer).filter(Employer.employer_id == employer_id).first()
    if not employer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer not found"
        )
    
    # Get user
    user = db.query(User).filter(User.user_id == employer.user_id).first()
    
    # Check if email is being changed and if it's already in use
    if employer_data.email_address and employer_data.email_address != user.email_address:
        existing_user = db.query(User).filter(
            User.email_address == employer_data.email_address,
            User.user_id != user.user_id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already in use"
            )
    
    # Check if company email is being changed and if it's already in use
    if employer_data.email and employer_data.email != employer.email:
        existing_employer = db.query(Employer).filter(
            Employer.email == employer_data.email,
            Employer.employer_id != employer_id
        ).first()
        if existing_employer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company email already in use"
            )
    
    # Check if industry exists
    if employer_data.industry_id:
        industry = db.query(Industry).filter(Industry.industry_id == employer_data.industry_id).first()
        if not industry:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Industry not found"
            )
    
    try:
        # Update user email if provided
        if employer_data.email_address:
            user.email_address = employer_data.email_address
        
        # Update employer fields
        update_data = employer_data.dict(exclude_unset=True, exclude={'email_address'})
        for field, value in update_data.items():
            setattr(employer, field, value)
        
        employer.updated_at = datetime.now()
        
        db.commit()
        db.refresh(employer)
        
        return {"message": "Employer updated successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating employer: {str(e)}"
        )


def get_employer_by_id(employer_id: int, db: Session):
    """Get employer by ID"""
    
    result = db.query(
        Employer.employer_id,
        Employer.user_id,
        Employer.company_name,
        Employer.company_overview,
        Employer.representative_name,
        Employer.company_size,
        Employer.industry_id,
        Industry.industry_name,
        Employer.email,
        Employer.phone_number,
        Employer.address,
        Employer.website,
        Employer.facebook,
        Employer.linkedin,
        Employer.internship_validity,
        Employer.job_placement_validity,
        Employer.moa_file,
        Employer.twitter,
        Employer.logo,
        Employer.eligibility,
        Employer.status,
        Employer.created_at,
        Employer.updated_at,
        User.email_address
    ).join(User, User.user_id == Employer.user_id)\
     .join(Industry, Industry.industry_id == Employer.industry_id)\
     .filter(Employer.employer_id == employer_id).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer not found"
        )
    
    return {
        "employer_id": result.employer_id,
        "user_id": result.user_id,
        "email_address": result.email_address,
        "company_name": result.company_name,
        "company_overview": result.company_overview,
        "representative_name": result.representative_name,
        "company_size": result.company_size,
        "industry_id": result.industry_id,
        "industry_name": result.industry_name,
        "email": result.email,
        "phone_number": result.phone_number,
        "address": result.address,
        "internship_validity": result.internship_validity,
        "job_placement_validity": result.job_placement_validity,
        "moa_file": result.moa_file,
        "website": result.website,
        "facebook": result.facebook,
        "linkedin": result.linkedin,
        "twitter": result.twitter,
        "logo": result.logo,
        "eligibility": result.eligibility,
        "status": result.status,
        "created_at": result.created_at,
        "updated_at": result.updated_at
    }



# ...existing code...

def get_companies(db: Session):
    """Return all companies (employer_id and company_name)"""
    companies = db.query(Employer.employer_id, Employer.company_name).all()
    return [
        {"employer_id": c.employer_id, "company_name": c.company_name}
        for c in companies
    ]
