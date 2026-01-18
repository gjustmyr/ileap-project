from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import User
import bcrypt
import jwt
from datetime import datetime, timedelta
import os
import secrets
from models_token_blacklist import token_blacklist
from utils.encryption import decrypt_password

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 3


def login_user_by_role(credentials, db: Session, expected_role: str):
    """
    Authenticate user with role validation and encrypted password
    Dedicated endpoint for each portal
    """
    email = credentials.email_address
    encrypted_password = credentials.password

    print(f"🔍 Login attempt - Email: {email}, Portal: {expected_role}")

    if not email or not encrypted_password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Decrypt password from frontend
    try:
        password = decrypt_password(encrypted_password)
        print(f"✅ Password decrypted successfully")
    except Exception as e:
        print(f"❌ Decryption failed: {e}")
        raise HTTPException(status_code=400, detail="Invalid password format")

    # Find user by email
    user = db.query(User).filter(User.email_address == email).first()

    if not user:
        print(f"❌ User not found: {email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"✅ User found: {email}, Role: {user.role}")

    # Validate role BEFORE password check (security: don't reveal if user exists with wrong role)
    if user.role != expected_role:
        print(f"❌ Role mismatch - Expected: {expected_role}, Got: {user.role}")
        raise HTTPException(
            status_code=403, 
            detail=f"Access denied. You do not have permission to access this portal."
        )

    # Verify password with bcrypt
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        print(f"❌ Password verification failed for: {email}")
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    print(f"✅ Password verified for: {email}")

    # Create JWT token
    payload = {
        "user_id": user.user_id,
        "email": user.email_address,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "token": token,
            "user": {
                "user_id": user.user_id,
                "email": user.email_address,
                "role": user.role
            },
            "force_password_change": user.force_password_change
        }
    }



def login_user(credentials, db: Session):
    """
    Authenticate user and return JWT token
    """
    email = credentials.email_address
    password = credentials.password

    print(f"🔍 Login attempt - Email: {email}")  # Debug log

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Find user by email
    user = db.query(User).filter(User.email_address == email).first()

    if not user:
        print(f"❌ User not found: {email}")  # Debug log
        raise HTTPException(status_code=401, detail="Invalid email or password")

    print(f"✅ User found: {email}, Role: {user.role}")  # Debug log

    # Validate role if expected_role is provided
    if credentials.expected_role and user.role != credentials.expected_role:
        print(f"❌ Role mismatch - Expected: {credentials.expected_role}, Got: {user.role}")
        raise HTTPException(
            status_code=403, 
            detail=f"Access denied. This portal is for {credentials.expected_role} users only."
        )

    # Verify password
    if not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        print(f"❌ Password verification failed for: {email}")  # Debug log
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    print(f"✅ Password verified for: {email}")  # Debug log

    # Create JWT token
    payload = {
        "user_id": user.user_id,
        "email": user.email_address,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "token": token,
            "user": {
                "user_id": user.user_id,
                "email": user.email_address,
                "role": user.role
            }
        }
    }


def create_superadmin(credentials, db: Session):
    """
    Create a superadmin user
    """
    email = credentials.email_address
    password = credentials.password

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    # Check if user already exists
    existing_user = db.query(User).filter(User.email_address == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Hash password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create new user
    new_user = User(
        email_address=email,
        password=hashed_password,
        role="superadmin"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Superadmin created successfully",
        "user": {
            "user_id": new_user.user_id,
            "email": new_user.email_address,
            "role": new_user.role
        }
    }


def logout_user(authorization: str):
    """
    Logout user by blacklisting the token
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        
        # Add token to blacklist for immediate invalidation
        token_blacklist.add_token(token)
        
        print(f"✅ User logged out - Token invalidated")
        
        return {
            "status": "success",
            "message": "Logged out successfully. Token has been invalidated."
        }
    except Exception as e:
        print(f"❌ Logout error: {str(e)}")
        raise HTTPException(status_code=500, detail="Logout failed")


def forgot_password(email: str, db: Session):
    """
    Generate password reset token and send email
    """
    user = db.query(User).filter(User.email_address == email).first()
    
    if not user:
        # Don't reveal if email exists or not
        return {
            "status": "success",
            "message": "If the email exists, a password reset link has been sent."
        }
    
    # Generate secure reset token
    reset_token = secrets.token_urlsafe(32)
    reset_token_expiry = datetime.utcnow() + timedelta(hours=1)  # 1 hour expiry
    
    user.reset_token = reset_token
    user.reset_token_expiry = reset_token_expiry
    db.commit()
    
    # TODO: Send email with reset link
    # For now, just log the token (in production, send via email)
    print(f"🔑 Password reset token for {email}: {reset_token}")
    print(f"Reset link: http://localhost:4200/reset-password?token={reset_token}")
    
    return {
        "status": "success",
        "message": "If the email exists, a password reset link has been sent.",
        "reset_token": reset_token  # Remove this in production
    }


def reset_password(token: str, new_password: str, db: Session):
    """
    Reset password using valid token
    """
    user = db.query(User).filter(User.reset_token == token).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    if not user.reset_token_expiry or datetime.utcnow() > user.reset_token_expiry:
        raise HTTPException(status_code=400, detail="Reset token has expired")
    
    # Hash new password
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Update password and clear reset token
    user.password = hashed_password
    user.reset_token = None
    user.reset_token_expiry = None
    user.force_password_change = False  # Clear force change flag
    db.commit()
    
    return {
        "status": "success",
        "message": "Password has been reset successfully"
    }


def change_password(user_id: int, current_password: str, new_password: str, db: Session):
    """
    Change password for authenticated user
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not bcrypt.checkpw(current_password.encode('utf-8'), user.password.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    # Hash new password
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Update password and clear force change flag
    user.password = hashed_password
    user.force_password_change = False
    db.commit()
    
    return {
        "status": "success",
        "message": "Password changed successfully"
    }
