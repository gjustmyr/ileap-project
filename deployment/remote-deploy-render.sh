#!/bin/bash

# ILEAP Remote Deployment Script (with Render.com Database)
# This script deploys the entire ILEAP system to EC2 from your local machine
# Database hosted on Render.com

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
PEM_FILE=""
EC2_HOST=""
EC2_USER="ec2-user"
DB_URL=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --pem)
            PEM_FILE="$2"
            shift 2
            ;;
        --host)
            EC2_HOST="$2"
            shift 2
            ;;
        --user)
            EC2_USER="$2"
            shift 2
            ;;
        --db-url)
            DB_URL="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./remote-deploy-render.sh --pem <pem-file> --host <ec2-host> --db-url <database-url>"
            echo ""
            echo "Required:"
            echo "  --pem <file>       Path to PEM key file"
            echo "  --host <host>      EC2 host (IP or domain)"
            echo "  --db-url <url>     Render.com PostgreSQL connection URL"
            echo ""
            echo "Optional:"
            echo "  --user <user>      SSH user (default: ec2-user)"
            echo ""
            echo "Example:"
            echo "  ./remote-deploy-render.sh --pem ~/keys/my-key.pem --host 54.123.45.67 \\"
            echo "    --db-url 'postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname'"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Validate required arguments
if [ -z "$PEM_FILE" ] || [ -z "$EC2_HOST" ] || [ -z "$DB_URL" ]; then
    print_error "Missing required arguments"
    echo "Use --help for usage information"
    exit 1
fi

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
    print_error "PEM file not found: $PEM_FILE"
    exit 1
fi

# Set correct permissions for PEM file
chmod 400 "$PEM_FILE"

# Test SSH connection
print_header "Testing SSH Connection"
if ! ssh -i "$PEM_FILE" -o ConnectTimeout=10 -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "echo 'Connection successful'" > /dev/null 2>&1; then
    print_error "Cannot connect to EC2 instance"
    print_error "Please check your PEM file and host address"
    exit 1
fi
print_status "SSH connection successful"

# Function to run remote commands
run_remote() {
    ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "$@"
}

print_header "Starting ILEAP Deployment"

# Step 1: Update system and install dependencies
print_header "Step 1: Installing System Dependencies"
run_remote "sudo yum update -y"

print_status "Installing Node.js..."
run_remote "curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs"

print_status "Installing Python..."
run_remote "sudo yum install -y python3.11 python3.11-pip"

print_status "Installing Nginx..."
run_remote "sudo yum install -y nginx"
run_remote "sudo systemctl start nginx && sudo systemctl enable nginx"

print_status "Installing Git..."
run_remote "sudo yum install -y git"

# Step 2: Clone repository
print_header "Step 2: Cloning Repository"
print_status "Checking if repository already exists..."
if run_remote "[ -d /home/$EC2_USER/ileap-project ]"; then
    print_status "Repository exists, pulling latest changes..."
    run_remote "cd /home/$EC2_USER/ileap-project && git pull origin main || true"
else
    print_status "Cloning repository (public access)..."
    run_remote "cd /home/$EC2_USER && git clone https://github.com/gjustmyr/ileap-project.git"
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
print_status "Testing database connection to Render.com..."
if run_remote "cd /home/$EC2_USER/ileap-project/server-fastapi && source venv/bin/activate && python3 -c 'from sqlalchemy import create_engine; engine = create_engine(\"$DB_URL\"); conn = engine.connect(); print(\"Connection successful\")' 2>/dev/null"; then
    print_status "✓ Database connection successful"
else
    print_error "✗ Database connection failed"
    print_error "Please check your Render.com database URL"
    print_error "Make sure the database is accessible from your EC2 IP"
    exit 1
fi

# Step 4: Create directory structure
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
    
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    location /api {
        proxy_pass http://fastapi_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \"upgrade\";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }
    
    location /uploads {
        alias /var/www/html/uploads;
        autoindex off;
        expires 30d;
        add_header Cache-Control \"public, immutable\";
    }
    
    location /superadmin {
        alias /var/www/html/superadmin;
        try_files \$uri \$uri/ /superadmin/index.html;
        expires 1h;
    }
    
    location /ojt-head {
        alias /var/www/html/ojt-head;
        try_files \$uri \$uri/ /ojt-head/index.html;
        expires 1h;
    }
    
    location /ojt-coordinator {
        alias /var/www/html/ojt-coordinator;
        try_files \$uri \$uri/ /ojt-coordinator/index.html;
        expires 1h;
    }
    
    location /student {
        alias /var/www/html/student;
        try_files \$uri \$uri/ /student/index.html;
        expires 1h;
    }
    
    location /employer {
        alias /var/www/html/employer;
        try_files \$uri \$uri/ /employer/index.html;
        expires 1h;
    }
    
    location /supervisor {
        alias /var/www/html/supervisor;
        try_files \$uri \$uri/ /supervisor/index.html;
        expires 1h;
    }
    
    location /jp-head {
        alias /var/www/html/jp-head;
        try_files \$uri \$uri/ /jp-head/index.html;
        expires 1h;
    }
    
    location /alumni {
        alias /var/www/html/alumni;
        try_files \$uri \$uri/ /alumni/index.html;
        expires 1h;
    }
    
    location = / {
        return 302 /superadmin;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)\$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
NGINXEOF'"

run_remote "sudo nginx -t && sudo systemctl reload nginx"

# Step 6: Setup backend service
print_header "Step 6: Setting Up Backend Service"
run_remote "sudo bash -c 'cat > /etc/systemd/system/ileap-backend.service << \"SERVICEEOF\"
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
SERVICEEOF'"

run_remote "sudo systemctl daemon-reload"
run_remote "sudo systemctl start ileap-backend"
run_remote "sudo systemctl enable ileap-backend"

# Wait for backend to start
sleep 5

# Check if backend is running
if run_remote "sudo systemctl is-active --quiet ileap-backend"; then
    print_status "✓ Backend service started successfully"
else
    print_error "✗ Backend service failed to start"
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
    
    print_status "Building $portal portal..."
    run_remote "cd /home/$EC2_USER/ileap-project/client/$portal && npm install --silent"
    run_remote "cd /home/$EC2_USER/ileap-project/client/$portal && npm run build -- --configuration production --base-href=$base_href"
    
    print_status "Deploying $portal..."
    run_remote "sudo rm -rf /var/www/html/$dest/*"
    run_remote "sudo mkdir -p /var/www/html/$dest"
    run_remote "cd /home/$EC2_USER/ileap-project/client/$portal && (sudo cp -r dist/$portal/browser/* /var/www/html/$dest/ 2>/dev/null || sudo cp -r dist/$portal/* /var/www/html/$dest/)"
done

# Step 8: Fix permissions
print_header "Step 8: Setting Permissions"
run_remote "sudo chown -R nginx:nginx /var/www/html"
run_remote "sudo chmod -R 755 /var/www/html"
run_remote "sudo chmod -R 775 /var/www/html/uploads"

# Step 9: Configure firewall
print_header "Step 9: Configuring Firewall"
run_remote "sudo systemctl status firewalld > /dev/null 2>&1 && (sudo firewall-cmd --permanent --add-service=http && sudo firewall-cmd --permanent --add-service=https && sudo firewall-cmd --reload) || true"

# Step 10: Verify deployment
print_header "Step 10: Verifying Deployment"
print_status "Checking services..."

if run_remote "sudo systemctl is-active --quiet nginx"; then
    print_status "✓ Nginx is running"
else
    print_error "✗ Nginx is not running"
fi

if run_remote "sudo systemctl is-active --quiet ileap-backend"; then
    print_status "✓ Backend is running"
else
    print_error "✗ Backend is not running"
fi

# Final summary
print_header "Deployment Complete!"
echo ""
print_status "Your ILEAP system is now deployed!"
echo ""
echo "Portal URLs:"
echo "  - Superadmin:        http://$EC2_HOST/superadmin"
echo "  - OJT Head:          http://$EC2_HOST/ojt-head"
echo "  - OJT Coordinator:   http://$EC2_HOST/ojt-coordinator"
echo "  - Student:           http://$EC2_HOST/student"
echo "  - Employer:          http://$EC2_HOST/employer"
echo "  - Supervisor:        http://$EC2_HOST/supervisor"
echo "  - Job Placement:     http://$EC2_HOST/jp-head"
echo "  - Alumni:            http://$EC2_HOST/alumni"
echo "  - API Docs:          http://$EC2_HOST/api/docs"
echo ""
print_status "Database: Render.com (external)"
print_status "Backend: EC2 (FastAPI on port 3000)"
print_status "Frontend: EC2 (Nginx serving static files)"
echo ""
print_status "To check logs:"
echo "  ssh -i $PEM_FILE $EC2_USER@$EC2_HOST 'sudo journalctl -u ileap-backend -f'"
echo ""
print_status "To update deployment:"
echo "  ./deployment/remote-update.sh --pem $PEM_FILE --host $EC2_HOST"
echo ""
