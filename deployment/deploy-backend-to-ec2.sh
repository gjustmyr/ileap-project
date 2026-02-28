#!/bin/bash
# Deploy backend to EC2 from local machine
# Run this from your local machine in the project root

set -e

EC2_IP="47.128.70.19"
EC2_USER="ec2-user"
PEM_FILE="deployment/ileap-keykey.pem"
PROJECT_DIR="/home/ec2-user/ileap-project"

echo "=== ILEAP Backend Deployment to EC2 ==="
echo ""

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
    echo "ERROR: PEM file not found at $PEM_FILE"
    exit 1
fi

# Set correct permissions on PEM file
chmod 400 "$PEM_FILE"

echo "1. Uploading updated backend files..."
scp -i "$PEM_FILE" server-fastapi/config.py "$EC2_USER@$EC2_IP:$PROJECT_DIR/server-fastapi/"
scp -i "$PEM_FILE" server-fastapi/.env "$EC2_USER@$EC2_IP:$PROJECT_DIR/server-fastapi/"

echo ""
echo "2. Uploading restart script..."
scp -i "$PEM_FILE" deployment/restart-backend-clean.sh "$EC2_USER@$EC2_IP:/home/ec2-user/"

echo ""
echo "3. Running restart script on EC2..."
ssh -i "$PEM_FILE" "$EC2_USER@$EC2_IP" << 'ENDSSH'
    chmod +x ~/restart-backend-clean.sh
    ./restart-backend-clean.sh
ENDSSH

echo ""
echo "4. Testing backend from outside..."
sleep 2
curl -s "http://$EC2_IP:3000/" | head -20

echo ""
echo "=== Backend deployment complete ==="
echo ""
echo "Backend API: http://$EC2_IP:3000"
echo "API Docs: http://$EC2_IP:3000/docs"
echo ""
echo "To view logs: ssh -i $PEM_FILE $EC2_USER@$EC2_IP 'pm2 logs ileap-backend'"
