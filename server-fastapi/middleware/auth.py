from fastapi import HTTPException, status, Header, Depends
import jwt
import os
from models_token_blacklist import token_blacklist

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"


def verify_token(authorization: str = Header(None)):
    """Verify JWT token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing"
        )
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "")
        
        # Check if token is blacklisted (invalidated)
        if token_blacklist.is_blacklisted(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been invalidated"
            )
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def get_current_user(authorization: str = Header(None)):
    """Get current user from JWT token"""
    print(f"DEBUG get_current_user - Authorization header: {authorization}")
    payload = verify_token(authorization)
    print(f"DEBUG get_current_user - Payload: {payload}")
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    return {
        "user_id": payload.get("user_id"),
        "role": payload.get("role"),
        "email": payload.get("email")
    }
