from fastapi import APIRouter, Depends, status, Header
from sqlalchemy.orm import Session
from database import get_db
from schemas.auth import SuperAdminCreate, LoginRequest, LoginResponse
from schemas.common import Response
from controllers import auth_controller
from middleware.auth import verify_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """User login endpoint"""
    return auth_controller.login_user(credentials, db)


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
    """Validate JWT token"""
    return {
        "success": True,
        "message": "Token is valid",
        "data": {
            "user_id": token_data.get("user_id"),
            "email": token_data.get("email"),
            "role": token_data.get("role")
        }
    }
