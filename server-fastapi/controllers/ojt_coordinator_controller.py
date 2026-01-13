from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status
from models import User, OJTCoordinator, Campus, Department, OJTHead
from schemas.ojt_coordinator import OJTCoordinatorCreate, OJTCoordinatorUpdate
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


def get_ojt_head_campuses(db: Session, user_id: int):
    """Get all campuses assigned to an OJT Head"""
    ojt_head_records = db.query(OJTHead).filter(OJTHead.user_id == user_id).all()
    return [record.campus_id for record in ojt_head_records]


def get_all_ojt_coordinators(db: Session, user_id: int, page_no: int = 1, page_size: int = 10, keyword: str = "", campus_id: int = None, department_id: int = None):
    """Get all OJT Coordinators for the logged-in OJT Head"""
    offset = (page_no - 1) * page_size
    
    # Get campuses assigned to this OJT Head
    ojt_head_campuses = get_ojt_head_campuses(db, user_id)
    
    query = db.query(
        User.user_id,
        User.email_address,
        OJTCoordinator.first_name,
        OJTCoordinator.last_name,
        OJTCoordinator.contact_number,
        OJTCoordinator.position_title,
        OJTCoordinator.status,
        Campus.campus_id,
        Campus.campus_name,
        Department.department_id,
        Department.department_name,
        OJTCoordinator.created_at
    ).join(
        OJTCoordinator, User.user_id == OJTCoordinator.user_id
    ).join(
        Campus, OJTCoordinator.campus_id == Campus.campus_id
    ).join(
        Department, OJTCoordinator.department_id == Department.department_id
    ).filter(
        User.role == "ojt_coordinator",
        Campus.campus_id.in_(ojt_head_campuses)  # Only show coordinators in OJT Head's campuses
    )
    
    if campus_id:
        query = query.filter(Campus.campus_id == campus_id)
    
    if department_id:
        query = query.filter(Department.department_id == department_id)
    
    if keyword:
        search_filter = or_(
            OJTCoordinator.first_name.ilike(f"%{keyword}%"),
            OJTCoordinator.last_name.ilike(f"%{keyword}%"),
            User.email_address.ilike(f"%{keyword}%"),
            Campus.campus_name.ilike(f"%{keyword}%"),
            Department.department_name.ilike(f"%{keyword}%")
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
            "department_id": r.department_id,
            "department_name": r.department_name,
            "created_at": r.created_at
        }
        for r in results
    ]
    
    return {
        "status": "SUCCESS",
        "data": data,
        "message": "OJT Coordinators fetched successfully.",
        "pagination": {
            "currentPage": page_no,
            "pageSize": page_size,
            "totalRecords": total,
            "totalPages": (total + page_size - 1) // page_size
        }
    }


def get_ojt_coordinator_by_id(user_id: int, db: Session):
    """Get OJT Coordinator by user ID"""
    result = db.query(
        User.user_id,
        User.email_address,
        OJTCoordinator.first_name,
        OJTCoordinator.last_name,
        OJTCoordinator.contact_number,
        OJTCoordinator.position_title,
        OJTCoordinator.status,
        Campus.campus_id,
        Campus.campus_name,
        Department.department_id,
        Department.department_name
    ).join(
        OJTCoordinator, User.user_id == OJTCoordinator.user_id
    ).join(
        Campus, OJTCoordinator.campus_id == Campus.campus_id
    ).join(
        Department, OJTCoordinator.department_id == Department.department_id
    ).filter(
        User.user_id == user_id,
        User.role == "ojt_coordinator"
    ).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OJT Coordinator not found."
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
            "campus_name": result.campus_name,
            "department_id": result.department_id,
            "department_name": result.department_name
        },
        "message": "OJT Coordinator fetched successfully."
    }


def register_ojt_coordinator(ojt_coordinator: OJTCoordinatorCreate, ojt_head_user_id: int, db: Session):
    """Register new OJT Coordinator"""
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email_address == ojt_coordinator.email_address).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use."
            )
        
        # Check if campus exists and belongs to this OJT Head
        ojt_head_campuses = get_ojt_head_campuses(db, ojt_head_user_id)
        if ojt_coordinator.campus_id not in ojt_head_campuses:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only create coordinators for campuses assigned to you."
            )
        
        campus = db.query(Campus).filter(Campus.campus_id == ojt_coordinator.campus_id).first()
        if not campus:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Campus not found."
            )
        
        # Check if department exists
        department = db.query(Department).filter(Department.department_id == ojt_coordinator.department_id).first()
        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Department not found."
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
                email_address=ojt_coordinator.email_address,
                password=hashed_password,
                role="ojt_coordinator"
            )
            db.add(new_user)
            db.flush()
            
            # Create OJT Coordinator profile
            new_coordinator = OJTCoordinator(
                user_id=new_user.user_id,
                first_name=ojt_coordinator.first_name,
                last_name=ojt_coordinator.last_name,
                contact_number=ojt_coordinator.contact_number,
                position_title=ojt_coordinator.position_title,
                campus_id=ojt_coordinator.campus_id,
                department_id=ojt_coordinator.department_id,
                status="active"
            )
            db.add(new_coordinator)
            
            db.commit()
            db.refresh(new_user)
            
            # Send email with credentials (after commit)
            email_body = f"""Hello {ojt_coordinator.first_name} {ojt_coordinator.last_name},

Your OJT Coordinator account has been created successfully.

Email: {ojt_coordinator.email_address}
Temporary Password: {generated_password}

Please login and change your password immediately.

Best regards,
ILEAP System"""
            
            try:
                send_email(
                    ojt_coordinator.email_address,
                    "OJT Coordinator Account Created - ILEAP System",
                    email_body
                )
            except Exception as email_error:
                print(f"Failed to send email: {email_error}")
                # Account is still created even if email fails
            
            return {
                "status": "SUCCESS",
                "data": [],
                "message": "OJT Coordinator registered successfully. Password sent to email."
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


def update_ojt_coordinator(user_id: int, coordinator_update: OJTCoordinatorUpdate, ojt_head_user_id: int, db: Session):
    """Update OJT Coordinator"""
    try:
        user = db.query(User).filter(User.user_id == user_id, User.role == "ojt_coordinator").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator not found."
            )
        
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if not coordinator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator profile not found."
            )
        
        # Check if coordinator belongs to OJT Head's campuses
        ojt_head_campuses = get_ojt_head_campuses(db, ojt_head_user_id)
        if coordinator.campus_id not in ojt_head_campuses:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update coordinators in your assigned campuses."
            )
        
        try:
            # Update user email if provided
            if coordinator_update.email_address:
                user.email_address = coordinator_update.email_address
            
            # Update OJT Coordinator profile
            if coordinator_update.first_name:
                coordinator.first_name = coordinator_update.first_name
            if coordinator_update.last_name:
                coordinator.last_name = coordinator_update.last_name
            if coordinator_update.contact_number:
                coordinator.contact_number = coordinator_update.contact_number
            if coordinator_update.position_title:
                coordinator.position_title = coordinator_update.position_title
            if coordinator_update.campus_id:
                # Check if new campus belongs to OJT Head
                if coordinator_update.campus_id not in ojt_head_campuses:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You can only assign coordinators to your campuses."
                    )
                coordinator.campus_id = coordinator_update.campus_id
            if coordinator_update.department_id:
                coordinator.department_id = coordinator_update.department_id
            if coordinator_update.status:
                coordinator.status = coordinator_update.status
            
            db.commit()
            
            return {
                "status": "SUCCESS",
                "data": [],
                "message": "OJT Coordinator updated successfully."
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


def send_new_password(user_id: int, ojt_head_user_id: int, db: Session):
    """Generate and send new password to OJT Coordinator"""
    try:
        user = db.query(User).filter(User.user_id == user_id, User.role == "ojt_coordinator").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator not found."
            )
        
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if not coordinator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator profile not found."
            )
        
        # Check if coordinator belongs to OJT Head's campuses
        ojt_head_campuses = get_ojt_head_campuses(db, ojt_head_user_id)
        if coordinator.campus_id not in ojt_head_campuses:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only manage coordinators in your assigned campuses."
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
            email_body = f"""Hello {coordinator.first_name} {coordinator.last_name},

Your password has been reset by the OJT Head.

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


def send_new_password_superadmin(user_id: int, db: Session):
    """Generate and send new password to OJT Coordinator (Superadmin version - no campus validation)"""
    try:
        user = db.query(User).filter(User.user_id == user_id, User.role == "ojt_coordinator").first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator not found."
            )
        
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if not coordinator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator profile not found."
            )
        
        # Superadmin can reset any coordinator's password without campus validation
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
            email_body = f"""Hello {coordinator.first_name} {coordinator.last_name},

Your password has been reset by the System Administrator.

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


def get_all_ojt_coordinators_for_superadmin(db: Session, page_no: int = 1, page_size: int = 10, keyword: str = "", campus_id: int = None, department_id: int = None):
    """Get all OJT Coordinators for superadmin (no filtering by campus)"""
    print(f"[DEBUG] get_all_ojt_coordinators_for_superadmin called with: page_no={page_no}, page_size={page_size}, keyword={keyword}, campus_id={campus_id}")
    offset = (page_no - 1) * page_size
    
    query = db.query(
        User.user_id,
        User.email_address,
        OJTCoordinator.first_name,
        OJTCoordinator.last_name,
        OJTCoordinator.contact_number,
        OJTCoordinator.status,
        Campus.campus_id,
        Campus.campus_name,
        OJTCoordinator.created_at
    ).join(
        OJTCoordinator, User.user_id == OJTCoordinator.user_id
    ).outerjoin(
        Campus, OJTCoordinator.campus_id == Campus.campus_id
    ).filter(
        User.role == "ojt_coordinator"
    )
    print(f"[DEBUG] Query built, about to execute...")
    
    if campus_id:
        query = query.filter(Campus.campus_id == campus_id)
    
    if keyword:
        search_filter = or_(
            OJTCoordinator.first_name.ilike(f"%{keyword}%"),
            OJTCoordinator.last_name.ilike(f"%{keyword}%"),
            User.email_address.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
    
    total = query.count()
    print(f"[DEBUG] Total count: {total}")
    results = query.offset(offset).limit(page_size).all()
    print(f"[DEBUG] Query returned {len(results)} results")
    
    data = [
        {
            "user_id": r.user_id,
            "email_address": r.email_address,
            "first_name": r.first_name,
            "last_name": r.last_name,
            "contact_number": r.contact_number,
            "status": r.status,
            "campus_id": r.campus_id,
            "campus_name": r.campus_name,
            "created_at": r.created_at.isoformat() if r.created_at else None
        }
        for r in results
    ]
    
    print(f"[DEBUG] Returning response with {len(data)} items in data array")
    return {
        "status": "SUCCESS",
        "data": data,
        "message": "OJT Coordinators retrieved successfully.",
        "totalCount": total,
        "pageNo": page_no,
        "pageSize": page_size
    }


def send_account_to_coordinator(coordinator: OJTCoordinatorCreate, db: Session):
    """Send new account to OJT Coordinator (for superadmin)"""
    try:
        # Check if email already exists
        existing_user = db.query(User).filter(User.email_address == coordinator.email_address).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address already exists"
            )
        
        # Generate temporary password
        temp_password = generate_password()
        hashed_password = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create user account
        new_user = User(
            email_address=coordinator.email_address,
            password=hashed_password,
            role="ojt_coordinator"
        )
        db.add(new_user)
        db.flush()
        
        # Create OJT Coordinator record
        new_coordinator = OJTCoordinator(
            user_id=new_user.user_id,
            first_name=coordinator.first_name,
            last_name=coordinator.last_name,
            contact_number=coordinator.contact_number,
            campus_id=coordinator.campus_id,
            status="active"
        )
        db.add(new_coordinator)
        db.commit()
        
        # Send email with credentials
        email_body = f"""Hello {coordinator.first_name} {coordinator.last_name},

Your OJT Coordinator account has been created by the system administrator.

Email: {coordinator.email_address}
Temporary Password: {temp_password}

Please login and change your password immediately for security.

Best regards,
ILEAP System"""
        
        try:
            send_email(
                coordinator.email_address,
                "New Account - ILEAP System",
                email_body
            )
        except Exception as email_error:
            print(f"Failed to send email: {email_error}")
        
        return {
            "status": "SUCCESS",
            "data": {
                "user_id": new_user.user_id,
                "email_address": new_user.email_address
            },
            "message": "Account created and credentials sent successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


def update_ojt_coordinator_superadmin(user_id: int, coordinator_update: OJTCoordinatorUpdate, db: Session):
    """Update OJT Coordinator (for superadmin)"""
    try:
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if not coordinator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator not found"
            )
        
        user = db.query(User).filter(User.user_id == user_id).first()
        
        # Update user email if provided
        if coordinator_update.email_address:
            user.email_address = coordinator_update.email_address
        
        # Update coordinator fields
        if coordinator_update.first_name:
            coordinator.first_name = coordinator_update.first_name
        if coordinator_update.last_name:
            coordinator.last_name = coordinator_update.last_name
        if coordinator_update.contact_number is not None:
            coordinator.contact_number = coordinator_update.contact_number
        if coordinator_update.campus_id is not None:
            coordinator.campus_id = coordinator_update.campus_id
        if coordinator_update.status:
            coordinator.status = coordinator_update.status
        
        db.commit()
        
        return {
            "status": "SUCCESS",
            "data": [],
            "message": "OJT Coordinator updated successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


def update_coordinator_status(user_id: int, new_status: str, db: Session):
    """Update OJT Coordinator status"""
    try:
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if not coordinator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="OJT Coordinator not found"
            )
        
        coordinator.status = new_status
        db.commit()
        
        return {
            "status": "SUCCESS",
            "data": [],
            "message": f"Coordinator status updated to {new_status}."
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

