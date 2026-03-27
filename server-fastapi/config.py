"""
Configuration settings for ILEAP API
Handles environment variables and path configuration
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Timezone configuration - Set to Philippine timezone
TIMEZONE = os.getenv("TZ", "Asia/Manila")
os.environ["TZ"] = TIMEZONE

# Base directory (project root)
BASE_DIR = Path(__file__).resolve().parent

# Upload directory configuration
# In development: uses relative path 'uploads/'
# In production: uses absolute path from environment variable or defaults to /var/www/html/uploads
UPLOAD_BASE_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))

# Specific upload directories
# NOTE: Directories must be created manually with proper permissions
# For production: sudo mkdir -p /var/www/html/uploads/{profile_pictures,requirements,resumes,moa,logos,requirement_templates,documents,accomplishments}
# For production: sudo chown -R ec2-user:nginx /var/www/html/uploads && sudo chmod -R 775 /var/www/html/uploads
UPLOAD_DIRS = {
    "profile_pictures": Path(UPLOAD_BASE_DIR) / "profile_pictures",
    "requirements": Path(UPLOAD_BASE_DIR) / "requirements",
    "resumes": Path(UPLOAD_BASE_DIR) / "resumes",
    "moa": Path(UPLOAD_BASE_DIR) / "moa",
    "logos": Path(UPLOAD_BASE_DIR) / "logos",
    "requirement_templates": Path(UPLOAD_BASE_DIR) / "requirement_templates",
    "documents": Path(UPLOAD_BASE_DIR) / "documents",
    "accomplishments": Path(UPLOAD_BASE_DIR) / "accomplishments",
}

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET") or os.getenv("SECRET_KEY")
if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET or SECRET_KEY environment variable is required")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# CORS configuration
# IMPORTANT: CORS_ORIGINS must be set in .env for production
# Never use wildcard (*) in production
CORS_ORIGINS_ENV = os.getenv("CORS_ORIGINS")
if CORS_ORIGINS_ENV:
    CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_ENV.split(",")]
else:
    # Development-only defaults - MUST set CORS_ORIGINS in production
    print("⚠️  WARNING: Using default CORS origins for development. Set CORS_ORIGINS in .env for production!")
    CORS_ORIGINS = [
        "http://localhost:4200",  # Superadmin
        "http://localhost:4201",  # OJT Head
        "http://localhost:4202",  # OJT Coordinator
        "http://localhost:4203",  # Student Trainee
        "http://localhost:4204",  # Employer
        "http://localhost:4205",  # Supervisor
        "http://localhost:4206",  # Job Placement Head
        "http://localhost:4207",  # Alumni
    ]

# File upload configuration
MAX_UPLOAD_SIZE = 52428800  # 50MB

# API configuration
API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("PORT", os.getenv("API_PORT", "3000")))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

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
        Full URL string (e.g., 'http://54.160.137.135:8000/uploads/requirements/file.pdf')
    """
    # Get base URL from environment or use default
    base_url = os.getenv("API_BASE_URL", f"http://localhost:{API_PORT}")
    return f"{base_url}/uploads/{category}/{filename}"
