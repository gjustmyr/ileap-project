#!/bin/bash

# ILEAP Deployment Script
# This script builds and deploys all Angular portals and updates the backend

set -e  # Exit on error

echo "=========================================="
echo "ILEAP System Deployment Script"
echo "=========================================="
echo ""

# Configuration
PROJECT_DIR="/home/ubuntu/ileap-project"
WEB_ROOT="/var/www/html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running from correct directory
if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR

# Pull latest changes
print_status "Pulling latest changes from Git..."
git pull origin main

# Function to build and deploy a portal
deploy_portal() {
    local portal=$1
    local base_href=$2
    local dest=$3
    
    print_status "Building $portal portal..."
    
    cd $PROJECT_DIR/client/$portal
    
    # Install dependencies
    npm install --silent
    
    # Build for production
    npm run build -- --configuration production --base-href=$base_href
    
    # Deploy to web root
    print_status "Deploying $portal to $WEB_ROOT/$dest..."
    sudo rm -rf $WEB_ROOT/$dest/*
    sudo mkdir -p $WEB_ROOT/$dest
    
    # Copy built files (adjust path based on Angular version)
    if [ -d "dist/$portal/browser" ]; then
        sudo cp -r dist/$portal/browser/* $WEB_ROOT/$dest/
    elif [ -d "dist/$portal" ]; then
        sudo cp -r dist/$portal/* $WEB_ROOT/$dest/
    else
        print_error "Build output not found for $portal"
        return 1
    fi
    
    print_status "$portal deployed successfully!"
    cd $PROJECT_DIR
}

# Deploy all portals
echo ""
print_status "Starting frontend deployment..."
echo ""

deploy_portal "superadmin" "/superadmin/" "superadmin"
deploy_portal "ojt-head" "/ojt-head/" "ojt-head"
deploy_portal "ojt-coordinator" "/ojt-coordinator/" "ojt-coordinator"
deploy_portal "student" "/student/" "student"
deploy_portal "employer" "/employer/" "employer"
deploy_portal "supervisor" "/supervisor/" "supervisor"
deploy_portal "job-placement-head" "/jp-head/" "jp-head"
deploy_portal "alumni" "/alumni/" "alumni"

# Update backend
echo ""
print_status "Updating backend..."
cd $PROJECT_DIR/server-fastapi

# Activate virtual environment and update dependencies
source venv/bin/activate
pip install -r requirements.txt --quiet

# Restart backend service
print_status "Restarting backend service..."
sudo systemctl restart ileap-backend

# Wait for service to start
sleep 3

# Check if service is running
if sudo systemctl is-active --quiet ileap-backend; then
    print_status "Backend service is running"
else
    print_error "Backend service failed to start"
    sudo systemctl status ileap-backend
    exit 1
fi

# Set proper permissions
print_status "Setting permissions..."
sudo chown -R www-data:www-data $WEB_ROOT
sudo chmod -R 755 $WEB_ROOT
sudo chmod -R 775 $WEB_ROOT/uploads

# Reload Nginx
print_status "Reloading Nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo ""
echo "=========================================="
print_status "Deployment completed successfully!"
echo "=========================================="
echo ""
print_status "Portal URLs:"
echo "  - Superadmin: http://yourdomain.com/superadmin"
echo "  - OJT Head: http://yourdomain.com/ojt-head"
echo "  - OJT Coordinator: http://yourdomain.com/ojt-coordinator"
echo "  - Student: http://yourdomain.com/student"
echo "  - Employer: http://yourdomain.com/employer"
echo "  - Supervisor: http://yourdomain.com/supervisor"
echo "  - Job Placement Head: http://yourdomain.com/jp-head"
echo "  - Alumni: http://yourdomain.com/alumni"
echo "  - API: http://yourdomain.com/api"
echo ""
print_status "Check logs with:"
echo "  - Backend: sudo journalctl -u ileap-backend -f"
echo "  - Nginx: sudo tail -f /var/log/nginx/error.log"
echo ""
