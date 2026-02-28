#!/bin/bash
# Comprehensive fix for backend deployment issues on EC2

echo "=== ILEAP Backend Deployment Fix ==="
echo ""

# Step 1: Stop all PM2 processes
echo "Step 1: Stopping all PM2 processes..."
pm2 delete all
pm2 save --force
echo "✓ All PM2 processes stopped"
echo ""

# Step 2: Navigate to project directory
echo "Step 2: Navigating to project directory..."
cd /home/ec2-user/ileap-project/server-fastapi
echo "✓ In directory: $(pwd)"
echo ""

# Step 3: Fix config.py indentation
echo "Step 3: Fixing config.py..."
cp config.py config.py.backup.$(date +%Y%m%d_%H%M%S)

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
UPLOAD_BASE_DIR = os.getenv("UPLOAD_DIR", "/var/www/html/uploads")

# Ensure upload base directory exists (but don't create if no permission)
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

# Create all upload subdirectories
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
    "http://localhost:4200",
    "http://localhost:4201",
    "http://localhost:4202",
    "http://localhost:4203",
    "http://localhost:4204",
    "http://localhost:4205",
    "http://localhost:4206",
    "http://localhost:4207",
]

# File upload configuration
MAX_UPLOAD_SIZE = 52428800  # 50MB

# API configuration
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
CONFIGEOF

echo "✓ config.py fixed with proper indentation and error handling"
echo ""

# Step 4: Verify Python syntax
echo "Step 4: Verifying Python syntax..."
source venv/bin/activate
python -m py_compile config.py
if [ $? -eq 0 ]; then
    echo "✓ config.py syntax is valid"
else
    echo "✗ config.py has syntax errors"
    exit 1
fi
echo ""

# Step 5: Fix upload directory permissions
echo "Step 5: Fixing upload directory permissions..."
sudo chown -R ec2-user:nginx /var/www/html/uploads
sudo chmod -R 775 /var/www/html/uploads
echo "✓ Permissions fixed"
echo ""

# Step 6: Start backend with PM2 (single instance)
echo "Step 6: Starting backend with PM2..."
pm2 start "uvicorn main:app --host 0.0.0.0 --port 3000" --name ileap-backend
pm2 save
echo "✓ Backend started"
echo ""

# Step 7: Check status
echo "Step 7: Checking PM2 status..."
pm2 list
echo ""

# Step 8: Show logs
echo "Step 8: Showing recent logs..."
sleep 3
pm2 logs ileap-backend --lines 30 --nostream
echo ""

echo "=== Fix Complete ==="
echo ""
echo "Next steps:"
echo "1. Check if backend is running: pm2 status"
echo "2. View logs: pm2 logs ileap-backend"
echo "3. Test API: curl http://localhost:3000/api/health"
