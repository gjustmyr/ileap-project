#!/bin/bash

# ILEAP Direct Deployment (Upload files via SCP)
# This uploads your local project to EC2 and deploys it

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_header() { echo -e "${BLUE}========================================${NC}"; echo -e "${BLUE}$1${NC}"; echo -e "${BLUE}========================================${NC}"; }

# Configuration
PEM_FILE="deployment/ileap-keykey.pem"
EC2_HOST="47.128.70.19"
EC2_USER="ec2-user"
DB_URL="postgresql://ileap_research:jDK7ScQmpZl0NTAiPQtnUz697laHcWYM@dpg-d6ft0nrh46gs738jsa2g-a.oregon-postgres.render.com/ileap_db_production"

chmod 400 "$PEM_FILE"

# Function to run remote commands
run_remote() {
    ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "$@"
}

print_header "ILEAP Direct Deployment"

# Step 1: Upload project files
print_header "Step 1: Uploading Project Files"
print_warning "This may take a few minutes..."

# Create temp archive excluding node_modules and other large files
print_status "Creating project archive..."
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='.angular' \
    --exclude='*.pem' \
    --exclude='venv' \
    -czf /tmp/ileap-project.tar.gz \
    client/ server-fastapi/

# Upload to EC2
print_status "Uploading to EC2..."
scp -i "$PEM_FILE" -o StrictHostKeyChecking=no /tmp/ileap-project.tar.gz "$EC2_USER@$EC2_HOST:/tmp/"

# Extract on EC2
print_status "Extracting files on EC2..."
run_remote "cd /home/$EC2_USER && rm -rf ileap-project && mkdir -p ileap-project && cd ileap-project && tar -xzf /tmp/ileap-project.tar.gz && rm /tmp/ileap-project.tar.gz"

# Clean up local temp file
rm /tmp/ileap-project.tar.gz

# Step 2: Install dependencies
print_header "Step 2: Installing System Dependencies"
run_remote "sudo yum install -y python3.11 python3.11-pip nginx git"
run_remote "sudo systemctl start nginx && sudo systemctl enable nginx"

# Install Node.js if not present
if ! run_remote "node --version | grep -q 'v20'"; then
    print_status "Installing Node.js 20..."
    run_remote "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum remove -y nodejs nodejs-full-i18n && sudo yum install -y nodejs --allowerasing"
fi

# Step 3: Setup backend
print_header "Step 3: Setting Up Backend"
run_remote "cd /home/$EC2_USER/ileap-project/server-fastapi && python3.11 -m venv venv"
run_remote "cd /home/$EC2_USER/ileap-project/server-fastapi && source venv/bin/activate && pip install -r requirements.txt"

# Generate secret key
SECRET_KEY=$(openssl rand -hex 32)

# Create .env file
print_status "Creating backend configuration..."
run_remote "cat > /home/$EC2_USER/ileap-project/server-fastapi/.env << 'EOF'
DATABASE_URL=$DB_URL
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=/var/www/html/uploads
EOF"

# Test database connection
print_status "Testing database connection..."
if run_remote "cd /home/$EC2_USER/ileap-project/server-fastapi && source venv/bin/activate && python3 -c 'from sqlalchemy import create_engine; engine = create_engine(\"$DB_URL\"); conn = engine.connect(); print(\"OK\")' 2>/dev/null"; then
    print_status "✓ Database connection successful"
else
    print_error "✗ Database connection failed"
    exit 1
fi

# Step 4: Create directories
print_header "Step 4: Creating Directory Structure"
run_remote "sudo mkdir -p /var/www/html/{superadmin,ojt-head,ojt-coordinator,student,employer,supervisor,jp-head,alumni,uploads}"
run_remote "sudo chown -R nginx:nginx /var/www/html"
run_remote "sudo chmod -R 755 /var/www/html"
run_remote "sudo chmod -R 775 /var/www/html/uploads"

# Step 5: Configure Nginx
print_header "Step 5: Configuring Nginx"
run_remote "sudo bash -c 'cat > /etc/nginx/conf.d/ileap.conf << \"NGINXEOF\"
upstream fastapi_backend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name _;
    root /var/www/html;
    client_max_body_size 100M;
    
    location /api {
        proxy_pass http://fastapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
    }
    
    location /uploads {
        alias /var/www/html/uploads;
        expires 30d;
    }
    
    location /superadmin { alias /var/www/html/superadmin; try_files \\\$uri \\\$uri/ /superadmin/index.html; }
    location /ojt-head { alias /var/www/html/ojt-head; try_files \\\$uri \\\$uri/ /ojt-head/index.html; }
    location /ojt-coordinator { alias /var/www/html/ojt-coordinator; try_files \\\$uri \\\$uri/ /ojt-coordinator/index.html; }
    location /student { alias /var/www/html/student; try_files \\\$uri \\\$uri/ /student/index.html; }
    location /employer { alias /var/www/html/employer; try_files \\\$uri \\\$uri/ /employer/index.html; }
    location /supervisor { alias /var/www/html/supervisor; try_files \\\$uri \\\$uri/ /supervisor/index.html; }
    location /jp-head { alias /var/www/html/jp-head; try_files \\\$uri \\\$uri/ /jp-head/index.html; }
    location /alumni { alias /var/www/html/alumni; try_files \\\$uri \\\$uri/ /alumni/index.html; }
    
    location = / { return 302 /superadmin; }
}
NGINXEOF'"

run_remote "sudo nginx -t && sudo systemctl reload nginx"

# Step 6: Setup backend service
print_header "Step 6: Setting Up Backend Service"
run_remote "sudo bash -c 'cat > /etc/systemd/system/ileap-backend.service << \"EOF\"
[Unit]
Description=ILEAP FastAPI Backend
After=network.target

[Service]
Type=simple
User=$EC2_USER
Group=$EC2_USER
WorkingDirectory=/home/$EC2_USER/ileap-project/server-fastapi
Environment=\"PATH=/home/$EC2_USER/ileap-project/server-fastapi/venv/bin\"
ExecStart=/home/$EC2_USER/ileap-project/server-fastapi/venv/bin/uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF'"

run_remote "sudo systemctl daemon-reload && sudo systemctl start ileap-backend && sudo systemctl enable ileap-backend"
sleep 5

if run_remote "sudo systemctl is-active --quiet ileap-backend"; then
    print_status "✓ Backend service started"
else
    print_error "✗ Backend failed to start"
    run_remote "sudo journalctl -u ileap-backend -n 20"
    exit 1
fi

# Step 7: Build and deploy portals
print_header "Step 7: Building and Deploying Portals"
print_warning "This will take 10-15 minutes..."

PORTALS=("superadmin" "ojt-head" "ojt-coordinator" "student" "employer" "supervisor" "job-placement-head" "alumni")
BASE_HREFS=("/superadmin/" "/ojt-head/" "/ojt-coordinator/" "/student/" "/employer/" "/supervisor/" "/jp-head/" "/alumni/")
DESTS=("superadmin" "ojt-head" "ojt-coordinator" "student" "employer" "supervisor" "jp-head" "alumni")

for i in "${!PORTALS[@]}"; do
    portal="${PORTALS[$i]}"
    base_href="${BASE_HREFS[$i]}"
    dest="${DESTS[$i]}"
    
    print_status "Building $portal..."
    run_remote "cd /home/$EC2_USER/ileap-project/client/$portal && npm install --silent && npm run build -- --configuration production --base-href=$base_href"
    
    print_status "Deploying $portal..."
    run_remote "sudo rm -rf /var/www/html/$dest/* && sudo mkdir -p /var/www/html/$dest"
    run_remote "cd /home/$EC2_USER/ileap-project/client/$portal && (sudo cp -r dist/$portal/browser/* /var/www/html/$dest/ 2>/dev/null || sudo cp -r dist/$portal/* /var/www/html/$dest/)"
done

# Step 8: Fix permissions
print_header "Step 8: Setting Permissions"
run_remote "sudo chown -R nginx:nginx /var/www/html && sudo chmod -R 755 /var/www/html && sudo chmod -R 775 /var/www/html/uploads"

# Final verification
print_header "Deployment Complete!"
echo ""
print_status "Your ILEAP system is deployed!"
echo ""
echo "Portal URLs:"
echo "  - Superadmin:      http://$EC2_HOST/superadmin"
echo "  - OJT Head:        http://$EC2_HOST/ojt-head"
echo "  - OJT Coordinator: http://$EC2_HOST/ojt-coordinator"
echo "  - Student:         http://$EC2_HOST/student"
echo "  - Employer:        http://$EC2_HOST/employer"
echo "  - Supervisor:      http://$EC2_HOST/supervisor"
echo "  - Job Placement:   http://$EC2_HOST/jp-head"
echo "  - Alumni:          http://$EC2_HOST/alumni"
echo "  - API Docs:        http://$EC2_HOST/api/docs"
echo ""
