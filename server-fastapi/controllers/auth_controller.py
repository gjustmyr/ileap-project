from sqlalchemy.orm import Session
from fastapi import HTTPException
from models import User, SuperAdminProfile
import bcrypt
import jwt
from datetime import datetime, timedelta
from utils.datetime_helper import now as philippine_now, utcnow as philippine_utcnow
import os
import secrets
from models_token_blacklist import token_blacklist
from utils.encryption import decrypt_password
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import base64
from pathlib import Path

SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY or JWT_SECRET environment variable is required")
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
            status_code=401, 
            detail="Invalid email or password"
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
        "exp": philippine_utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    # Build user data response
    user_data = {
        "user_id": user.user_id,
        "email": user.email_address,
        "role": user.role
    }

    # Fetch profile data based on role
    if expected_role == "job_placement_officer":
        from models import JobPlacementOfficer
        profile = db.query(JobPlacementOfficer).filter(
            JobPlacementOfficer.user_id == user.user_id
        ).first()
        if profile:
            user_data["first_name"] = profile.first_name
            user_data["last_name"] = profile.last_name
            user_data["position_title"] = profile.position_title

    return {
        "status": "success",
        "message": "Login successful",
        "data": {
            "token": token,
            "user": user_data,
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
        "exp": philippine_utcnow() + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
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
    Create a superadmin user with profile
    Limited to only ONE superadmin in the system
    """
    # Validate admin key
    if credentials.admin_key != SECRET_KEY:
        raise HTTPException(status_code=403, detail="Invalid admin key")
    
    # Check if a superadmin already exists in the system
    existing_superadmin = db.query(User).filter(User.role == "superadmin").first()
    if existing_superadmin:
        raise HTTPException(
            status_code=400, 
            detail="A superadmin already exists. Only one superadmin is allowed in the system."
        )
    
    email = credentials.email_address

    # Check if user already exists
    existing_user = db.query(User).filter(User.email_address == email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    # Generate a default password (can be changed later)
    default_password = "Admin@2025"  # User should change this on first login
    hashed_password = bcrypt.hashpw(default_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create new user
    new_user = User(
        email_address=email,
        password=hashed_password,
        role="superadmin",
        force_password_change=True  # Force password change on first login
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create superadmin profile
    superadmin_profile = SuperAdminProfile(
        user_id=new_user.user_id,
        first_name=credentials.first_name,
        last_name=credentials.last_name,
        contact_number=credentials.contact_number,
        position_title=credentials.position_title,
        status="active"
    )

    db.add(superadmin_profile)
    db.commit()
    db.refresh(superadmin_profile)

    # Load and encode logo for email embedding
    base_dir = Path(__file__).resolve().parent.parent
    logo_path = base_dir / "static" / "email-assets" / "batstateu-logo.png"
    
    # Encode logo as base64 and prepare HTML
    logo_html = ""
    try:
        if logo_path.exists():
            with open(logo_path, "rb") as f:
                logo_base64 = base64.b64encode(f.read()).decode('utf-8')
                logo_html = f'<img src="data:image/png;base64,{logo_base64}" alt="BatStateU Logo" />'
    except Exception as e:
        print(f"Warning: Could not load email logo: {e}")

    # Send email notification with login credentials
    email_body_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }}
            .email-container {{
                max-width: 600px;
                margin: 20px auto;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}

            .university-logo-section {{
                text-align: center;
                padding: 20px;
                background-color: #fff;
                border-bottom: 3px solid #8B0000;
            }}
            .university-logo-section img {{
                width: 60px;
                height: 60px;
                margin-bottom: 10px;
                display: block;
                margin-left: auto;
                margin-right: auto;
            }}
            .university-logo-section p {{
                margin: 5px 0;
                color: #8B0000;
                font-size: 14px;
                font-weight: 600;
            }}
            .header {{
                background: linear-gradient(135deg, #8B0000 0%, #DC143C 100%);
                color: white;
                padding: 30px 20px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 600;
                letter-spacing: 2px;
            }}
            .header p {{
                margin: 5px 0 0 0;
                font-size: 13px;
                opacity: 0.95;
                font-weight: 400;
            }}
            .header .subtitle {{
                margin-top: 10px;
                font-size: 11px;
                opacity: 0.85;
                font-style: italic;
            }}
            .content {{
                padding: 40px 30px;
            }}
            .greeting {{
                font-size: 18px;
                color: #8B0000;
                margin-bottom: 20px;
                font-weight: 600;
            }}
            .message {{
                margin-bottom: 30px;
                color: #555;
            }}
            .credentials-box {{
                background-color: #f8f9fa;
                border-left: 4px solid #8B0000;
                padding: 20px;
                margin: 25px 0;
                border-radius: 4px;
            }}
            .credentials-box h3 {{
                margin: 0 0 15px 0;
                color: #8B0000;
                font-size: 16px;
            }}
            .credential-item {{
                margin: 10px 0;
                padding: 8px 0;
            }}
            .credential-label {{
                font-weight: 600;
                color: #333;
                display: inline-block;
                width: 150px;
            }}
            .credential-value {{
                color: #555;
                font-family: 'Courier New', monospace;
                background-color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid #ddd;
            }}
            .warning-box {{
                background-color: #fff3cd;
                border-left: 4px solid #ffc107;
                padding: 15px;
                margin: 25px 0;
                border-radius: 4px;
            }}
            .warning-box strong {{
                color: #856404;
            }}
            .button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #8B0000;
                color: white !important;
                text-decoration: none;
                border-radius: 5px;
                margin: 20px 0;
                font-weight: 600;
                text-align: center;
            }}
            .button:hover {{
                background-color: #660000;
            }}
            .footer {{
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #777;
                font-size: 12px;
                border-top: 1px solid #e9ecef;
            }}
            .footer p {{
                margin: 5px 0;
            }}
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="university-logo-section">
                {logo_html}
                <p>BATANGAS STATE UNIVERSITY</p>
                <p style="font-size: 11px; color: #666;">The National Engineering University</p>
            </div>
            
            <div class="header">
                <h1>ILEAP SYSTEM</h1>
                <p>Internship Learning Experience, Alumni, and Placement System</p>
                <p class="subtitle">Lipa Campus</p>
            </div>
            
            <div class="content">
                <div class="greeting">
                    Hello {superadmin_profile.first_name} {superadmin_profile.last_name},
                </div>
                
                <div class="message">
                    <p>Welcome to the ILEAP System! Your <strong>Super Admin</strong> account has been successfully created.</p>
                    <p>You now have full administrative access to manage the entire ILEAP platform.</p>
                </div>
                
                <div class="credentials-box">
                    <h3>🔑 Your Login Credentials</h3>
                    <div class="credential-item">
                        <span class="credential-label">Email:</span>
                        <span class="credential-value">{new_user.email_address}</span>
                    </div>
                    <div class="credential-item">
                        <span class="credential-label">Temporary Password:</span>
                        <span class="credential-value">{default_password}</span>
                    </div>
                </div>
                
                <div class="warning-box">
                    <strong>⚠️ IMPORTANT SECURITY NOTICE</strong><br>
                    For security reasons, you will be required to change your password upon first login. Please keep your credentials confidential and do not share them with anyone.
                </div>
                
                <div style="text-align: center;">
                    <a href="http://localhost:4200" class="button">Login to ILEAP System</a>
                </div>
                
                <div class="message" style="margin-top: 30px;">
                    <p>If you have any questions or need assistance, please contact the system administrator.</p>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>ILEAP System</strong></p>
                <p>Batangas State University - The National Engineering University</p>
                <p>Lipa Campus</p>
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
    """

    email_sent = False
    try:
        email_user = os.getenv("EMAIL_USER")
        email_password = os.getenv("EMAIL_PASSWORD")
        
        if email_user and email_password:
            msg = MIMEMultipart('alternative')
            msg['From'] = email_user
            msg['To'] = new_user.email_address
            msg['Subject'] = "🎉 Welcome to ILEAP - Super Admin Account Created"
            
            # Attach HTML version
            msg.attach(MIMEText(email_body_html, 'html'))
            
            # Try with timeout to avoid hanging
            server = smtplib.SMTP('smtp.gmail.com', 587, timeout=10)
            server.starttls()
            server.login(email_user, email_password)
            server.send_message(msg)
            server.quit()
            
            email_sent = True
            print(f"✅ Welcome email sent to {new_user.email_address}")
        else:
            print("⚠️  EMAIL_USER or EMAIL_PASSWORD not configured. Skipping email.")
    except Exception as email_error:
        print(f"⚠️  Failed to send welcome email: {email_error}")
        # Don't fail the registration if email fails

    message = "Superadmin created successfully."
    if email_sent:
        message += " Login credentials have been sent to your email."
    else:
        message += f" Please use the temporary password: {default_password}"
    message += " You will be required to change your password on first login."

    return {
        "status": "success",
        "data": [{
            "user_id": new_user.user_id,
            "email": new_user.email_address,
            "role": new_user.role,
            "first_name": superadmin_profile.first_name,
            "last_name": superadmin_profile.last_name,
            "default_password": default_password
        }],
        "message": message
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
    reset_token_expiry = philippine_utcnow() + timedelta(hours=1)  # 1 hour expiry
    
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
    
    if not user.reset_token_expiry or philippine_utcnow() > user.reset_token_expiry:
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
