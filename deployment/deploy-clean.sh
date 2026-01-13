#!/bin/bash
# ILEAP EC2 Deployment Script (Production-Ready - No Dev Files)

set -e  # Exit on error

echo "🚀 Starting ILEAP Production Deployment..."

# Configuration
PROJECT_DIR="/var/www/ileap"
BACKEND_DIR="$PROJECT_DIR/server-fastapi"
UPLOADS_DIR="/var/www/ileap/uploads"
NGINX_CONFIG="/etc/nginx/sites-available/ileap"
BACKEND_SERVICE="ileap-backend"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to remove development files
cleanup_dev_files() {
    echo -e "${BLUE}🧹 Removing development and documentation files...${NC}"
    
    # Remove SQL files
    find $PROJECT_DIR -type f -name "*.sql" -delete 2>/dev/null || true
    
    # Remove markdown files (except critical ones)
    find $PROJECT_DIR -maxdepth 1 -type f -name "*.md" -delete 2>/dev/null || true
    find $BACKEND_DIR -type f -name "*.md" ! -name "requirements.txt" -delete 2>/dev/null || true
    
    # Remove development scripts
    rm -f $BACKEND_DIR/create_*.py
    rm -f $BACKEND_DIR/check_*.py
    rm -f $BACKEND_DIR/fix_*.py
    rm -f $BACKEND_DIR/approve_test_records.py
    rm -f $BACKEND_DIR/recalculate_hours.py
    rm -f $BACKEND_DIR/run_migration.py
    rm -f $BACKEND_DIR/init_db.py
    
    # Remove database folder with SQL scripts
    rm -rf $BACKEND_DIR/database/
    
    # Remove test files
    find $BACKEND_DIR -type f -name "test_*.py" -delete 2>/dev/null || true
    find $BACKEND_DIR -type f -name "*_test.py" -delete 2>/dev/null || true
    
    # Remove temporary files
    rm -f $BACKEND_DIR/nul
    find $BACKEND_DIR -type f -name "*.tmp" -delete 2>/dev/null || true
    find $BACKEND_DIR -type f -name "*.bak" -delete 2>/dev/null || true
    
    # Remove __pycache__ directories
    find $BACKEND_DIR -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

# 1. Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install required packages
echo -e "${BLUE}📦 Installing dependencies...${NC}"
sudo apt install -y nginx python3-pip python3-venv nodejs npm git

# 3. Install PM2 for process management
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# 4. Create project directory
echo -e "${BLUE}📁 Creating project directories...${NC}"
sudo mkdir -p $PROJECT_DIR
sudo mkdir -p $UPLOADS_DIR/{profile_pictures,requirements,resumes,moa,requirement_templates}
sudo chown -R $USER:$USER $PROJECT_DIR
sudo chown -R www-data:www-data $UPLOADS_DIR
sudo chmod -R 755 $UPLOADS_DIR

# 5. Clone/Update repository
echo -e "${BLUE}📥 Setting up codebase...${NC}"
if [ -d "$PROJECT_DIR/.git" ]; then
    cd $PROJECT_DIR
    git pull
else
    # Replace with your actual repository URL
    git clone YOUR_REPO_URL $PROJECT_DIR
    cd $PROJECT_DIR
fi

# 5.1 Clean up development files
cleanup_dev_files

# 6. Build Angular frontends
echo -e "${BLUE}🔨 Building Angular applications...${NC}"
FRONTENDS=("employer" "ojt-coordinator" "ojt-head" "student-trainee" "superadmin" "supervisor")

for frontend in "${FRONTENDS[@]}"; do
    echo -e "${YELLOW}Building $frontend...${NC}"
    cd $PROJECT_DIR/client/$frontend
    
    # Update API URL in environment files
    cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com'
};
EOF
    
    npm install --production
    npm run build --configuration=production
    
    # Copy build to nginx directory
    sudo mkdir -p /var/www/ileap/client/$frontend
    sudo cp -r dist/* /var/www/ileap/client/$frontend/
    
    # Remove node_modules after build
    rm -rf node_modules
done

# 7. Setup Python backend
echo -e "${BLUE}🐍 Setting up FastAPI backend...${NC}"
cd $BACKEND_DIR

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --no-cache-dir -r requirements.txt

# Create .env file (you'll need to fill this)
if [ ! -f .env ]; then
    cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost:5432/ileap
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
    echo -e "${YELLOW}⚠️  Please update .env file with actual credentials${NC}"
fi

# 8. Setup systemd service for FastAPI
echo -e "${BLUE}⚙️  Setting up systemd service...${NC}"
sudo tee /etc/systemd/system/$BACKEND_SERVICE.service > /dev/null << EOF
[Unit]
Description=ILEAP FastAPI Backend
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
ExecStart=$BACKEND_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 3000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $BACKEND_SERVICE
sudo systemctl restart $BACKEND_SERVICE

# 9. Configure Nginx
echo -e "${BLUE}🌐 Configuring Nginx...${NC}"
# Note: nginx.conf should be manually uploaded to server
if [ -f "$PROJECT_DIR/deployment/nginx.conf" ]; then
    sudo cp $PROJECT_DIR/deployment/nginx.conf $NGINX_CONFIG
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/ileap
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
else
    echo -e "${RED}⚠️  Nginx config not found. Please upload nginx.conf manually${NC}"
fi

# 10. Setup SSL with Let's Encrypt
echo -e "${BLUE}🔒 Setting up SSL (Let's Encrypt)...${NC}"
sudo apt install -y certbot python3-certbot-nginx

echo -e "${YELLOW}Run the following commands after DNS is configured:${NC}"
echo "sudo certbot --nginx -d api.yourdomain.com"
echo "sudo certbot --nginx -d employer.yourdomain.com"
echo "sudo certbot --nginx -d supervisor.yourdomain.com"
echo "sudo certbot --nginx -d coordinator.yourdomain.com"
echo "sudo certbot --nginx -d head.yourdomain.com"
echo "sudo certbot --nginx -d student.yourdomain.com"
echo "sudo certbot --nginx -d admin.yourdomain.com"

# 11. Setup automatic SSL renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 12. Final cleanup
echo -e "${BLUE}🧹 Final cleanup...${NC}"
rm -rf $PROJECT_DIR/deployment

# Display final status
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}Deployed Files Summary:${NC}"
echo "  Frontend Apps: 6 Angular applications"
echo "  Backend: FastAPI server"
echo "  Excluded: .sql, .md, test files, dev scripts"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure DNS A records for all subdomains"
echo "2. Update .env file: nano $BACKEND_DIR/.env"
echo "3. Run SSL setup commands shown above"
echo "4. Check backend: sudo systemctl status $BACKEND_SERVICE"
echo "5. Check nginx: sudo systemctl status nginx"
echo "6. Check logs: sudo journalctl -u $BACKEND_SERVICE -f"
