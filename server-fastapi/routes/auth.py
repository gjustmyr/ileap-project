from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import SuperAdminCreate, LoginRequest, LoginResponse, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
from schemas.common import Response
from controllers import auth_controller
from middleware.auth import verify_token, optional_verify_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint - Generic (legacy, not recommended)"""
    return auth_controller.login_user(credentials, db)


@router.post("/superadmin/login", response_model=LoginResponse)
async def login_superadmin(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Superadmin portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="superadmin")


@router.post("/employer/login", response_model=LoginResponse)
async def login_employer(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Employer portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="employer")


@router.post("/coordinator/login", response_model=LoginResponse)
async def login_coordinator(credentials: LoginRequest, db: Session = Depends(get_db)):
    """OJT Coordinator portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="ojt_coordinator")


@router.post("/head/login", response_model=LoginResponse)
async def login_head(credentials: LoginRequest, db: Session = Depends(get_db)):
    """OJT Head portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="ojt_head")


@router.post("/student/login", response_model=LoginResponse)
async def login_student(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Student portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="student")


@router.post("/supervisor/login", response_model=LoginResponse)
async def login_supervisor(credentials: LoginRequest, db: Session = Depends(get_db)):
    """Supervisor portal login"""
    return auth_controller.login_user_by_role(credentials, db, expected_role="trainee_supervisor")



@router.post("/logout")
async def logout(authorization: str = Header(None), token_data: dict = Depends(verify_token)):
    """User logout endpoint - Invalidates the current token"""
    return auth_controller.logout_user(authorization)


@router.post("/superadmin", response_model=Response, status_code=status.HTTP_201_CREATED)
async def create_superadmin(admin: SuperAdminCreate, db: Session = Depends(get_db)):
    """Create superadmin endpoint"""
    return auth_controller.create_superadmin(admin, db)


@router.get("/validate-token")
async def validate_token(token_data: dict = Depends(verify_token)):
    """
    Validate JWT token.
    Returns 401 if token is invalid, expired, or missing.
    Use this endpoint to check if user is authenticated.
    """
    return {
        "success": True,
        "message": "Token is valid"
    }


@router.get("/check-auth")
async def check_auth(token_data: dict = Depends(optional_verify_token)):
    """
    Check if user is already authenticated (for login page redirect).
    Returns user info if authenticated, or indicates no authentication.
    Does NOT return 401 - used to determine if login page should redirect.
    """
    if token_data:
        return {
            "success": True,
            "authenticated": True,
            "message": "User is authenticated",
            "data": {
                "user_id": token_data.get("user_id"),
                "email": token_data.get("email"),
                "role": token_data.get("role")
            }
        }
    else:
        return {
            "success": True,
            "authenticated": False,
            "message": "User is not authenticated",
            "data": None
        }


@router.get("/profile")
async def get_user_profile(token_data: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """
    Get current user's profile information including name.
    Works for all user types (superadmin, student, employer, etc.)
    """
    user_id = token_data.get("user_id")
    role = token_data.get("role")
    
    # Get basic user info
    from models import User, SuperAdminProfile, Student, Employer, OJTHead, OJTCoordinator, TraineeSupervisor
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile_data = {
        "user_id": user.user_id,
        "email": user.email_address,
        "role": user.role,
        "first_name": None,
        "last_name": None,
        "full_name": None,
        "contact_number": None,
        "position_title": None
    }
    
    # Get role-specific profile information
    if role == "superadmin":
        profile = db.query(SuperAdminProfile).filter(SuperAdminProfile.user_id == user_id).first()
        if profile:
            profile_data.update({
                "first_name": profile.first_name,
                "last_name": profile.last_name,
                "full_name": f"{profile.first_name} {profile.last_name}",
                "contact_number": profile.contact_number,
                "position_title": profile.position_title
            })
    
    elif role == "student":
        student = db.query(Student).filter(Student.user_id == user_id).first()
        if student:
            profile_data.update({
                "first_name": student.first_name,
                "last_name": student.last_name,
                "full_name": f"{student.first_name} {student.last_name}",
                "contact_number": student.contact_number
            })
    
    elif role == "employer":
        employer = db.query(Employer).filter(Employer.user_id == user_id).first()
        if employer:
            profile_data.update({
                "first_name": employer.representative_name,
                "full_name": employer.representative_name,
                "contact_number": employer.phone_number,
                "company_name": employer.company_name
            })
    
    elif role == "ojt_head":
        ojt_head = db.query(OJTHead).filter(OJTHead.user_id == user_id).first()
        if ojt_head:
            profile_data.update({
                "first_name": ojt_head.first_name,
                "last_name": ojt_head.last_name,
                "full_name": f"{ojt_head.first_name} {ojt_head.last_name}",
                "contact_number": ojt_head.contact_number,
                "position_title": ojt_head.position_title
            })
    
    elif role == "ojt_coordinator":
        coordinator = db.query(OJTCoordinator).filter(OJTCoordinator.user_id == user_id).first()
        if coordinator:
            profile_data.update({
                "first_name": coordinator.first_name,
                "last_name": coordinator.last_name,
                "full_name": f"{coordinator.first_name} {coordinator.last_name}",
                "contact_number": coordinator.contact_number,
                "position_title": coordinator.position_title
            })
    
    elif role == "trainee_supervisor":
        supervisor = db.query(TraineeSupervisor).filter(TraineeSupervisor.user_id == user_id).first()
        if supervisor:
            profile_data.update({
                "first_name": supervisor.first_name,
                "last_name": supervisor.last_name,
                "full_name": f"{supervisor.first_name} {supervisor.last_name}",
                "contact_number": supervisor.contact_number,
                "position_title": supervisor.position_title
            })
    
    return {
        "success": True,
        "message": "Profile retrieved successfully",
        "data": profile_data
    }


@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request password reset - sends reset link to email"""
    return auth_controller.forgot_password(request.email_address, db)


@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using token from email"""
    return auth_controller.reset_password(request.token, request.new_password, db)


@router.post("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    token_data: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Change password for authenticated user"""
    user_id = token_data.get("user_id")
    return auth_controller.change_password(user_id, request.current_password, request.new_password, db)
