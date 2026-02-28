#!/bin/bash

# ILEAP EC2 Initial Setup Script
# Run this script on a fresh EC2 Ubuntu instance

set -e

echo "=========================================="
echo "ILEAP EC2 Initial Setup"
echo "=========================================="
echo ""

# Update system
echo "[1/10] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js
echo "[2/10] Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python and pip
echo "[3/10] Installing Python..."
sudo apt install -y python3 python3-pip python3-venv

# Install PostgreSQL
echo "[4/10] Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Nginx
echo "[5/10] Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Git
echo "[6/10] Installing Git..."
sudo apt install -y git

# Create database
echo "[7/10] Setting up database..."
read -p "Enter database password: " DB_PASSWORD
sudo -u postgres psql << EOF
CREATE DATABASE ileap_db;
CREATE USER ileap_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE ileap_db TO ileap_user;
\q
EOF

# Clone repository
echo "[8/10] Cloning repository..."
cd /home/ubuntu
if [ ! -d "ileap-project" ]; then
    git clone https://github.com/gjustmyr/ileap-project.git
fi
cd ileap-project

# Setup backend
echo "[9/10] Setting up backend..."
cd server-fastapi
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=postgresql://ileap_user:$DB_PASSWORD@localhost/ileap_db
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=/var/www/html/uploads
EOF

# Create directory structure
echo "[10/10] Creating directory structure..."
sudo mkdir -p /var/www/html/{superadmin,ojt-head,ojt-coordinator,student,employer,supervisor,jp-head,alumni,uploads}
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
sudo chmod -R 775 /var/www/html/uploads

echo ""
echo "=========================================="
echo "Initial setup completed!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy Nginx config: sudo cp deployment/nginx-config.conf /etc/nginx/sites-available/ileap"
echo "2. Enable site: sudo ln -s /etc/nginx/sites-available/ileap /etc/nginx/sites-enabled/"
echo "3. Remove default: sudo rm /etc/nginx/sites-enabled/default"
echo "4. Test Nginx: sudo nginx -t"
echo "5. Copy backend service: sudo cp deployment/backend-service.conf /etc/systemd/system/ileap-backend.service"
echo "6. Start backend: sudo systemctl start ileap-backend && sudo systemctl enable ileap-backend"
echo "7. Run deployment: chmod +x deployment/deploy.sh && ./deployment/deploy.sh"
echo ""
