#!/bin/bash
# Directly fix config.py on EC2 server via SSH

echo "=== Fixing config.py on EC2 Server ==="
echo ""

ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19 << 'ENDSSH'
cd /home/ec2-user/ileap-project/server-fastapi

# Backup current config.py
cp config.py config.py.broken.backup

# Create the corrected config.py
cat > config.py << 'CONFIGEOF'
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

# Ensure upload base directory exists (with error handling for production)
try:
    Path(UPLOAD_BASE_DIR).mkdir(parents=True, exist_ok=True)
except PermissionError:
    print(f"Warning: Cannot create {UPLOAD_BASE_DIR}, assuming it exists")

# Specific upload directories
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

# Create all upload subdirectories (with error handling for production)
for upload_dir in UPLOAD_DIRS.values():
    try:
        upload_dir.mkdir(parents=True, exist_ok=True)
    except PermissionError:
        print(f"Warning: Cannot create {upload_dir}, assuming it exists")

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ileap.db")

# JWT configuration
JWT_SECRET_KEY = os.getenv("JWT_SECRET", "ILEAP_JWT_SECRET_KEY_2025_SECURE_TOKEN")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

# CORS configuration
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",") if os.getenv("CORS_ORIGINS") else [
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
API_PORT = int(os.getenv("PORT", 3000))
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
CONFIGEOF

echo "✓ config.py has been recreated"

# Verify Python syntax
source venv/bin/activate
python -m py_compile config.py

if [ $? -eq 0 ]; then
    echo "✓ config.py syntax is valid"
else
    echo "✗ config.py has syntax errors"
    exit 1
fi

# Update .env for production
cat > .env << 'ENVEOF'
# Production Environment Configuration
DATABASE_URL=postgresql://ileap_research:jDK7ScQmpZl0NTAiPQtnUz697laHcWYM@dpg-d6ft0nrh46gs738jsa2g-a.oregon-postgres.render.com/ileap_db_production
TZ=Asia/Manila
PORT=3000
API_HOST=0.0.0.0
DEBUG=False
UPLOAD_DIR=/var/www/html/uploads
API_BASE_URL=http://47.128.70.19:3000
SUPER_ADMIN_KEY=ILEAP_SUPER_SECRET_2025
JWT_SECRET=ILEAP_JWT_SECRET_KEY_2025_SECURE_TOKEN
EMAIL_USER=justmyr.gutierrez@g.batstate-u.edu.ph
EMAIL_PASSWORD=xnzo pvrp oewb lirs
CORS_ORIGINS=http://47.128.70.19,http://47.128.70.19/superadmin,http://47.128.70.19/ojt-head,http://47.128.70.19/ojt-coordinator,http://47.128.70.19/student,http://47.128.70.19/employer,http://47.128.70.19/supervisor,http://47.128.70.19/job-placement-head,http://47.128.70.19/alumni
ENVEOF

echo "✓ .env updated for production"

# Fix upload directory permissions
sudo chown -R ec2-user:nginx /var/www/html/uploads 2>/dev/null || true
sudo chmod -R 775 /var/www/html/uploads 2>/dev/null || true

echo "✓ Upload directory permissions fixed"

# Stop all PM2 processes
pm2 delete all 2>/dev/null || true
pm2 save --force

echo "✓ PM2 processes stopped"

# Start backend (single instance)
pm2 start "uvicorn main:app --host 0.0.0.0 --port 3000" --name ileap-backend
pm2 save

echo "✓ Backend started"

# Wait for startup
sleep 3

# Show status
echo ""
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Recent Logs ==="
pm2 logs ileap-backend --lines 30 --nostream

ENDSSH

echo ""
echo "=== Fix Complete ==="
echo ""
echo "Backend should now be running on http://47.128.70.19:3000"
