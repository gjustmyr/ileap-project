"""
Configuration settings for ILEAP API
Handles environment variables and path configuration
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Base directory (project root)
BASE_DIR = Path(__file__).resolve().parent

# Upload directory configuration
# In development: uses relative path 'uploads/'
# In production: uses absolute path from environment variable or defaults to /var/www/ileap/uploads
UPLOAD_BASE_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))

# Ensure upload base directory exists
Path(UPLOAD_BASE_DIR).mkdir(parents=True, exist_ok=True)

# Specific upload directories
UPLOAD_DIRS = {
    "profile_pictures": Path(UPLOAD_BASE_DIR) / "profile_pictures",
    "requirements": Path(UPLOAD_BASE_DIR) / "requirements",
    "resumes": Path(UPLOAD_BASE_DIR) / "resumes",
    "moa": Path(UPLOAD_BASE_DIR) / "moa",
    "requirement_templates": Path(UPLOAD_BASE_DIR) / "requirement_templates",
}

# Create all upload subdirectories
for upload_dir in UPLOAD_DIRS.values():
    upload_dir.mkdir(parents=True, exist_ok=True)

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ileap.db")

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
    "http://localhost:4200",  # Superadmin
    "http://localhost:4201",  # Employer
    "http://localhost:4202",  # OJT Coordinator
    "http://localhost:4203",  # OJT Head
    "http://localhost:4204",  # Student Trainee
    "http://localhost:4700",  # Supervisor
    "http://127.0.0.1:4200",
    "http://127.0.0.1:4201",
    "http://127.0.0.1:4202",
    "http://127.0.0.1:4203",
    "http://127.0.0.1:4204",
    "http://127.0.0.1:4700",
    # Production EC2 URLs
    "http://54.160.137.135",
    "http://54.160.137.135:7000",  # Student
    "http://54.160.137.135:7001",  # Employer
    "http://54.160.137.135:7002",  # Coordinator
    "http://54.160.137.135:7003",  # OJT Head
    "http://54.160.137.135:7004",  # Superadmin
    "http://54.160.137.135:7100",  # Supervisor
]

# File upload configuration
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", 52428800))  # 50MB default

# API configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", 3000))
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

def get_upload_path(category: str, *parts) -> Path:
    """
    Get upload path for a specific category
    
    Args:
        category: One of 'profile_pictures', 'requirements', 'resumes', 'moa', 'requirement_templates'
        *parts: Additional path components
    
    Returns:
        Path object for the upload location
    """
    base = UPLOAD_DIRS.get(category, Path(UPLOAD_BASE_DIR) / category)
    if parts:
        return base / Path(*parts)
    return base

def get_upload_url(category: str, filename: str) -> str:
    """
    Get URL path for uploaded file
    
    Args:
        category: Upload category
        filename: Name of the file
    
    Returns:
        Full URL string (e.g., 'http://54.160.137.135:3000/uploads/requirements/file.pdf')
    """
    # Get base URL from environment or use default
    base_url = os.getenv("API_BASE_URL", f"http://localhost:{API_PORT}")
    return f"{base_url}/uploads/{category}/{filename}"
