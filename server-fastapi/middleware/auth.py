from fastapi import HTTPException, status, Header, Depends
import jwt
import os
from models_token_blacklist import token_blacklist

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"


def verify_token(authorization: str = Header(None)):
    """
    Verify JWT token from Authorization header.
    Raises HTTPException with 401 status if token is invalid, expired, or blacklisted.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.replace("Bearer ", "").strip()
        
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token is empty",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Check if token is blacklisted (logged out)
        if token_blacklist.is_blacklisted(token):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has been invalidated. Please login again.",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Decode and verify token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verify required fields exist
        if not payload.get("user_id") or not payload.get("role"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token. Please login again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"}
        )


def get_current_user(authorization: str = Header(None)):
    """
    Get current user from JWT token.
    Returns user data if token is valid, raises HTTPException otherwise.
    """
    payload = verify_token(authorization)
    
    return {
        "user_id": payload.get("user_id"),
        "role": payload.get("role"),
        "email": payload.get("email")
    }


def optional_verify_token(authorization: str = Header(None)):
    """
    Optional token verification - doesn't raise exception if no token.
    Returns payload if valid token exists, None otherwise.
    Used for routes that should redirect logged-in users (like login page).
    """
    if not authorization:
        return None
    
    try:
        token = authorization.replace("Bearer ", "").strip()
        if not token or token_blacklist.is_blacklisted(token):
            return None
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None
    except Exception:
        return None
