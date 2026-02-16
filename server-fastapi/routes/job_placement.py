from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from middleware.auth import verify_token
from models import User, Campus
from sqlalchemy import or_
import bcrypt
import secrets
import string
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from utils.datetime_helper import utcnow

router = APIRouter(prefix="/api/jp-officers", tags=["Job Placement Officers"])


def verify_superadmin(token_data: dict = Depends(verify_token)):
    """Verify that the user is a superadmin"""
    if token_data.get("role") != "superadmin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only superadmin can access this resource"
        )
    return token_data


@router.get("")
async def get_all_jp_officers(
    pageNo: int = 1,
    pageSize: int = 10,
    keyword: str = "",
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get all job placement officers"""
    try:
        # Query users with role 'job_placement_officer'
        query = db.query(User).filter(User.role == "job_placement_officer")
        
        # Apply search filter
        if keyword:
            search_filter = or_(
                User.first_name.ilike(f"%{keyword}%"),
                User.last_name.ilike(f"%{keyword}%"),
                User.email_address.ilike(f"%{keyword}%")
            )
            query = query.filter(search_filter)
        
        # Get total count
        total_records = query.count()
        
        # Apply pagination
        offset = (pageNo - 1) * pageSize
        jpo_users = query.offset(offset).limit(pageSize).all()
        
        # Transform to response format
        jpo_list = []
        for user in jpo_users:
            # Get campus name if campus_id exists
            campus_name = None
            if hasattr(user, 'campus_id') and user.campus_id:
                campus = db.query(Campus).filter(Campus.campus_id == user.campus_id).first()
                if campus:
                    campus_name = campus.campus_name
            
            jpo_list.append({
                "user_id": user.user_id,
                "email_address": user.email_address,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "contact_number": user.contact_number,
                "position_title": user.position_title,
                "campus_id": user.campus_id if hasattr(user, 'campus_id') else None,
                "campus_name": campus_name,
                "status": user.status,
                "created_at": user.created_at.isoformat() if user.created_at else None
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


@router.get("/{user_id}")
async def get_jp_officer_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Get a specific job placement officer by user_id"""
    try:
        user = db.query(User).filter(
            User.user_id == user_id,
            User.role == "job_placement_officer"
        ).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Job placement officer not found")
        
        # Get campus name if campus_id exists
        campus_name = None
        if hasattr(user, 'campus_id') and user.campus_id:
            campus = db.query(Campus).filter(Campus.campus_id == user.campus_id).first()
            if campus:
                campus_name = campus.campus_name
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": user.user_id,
                "email_address": user.email_address,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "contact_number": user.contact_number,
                "position_title": user.position_title,
                "campus_id": user.campus_id if hasattr(user, 'campus_id') else None,
                "campus_name": campus_name,
                "status": user.status
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch job placement officer: {str(e)}"
        )


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_jp_officer(
    jpo_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Register a new job placement officer with auto-generated password"""
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
            role="job_placement_officer",
            first_name=jpo_data['first_name'],
            last_name=jpo_data['last_name'],
            contact_number=jpo_data.get('contact_number'),
            position_title=jpo_data.get('position_title'),
            campus_id=jpo_data.get('campus_id'),
            status=jpo_data.get('status', 'active'),
            created_at=utcnow(),
            updated_at=utcnow()
        )
        
        db.add(new_user)
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


@router.patch("/{user_id}")
async def update_jp_officer(
    user_id: int,
    jpo_data: dict,
    db: Session = Depends(get_db),
    token_data: dict = Depends(verify_superadmin)
):
    """Update a job placement officer"""
    try:
        user = db.query(User).filter(
            User.user_id == user_id,
            User.role == "job_placement_officer"
        ).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="Job placement officer not found")
        
        # Update fields
        if 'first_name' in jpo_data:
            user.first_name = jpo_data['first_name']
        if 'last_name' in jpo_data:
            user.last_name = jpo_data['last_name']
        if 'email_address' in jpo_data:
            # Check if new email already exists
            existing = db.query(User).filter(
                User.email_address == jpo_data['email_address'],
                User.user_id != user_id
            ).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already exists")
            user.email_address = jpo_data['email_address']
        if 'contact_number' in jpo_data:
            user.contact_number = jpo_data['contact_number']
        if 'position_title' in jpo_data:
            user.position_title = jpo_data['position_title']
        if 'campus_id' in jpo_data:
            user.campus_id = jpo_data['campus_id']
        if 'status' in jpo_data:
            user.status = jpo_data['status']
        
        user.updated_at = utcnow()
        
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
