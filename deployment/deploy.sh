#!/bin/bash
# ILEAP Deployment Script for EC2
# Deploys to /var/www/ileap
# Run from project root: sudo bash deployment/deploy.sh

set -e

DEPLOY_DIR="/var/www/ileap"
PROJECT_DIR=$(pwd)

echo "🚀 Deploying ILEAP to /var/www/ileap..."

# Build all Angular clients
echo "🔨 Building Angular clients..."
CLIENTS=("employer" "ojt-coordinator" "ojt-head" "student-trainee" "superadmin" "supervisor")

for CLIENT in "${CLIENTS[@]}"; do
    echo "📦 Building $CLIENT..."
    cd "$PROJECT_DIR/client/$CLIENT"
    npm install --legacy-peer-deps
    npm run build -- --configuration production
    
    # Copy to /var/www/ileap/clients
    echo "📋 Deploying $CLIENT to /var/www..."
    rm -rf "$DEPLOY_DIR/clients/$CLIENT"
    mkdir -p "$DEPLOY_DIR/clients/$CLIENT"
    cp -r dist/$CLIENT/browser/* "$DEPLOY_DIR/clients/$CLIENT/"
done
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

# 5.1. Remove unnecessary files from production
echo -e "${BLUE}🧹 Cleaning up unnecessary files...${NC}"
find $PROJECT_DIR/server-fastapi -type f -name "*.sql" -delete
find $PROJECT_DIR/server-fastapi -type f -name "*.md" -delete
find $PROJECT_DIR -maxdepth 1 -type f -name "*.md" -delete
rm -f $PROJECT_DIR/server-fastapi/create_*.py
rm -f $PROJECT_DIR/server-fastapi/check_*.py
rm -f $PROJECT_DIR/server-fastapi/fix_*.py
rm -f $PROJECT_DIR/server-fastapi/approve_test_records.py
rm -f $PROJECT_DIR/server-fastapi/recalculate_hours.py
rm -f $PROJECT_DIR/server-fastapi/run_migration.py
rm -f $PROJECT_DIR/server-fastapi/init_db.py
rm -rf $PROJECT_DIR/server-fastapi/database/

# 6. Build Angular frontends
echo -e "${BLUE}🔨 Building Angular applications...${NC}"
FRONTENDS=("employer" "ojt-coordinator" "ojt-head" "student-trainee" "superadmin" "supervisor")

for frontend in "${FRONTENDS[@]}"; do
    echo -e "${YELLOW}Building $frontend...${NC}"
    cd $PROJECT_DIR/client/$frontend
    
    # Update API URL in environment files
    # Create production environment file
    cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com'
};
EOF
    
    npm install
    npm run build --configuration=production
    
    # Copy build to nginx directory
    sudo mkdir -p /var/www/ileap/client/$frontend
    sudo cp -r dist/* /var/www/ileap/client/$frontend/
done

# 7. Setup Python backend
echo -e "${BLUE}🐍 Setting up FastAPI backend...${NC}"
cd $BACKEND_DIR

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

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
sudo cp $PROJECT_DIR/deployment/nginx.conf $NGINX_CONFIG
sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/ileap
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 10. Setup SSL with Let's Encrypt
echo -e "${BLUE}🔒 Setting up SSL (Let's Encrypt)...${NC}"
sudo apt install -y certbot python3-certbot-nginx

# You'll need to run this for each subdomain
SUBDOMAINS=("api" "employer" "supervisor" "coordinator" "head" "student" "admin")
for subdomain in "${SUBDOMAINS[@]}"; do
    echo -e "${YELLOW}Requesting SSL for $subdomain.yourdomain.com${NC}"
    # Uncomment when DNS is configured:
    # sudo certbot --nginx -d $subdomain.yourdomain.com
done

# 11. Setup automatic SSL renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Configure DNS A records for all subdomains pointing to your EC2 IP"
echo "2. Update .env file with production credentials"
echo "3. Run SSL certificate setup: sudo certbot --nginx -d subdomain.yourdomain.com"
echo "4. Check backend status: sudo systemctl status $BACKEND_SERVICE"
echo "5. Check nginx status: sudo systemctl status nginx"
