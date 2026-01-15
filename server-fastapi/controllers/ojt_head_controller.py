from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException, status
from models import User, OJTHead, Campus
from schemas.ojt_head import OJTHeadCreate, OJTHeadUpdate
import bcrypt
import secrets
import string
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def generate_password(length: int = 12) -> str:
    """Generate random password"""
    characters = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(characters) for _ in range(length))
    return password[:72]  # BCrypt has a 72 byte limit


def send_email(to: str, subject: str, body: str):
    """Send email"""
    try:
        msg = MIMEMultipart()
        msg['From'] = os.getenv("EMAIL_USER")
        msg['To'] = to
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(os.getenv("EMAIL_USER"), os.getenv("EMAIL_PASSWORD"))
        
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False


def get_all_ojt_heads(db: Session, page_no: int = 1, page_size: int = 10, keyword: str = "", campus_id: int = None):
    """Get all OJT Heads with pagination and search"""
    offset = (page_no - 1) * page_size
    
    query = db.query(
        User.user_id,
        User.email_address,
        OJTHead.first_name,
        OJTHead.last_name,
        OJTHead.contact_number,
        OJTHead.position_title,
        OJTHead.status,
        Campus.campus_id,
        Campus.campus_name,
        OJTHead.created_at
    ).join(
        OJTHead, User.user_id == OJTHead.user_id
    ).join(
        Campus, OJTHead.campus_id == Campus.campus_id
    ).filter(
        User.role == "ojt_head"
    )
    
    if campus_id:
        query = query.filter(Campus.campus_id == campus_id)
    
    if keyword:
        search_filter = or_(
            OJTHead.first_name.ilike(f"%{keyword}%"),
            OJTHead.last_name.ilike(f"%{keyword}%"),
            User.email_address.ilike(f"%{keyword}%"),
            Campus.campus_name.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
    
    total = query.count()
    results = query.offset(offset).limit(page_size).all()
    
    data = [
        {
            "user_id": r.user_id,
            "email_address": r.email_address,
            "first_name": r.first_name,
            "last_name": r.last_name,
            "contact_number": r.contact_number,
            "position_title": r.position_title,
            "status": r.status,
            "campus_id": r.campus_id,
            "campus_name": r.campus_name,
            "created_at": r.created_at
        }
        for r in results
    ]
    
    return {
        "status": "SUCCESS",
        "data": data,
        "message": "OJT Heads fetched successfully.",
        "pagination": {
            "currentPage": page_no,
            "pageSize": page_size,
            "totalRecords": total,
            "hasMore": len(data) == page_size
        }
    }


def register_ojt_head(ojt_head: OJTHeadCreate, db: Session):
    """Register new OJT Head"""
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email_address == ojt_head.email_address).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use."
            )
        
        # Check if campus exists
        campus = db.query(Campus).filter(Campus.campus_id == ojt_head.campus_id).first()
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        # Generate password
        generated_password = generate_password()
        hashed_password = bcrypt.hashpw(
            generated_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
        
        try:
            # Create user
            new_user = User(
                email_address=ojt_head.email_address,
                password=hashed_password,
                role="ojt_head"
            )
            db.add(new_user)
            db.flush()
            
            # Create OJT Head profile
            new_ojt_head = OJTHead(
                user_id=new_user.user_id,
                first_name=ojt_head.first_name,
                last_name=ojt_head.last_name,
                contact_number=ojt_head.contact_number,
                position_title=ojt_head.position_title,
                campus_id=ojt_head.campus_id,
                status="active"
            )
            db.add(new_ojt_head)
            
            # If assigned to main campus, also assign to its extension campuses
            if not campus.is_extension:
                extension_campuses = db.query(Campus).filter(
                    Campus.is_extension == True,
                    Campus.parent_campus_id == ojt_head.campus_id,
                    Campus.status == "active"
                ).all()
                
                for ext_campus in extension_campuses:
                    ext_ojt_head = OJTHead(
                        user_id=new_user.user_id,
                        first_name=ojt_head.first_name,
                        last_name=ojt_head.last_name,
                        contact_number=ojt_head.contact_number,
                        position_title=ojt_head.position_title,
                        campus_id=ext_campus.campus_id,
                        status="active"
                    )
                    db.add(ext_ojt_head)
            
            db.commit()
            db.refresh(new_user)
            
            # Send email with credentials (after commit)
            email_body = f"""Hello {ojt_head.first_name} {ojt_head.last_name},

Your OJT Head account has been created successfully.

Email: {ojt_head.email_address}
Temporary Password: {generated_password}

Please login and change your password immediately.

Best regards,
ILEAP System"""
            
            try:
                send_email(
                    ojt_head.email_address,
                    "OJT Head Account Created - ILEAP System",
                    email_body
                )
            except Exception as email_error:
                print(f"Failed to send email: {email_error}")
                # Account is still created even if email fails
            
            return {
                "status": "SUCCESS",
                "data": [],
                "message": "OJT Head registered successfully. Password sent to email."
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


def get_ojt_head_by_id(user_id: int, db: Session):
    """Get OJT Head by user ID"""
    result = db.query(
        User.user_id,
        User.email_address,
        OJTHead.first_name,
        OJTHead.last_name,
        OJTHead.contact_number,
        OJTHead.position_title,
        OJTHead.status,
        OJTHead.campus_id,
        Campus.campus_name
    ).join(
        OJTHead, User.user_id == OJTHead.user_id
    ).join(
        Campus, OJTHead.campus_id == Campus.campus_id
    ).filter(
        User.user_id == user_id,
        User.role == "ojt_head"
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OJT Head not found."
        )
    
    return {
        "status": "SUCCESS",
        "data": {
            "user_id": result.user_id,
            "email_address": result.email_address,
            "first_name": result.first_name,
            "last_name": result.last_name,
            "contact_number": result.contact_number,
            "position_title": result.position_title,
            "status": result.status,
            "campus_id": result.campus_id,
            "campus_name": result.campus_name
        },
        "message": "OJT Head profile fetched successfully."
    }


def update_ojt_head(user_id: int, ojt_head_update: OJTHeadUpdate, db: Session):
    """Update OJT Head"""
    try:
        user = db.query(User).filter(User.user_id == user_id, User.role == "ojt_head").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Head not found."
            )
        
        # Get all OJT Head records for this user (main + extensions)
        ojt_head_records = db.query(OJTHead).filter(OJTHead.user_id == user_id).all()
        if not ojt_head_records:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Head profile not found."
            )
        
        try:
            # Update user email if provided
            if ojt_head_update.email_address:
                user.email_address = ojt_head_update.email_address
            
            # Update basic info for all OJT Head records
            for ojt_head in ojt_head_records:
                if ojt_head_update.first_name:
                    ojt_head.first_name = ojt_head_update.first_name
                if ojt_head_update.last_name:
                    ojt_head.last_name = ojt_head_update.last_name
                if ojt_head_update.contact_number:
                    ojt_head.contact_number = ojt_head_update.contact_number
                if ojt_head_update.position_title:
                    ojt_head.position_title = ojt_head_update.position_title
                if ojt_head_update.status:
                    ojt_head.status = ojt_head_update.status
            
            # Handle campus reassignment if campus_id is provided
            if ojt_head_update.campus_id:
                # Get the new campus
                new_campus = db.query(Campus).filter(Campus.campus_id == ojt_head_update.campus_id).first()
                if not new_campus:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Campus not found."
                    )
                
                # Delete all existing campus assignments
                for record in ojt_head_records:
                    db.delete(record)
                db.flush()
                
                # Create new main campus assignment
                new_ojt_head = OJTHead(
                    user_id=user_id,
                    first_name=ojt_head_update.first_name or ojt_head_records[0].first_name,
                    last_name=ojt_head_update.last_name or ojt_head_records[0].last_name,
                    contact_number=ojt_head_update.contact_number or ojt_head_records[0].contact_number,
                    position_title=ojt_head_update.position_title or ojt_head_records[0].position_title,
                    campus_id=ojt_head_update.campus_id,
                    status=ojt_head_update.status or ojt_head_records[0].status
                )
                db.add(new_ojt_head)
                
                # If assigned to main campus, also assign to its extension campuses
                if not new_campus.is_extension:
                    extension_campuses = db.query(Campus).filter(
                        Campus.is_extension == True,
                        Campus.parent_campus_id == ojt_head_update.campus_id,
                        Campus.status == "active"
                    ).all()
                    
                    for ext_campus in extension_campuses:
                        ext_ojt_head = OJTHead(
                            user_id=user_id,
                            first_name=ojt_head_update.first_name or ojt_head_records[0].first_name,
                            last_name=ojt_head_update.last_name or ojt_head_records[0].last_name,
                            contact_number=ojt_head_update.contact_number or ojt_head_records[0].contact_number,
                            position_title=ojt_head_update.position_title or ojt_head_records[0].position_title,
                            campus_id=ext_campus.campus_id,
                            status=ojt_head_update.status or ojt_head_records[0].status
                        )
                        db.add(ext_ojt_head)
            
            db.commit()
            
            return {
                "status": "SUCCESS",
                "data": [],
                "message": "OJT Head updated successfully."
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


def send_new_password(user_id: int, db: Session):
    """Generate and send new password to OJT Head"""
    try:
        user = db.query(User).filter(User.user_id == user_id, User.role == "ojt_head").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Head not found."
            )
        
        ojt_head = db.query(OJTHead).filter(OJTHead.user_id == user_id).first()
        if not ojt_head:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Head profile not found."
            )
        
        try:
            # Generate new password
            new_password = generate_password()
            hashed_password = bcrypt.hashpw(
                new_password.encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')
            
            # Update password
            user.password = hashed_password
            db.commit()
            db.refresh(user)
            
            # Send email with new password
            email_body = f"""Hello {ojt_head.first_name} {ojt_head.last_name},

Your password has been reset by the administrator.

Email: {user.email_address}
New Password: {new_password}

Please login and change your password immediately for security.

Best regards,
ILEAP System"""
            
            try:
                send_email(
                    user.email_address,
                    "Password Reset - ILEAP System",
                    email_body
                )
            except Exception as email_error:
                print(f"Failed to send email: {email_error}")
                # Password is still reset even if email fails
            
            return {
                "status": "SUCCESS",
                "data": [],
                "message": "New password generated and sent to email successfully."
            }
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


def get_my_campuses(user_id: int, db: Session):
    """Get all campuses assigned to the logged-in OJT Head"""
    try:
        campuses = db.query(
            Campus.campus_id,
            Campus.campus_name,
            Campus.is_extension
        ).join(
            OJTHead, OJTHead.campus_id == Campus.campus_id
        ).filter(
            OJTHead.user_id == user_id,
            Campus.status == "active"
        ).all()
        
        data = [
            {
                "campus_id": c.campus_id,
                "campus_name": c.campus_name,
                "is_extension": c.is_extension
            }
            for c in campuses
        ]
        
        return {
            "status": "SUCCESS",
            "data": data,
            "message": "Campuses fetched successfully."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )
