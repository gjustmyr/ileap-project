#!/bin/bash
# ILEAP Complete Single EC2 Deployment Script
# Deploys all 6 frontends + 1 backend + file storage on one EC2 instance
# Run as: sudo bash deployment/deploy-single-ec2.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/var/www/ileap"
SOURCE_DIR="/home/ubuntu/ileap-source"
DB_NAME="ileap_db"
DB_USER="ileap_user"
DB_PASSWORD="IleapSecure2024!"  # Change this!

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  ILEAP Single EC2 Deployment Script   ║${NC}"
echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo ""

# Get EC2 public IP
echo -e "${GREEN}📡 Detecting EC2 Public IP...${NC}"
EC2_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
if [ -z "$EC2_IP" ]; then
    echo -e "${RED}❌ Failed to detect EC2 IP. Are you running on EC2?${NC}"
    exit 1
fi
echo -e "${GREEN}✅ EC2 IP: $EC2_IP${NC}"
echo ""

# Step 1: Install Required Software
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 1: Installing Required Software${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

echo -e "${YELLOW}Installing Node.js 18.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi
echo -e "${GREEN}✅ Node.js $(node --version) installed${NC}"

echo -e "${YELLOW}Installing Python 3.11...${NC}"
if ! command -v python3.11 &> /dev/null; then
    sudo apt install -y python3.11 python3.11-venv python3-pip
fi
echo -e "${GREEN}✅ Python $(python3.11 --version) installed${NC}"

echo -e "${YELLOW}Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
fi
echo -e "${GREEN}✅ Nginx installed${NC}"

echo -e "${YELLOW}Installing PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    sudo apt install -y postgresql postgresql-contrib
fi
echo -e "${GREEN}✅ PostgreSQL installed${NC}"

# Step 2: Create Directory Structure
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 2: Creating Directory Structure${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

sudo mkdir -p $DEPLOY_DIR/{clients,api,uploads}
sudo mkdir -p $DEPLOY_DIR/uploads/{profile_pictures,requirements,resumes,moa,requirement_templates}

# Set ownership
sudo chown -R ubuntu:ubuntu $DEPLOY_DIR
sudo chown -R www-data:www-data $DEPLOY_DIR/uploads
sudo chmod -R 755 $DEPLOY_DIR

echo -e "${GREEN}✅ Directory structure created at $DEPLOY_DIR${NC}"

# Step 3: Setup Database
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 3: Setting Up Database${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
sudo -u postgres psql << EOF
CREATE DATABASE $DB_NAME;
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
EOF

echo -e "${GREEN}✅ Database configured${NC}"

# Step 4: Build Frontend Applications
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 4: Building Frontend Applications${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

cd $SOURCE_DIR

APPS=("employer" "ojt-coordinator" "ojt-head" "student-trainee" "superadmin" "supervisor")

for APP in "${APPS[@]}"; do
    echo -e "${YELLOW}Building $APP...${NC}"
    cd $SOURCE_DIR/client/$APP
    
    # Create production environment file
    mkdir -p src/environments
    cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://${EC2_IP}:3000'
};
EOF
    
    # Install dependencies (suppress output)
    npm install --legacy-peer-deps > /dev/null 2>&1
    
    # Build for production
    npm run build -- --configuration production
    
    # Copy to deployment directory
    sudo rm -rf $DEPLOY_DIR/clients/$APP
    sudo mkdir -p $DEPLOY_DIR/clients/$APP
    
    # Handle different Angular output paths
    if [ -d "dist/$APP/browser" ]; then
        sudo cp -r dist/$APP/browser/* $DEPLOY_DIR/clients/$APP/
    elif [ -d "dist/$APP" ]; then
        sudo cp -r dist/$APP/* $DEPLOY_DIR/clients/$APP/
    elif [ -d "dist" ]; then
        sudo cp -r dist/* $DEPLOY_DIR/clients/$APP/
    fi
    
    echo -e "${GREEN}✅ $APP built and deployed${NC}"
done

# Step 5: Setup Backend API
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 5: Setting Up Backend API${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

cd $SOURCE_DIR/server-fastapi

# Create virtual environment
echo -e "${YELLOW}Creating Python virtual environment...${NC}"
python3.11 -m venv $DEPLOY_DIR/api/venv

# Activate and install dependencies
source $DEPLOY_DIR/api/venv/bin/activate
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt > /dev/null 2>&1
pip install gunicorn > /dev/null 2>&1
deactivate

# Copy backend files
echo -e "${YELLOW}Copying backend files...${NC}"
rsync -av --exclude='venv' --exclude='__pycache__' --exclude='*.pyc' \
    $SOURCE_DIR/server-fastapi/ $DEPLOY_DIR/api/

# Generate secure JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Create .env file
cat > $DEPLOY_DIR/api/.env << EOF
# Database Configuration
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}

# JWT Configuration
JWT_SECRET_KEY=${JWT_SECRET}
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins
CORS_ORIGINS=http://${EC2_IP}:7000,http://${EC2_IP}:7001,http://${EC2_IP}:7002,http://${EC2_IP}:7003,http://${EC2_IP}:7004,http://${EC2_IP}:7100

# Upload Configuration
UPLOAD_DIR=${DEPLOY_DIR}/uploads
MAX_UPLOAD_SIZE=52428800

# API Configuration
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=False
ENVIRONMENT=production
EOF

echo -e "${GREEN}✅ Backend configured${NC}"

# Step 6: Create Systemd Service
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 6: Creating Systemd Service${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

sudo tee /etc/systemd/system/ileap-api.service > /dev/null << EOF
[Unit]
Description=ILEAP FastAPI Backend
After=network.target postgresql.service

[Service]
Type=notify
User=ubuntu
Group=ubuntu
WorkingDirectory=${DEPLOY_DIR}/api
Environment="PATH=${DEPLOY_DIR}/api/venv/bin"
ExecStart=${DEPLOY_DIR}/api/venv/bin/gunicorn main:app \\
    --workers 4 \\
    --worker-class uvicorn.workers.UvicornWorker \\
    --bind 127.0.0.1:8000 \\
    --timeout 120 \\
    --access-logfile /var/log/ileap-api-access.log \\
    --error-logfile /var/log/ileap-api-error.log
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Reload and start service
sudo systemctl daemon-reload
sudo systemctl enable ileap-api
sudo systemctl restart ileap-api

echo -e "${GREEN}✅ Systemd service created and started${NC}"

# Step 7: Configure Nginx
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 7: Configuring Nginx${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

sudo tee /etc/nginx/sites-available/ileap > /dev/null << 'NGINXCONF'
# ILEAP Nginx Configuration

# API Backend (Port 3000 → 8000)
server {
    listen 3000;
    server_name _;

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }

    location /uploads/ {
        alias /var/www/ileap/uploads/;
        autoindex off;
        add_header 'Access-Control-Allow-Origin' '*' always;
    }

    access_log /var/log/nginx/ileap-api-access.log;
    error_log /var/log/nginx/ileap-api-error.log;
}

# Student Trainee Portal
server {
    listen 7000;
    server_name _;
    root /var/www/ileap/clients/student-trainee;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# Employer Portal
server {
    listen 7001;
    server_name _;
    root /var/www/ileap/clients/employer;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# OJT Coordinator Portal
server {
    listen 7002;
    server_name _;
    root /var/www/ileap/clients/ojt-coordinator;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# OJT Head Portal
server {
    listen 7003;
    server_name _;
    root /var/www/ileap/clients/ojt-head;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# Superadmin Portal
server {
    listen 7004;
    server_name _;
    root /var/www/ileap/clients/superadmin;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# Supervisor Portal
server {
    listen 7100;
    server_name _;
    root /var/www/ileap/clients/supervisor;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
NGINXCONF

# Create landing page
sudo tee /etc/nginx/sites-available/ileap-landing > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    location / {
        return 200 '<!DOCTYPE html>
<html>
<head>
    <title>ILEAP - Portal Selection</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: "Segoe UI", Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        h1 { color: white; text-align: center; margin: 40px 0 20px; font-size: 2.5em; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .subtitle { color: rgba(255,255,255,0.9); text-align: center; margin-bottom: 40px; font-size: 1.2em; }
        .portal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; margin-bottom: 30px; }
        .portal-card { background: white; border-radius: 15px; padding: 30px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: transform 0.3s, box-shadow 0.3s; }
        .portal-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,0,0,0.3); }
        .portal-card a { display: block; color: #2c3e50; text-decoration: none; }
        .portal-icon { font-size: 3em; margin-bottom: 15px; }
        .portal-name { font-size: 1.3em; font-weight: bold; color: #34495e; }
        .api-section { background: white; border-radius: 15px; padding: 25px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .api-section h2 { color: #2c3e50; margin-bottom: 15px; }
        .api-section a { color: #667eea; font-size: 1.1em; text-decoration: none; font-weight: bold; }
        .api-section a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎓 ILEAP</h1>
        <p class="subtitle">Internship Learning and Employment Assistance Program</p>
        
        <div class="portal-grid">
            <div class="portal-card">
                <a href="http://${EC2_IP}:7000">
                    <div class="portal-icon">👨‍🎓</div>
                    <div class="portal-name">Student Trainee</div>
                </a>
            </div>
            <div class="portal-card">
                <a href="http://${EC2_IP}:7001">
                    <div class="portal-icon">🏢</div>
                    <div class="portal-name">Employer</div>
                </a>
            </div>
            <div class="portal-card">
                <a href="http://${EC2_IP}:7002">
                    <div class="portal-icon">📋</div>
                    <div class="portal-name">OJT Coordinator</div>
                </a>
            </div>
            <div class="portal-card">
                <a href="http://${EC2_IP}:7003">
                    <div class="portal-icon">👔</div>
                    <div class="portal-name">OJT Head</div>
                </a>
            </div>
            <div class="portal-card">
                <a href="http://${EC2_IP}:7004">
                    <div class="portal-icon">⚙️</div>
                    <div class="portal-name">Superadmin</div>
                </a>
            </div>
            <div class="portal-card">
                <a href="http://${EC2_IP}:7100">
                    <div class="portal-icon">👨‍💼</div>
                    <div class="portal-name">Supervisor</div>
                </a>
            </div>
        </div>
        
        <div class="api-section">
            <h2>🔧 API Documentation</h2>
            <a href="http://${EC2_IP}:3000/docs" target="_blank">http://${EC2_IP}:3000/docs</a>
        </div>
    </div>
</body>
</html>';
        add_header Content-Type text/html;
    }
}
EOF

# Enable sites
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/ileap /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/ileap-landing /etc/nginx/sites-enabled/

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

echo -e "${GREEN}✅ Nginx configured and started${NC}"

# Step 8: Configure Firewall (UFW)
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Step 8: Configuring Firewall${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 3000/tcp # API
    sudo ufw allow 7000:7004/tcp # Portals
    sudo ufw allow 7100/tcp # Supervisor
    echo "y" | sudo ufw enable
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠ UFW not found, skipping firewall configuration${NC}"
fi

# Final Status Check
echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Final Status Check${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Check backend status
if sudo systemctl is-active --quiet ileap-api; then
    echo -e "${GREEN}✅ Backend API is running${NC}"
else
    echo -e "${RED}❌ Backend API failed to start${NC}"
    sudo journalctl -u ileap-api -n 20
fi

# Check Nginx status
if sudo systemctl is-active --quiet nginx; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx failed to start${NC}"
fi

# Display summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉         ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Access your application:${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Landing Page:      ${GREEN}http://${EC2_IP}${NC}"
echo -e "API Docs:          ${GREEN}http://${EC2_IP}:3000/docs${NC}"
echo ""
echo -e "${BLUE}Portals:${NC}"
echo -e "Student Trainee:   ${GREEN}http://${EC2_IP}:7000${NC}"
echo -e "Employer:          ${GREEN}http://${EC2_IP}:7001${NC}"
echo -e "OJT Coordinator:   ${GREEN}http://${EC2_IP}:7002${NC}"
echo -e "OJT Head:          ${GREEN}http://${EC2_IP}:7003${NC}"
echo -e "Superadmin:        ${GREEN}http://${EC2_IP}:7004${NC}"
echo -e "Supervisor:        ${GREEN}http://${EC2_IP}:7100${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "View API logs:     ${YELLOW}sudo journalctl -u ileap-api -f${NC}"
echo -e "Restart backend:   ${YELLOW}sudo systemctl restart ileap-api${NC}"
echo -e "Restart Nginx:     ${YELLOW}sudo systemctl restart nginx${NC}"
echo -e "View uploads:      ${YELLOW}ls -la ${DEPLOY_DIR}/uploads/${NC}"
echo ""
echo -e "${RED}⚠  IMPORTANT: Update your AWS Security Group to allow:${NC}"
echo -e "   Ports: 22, 80, 3000, 7000, 7001, 7002, 7003, 7004, 7100"
echo ""
