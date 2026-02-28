"""
Configuration settings for ILEAP API
Handles environment variables and path configuration
"""
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

TIMEZONE = os.getenv("TZ", "Asia/Manila")
os.environ["TZ"] = TIMEZONE

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_BASE_DIR = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))

try:
    Path(UPLOAD_BASE_DIR).mkdir(parents=True, exist_ok=True)
except PermissionError:
    print(f"Warning: Cannot create {UPLOAD_BASE_DIR}, assuming it exists")

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

for upload_dir in UPLOAD_DIRS.values():
    try:
        upload_dir.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        print(f"Warning: Cannot create {upload_dir}, assuming it exists")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ileap.db")

JWT_SECRET_KEY = os.getenv("JWT_SECRET", "ILEAP_JWT_SECRET_KEY_2025_SECURE_TOKEN")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
    "http://localhost:4200",
    "http://localhost:4201",
    "http://localhost:4202",
    "http://localhost:4203",
    "http://localhost:4204",
    "http://localhost:4205",
    "http://localhost:4206",
    "http://localhost:4207",
]

MAX_UPLOAD_SIZE = 52428800

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("PORT", 3000))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

def get_upload_path(category: str, *parts) -> Path:
    """Get upload path for a specific category"""
    base = UPLOAD_DIRS.get(category, Path(UPLOAD_BASE_DIR) / category)
    if parts:
        return base / Path(*parts)
    return base

def get_upload_url(category: str, filename: str) -> str:
    """Get URL path for uploaded file"""
    base_url = os.getenv("API_BASE_URL", f"http://localhost:{API_PORT}")
    return f"{base_url}/uploads/{category}/{filename}"
