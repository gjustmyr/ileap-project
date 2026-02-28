#!/bin/bash
# Quick fix for EC2 backend - Run this from your local machine

set -e

echo "=== ILEAP Backend Quick Fix ==="
echo ""

# Step 1: Upload fixed config.py
echo "Step 1: Uploading fixed config.py..."
scp -i deployment/ileap-keykey.pem server-fastapi/config.py ec2-user@47.128.70.19:/home/ec2-user/ileap-project/server-fastapi/config.py
echo "✓ config.py uploaded"
echo ""

# Step 2: Upload production .env
echo "Step 2: Uploading production .env..."
scp -i deployment/ileap-keykey.pem server-fastapi/.env.production ec2-user@47.128.70.19:/home/ec2-user/ileap-project/server-fastapi/.env
echo "✓ .env uploaded"
echo ""

# Step 3: SSH and restart backend
echo "Step 3: Restarting backend on EC2..."
ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19 << 'ENDSSH'
cd /home/ec2-user/ileap-project/server-fastapi
source venv/bin/activate

# Stop all PM2 processes
pm2 delete all 2>/dev/null || true
pm2 save --force

# Fix permissions
sudo chown -R ec2-user:nginx /var/www/html/uploads 2>/dev/null || true
sudo chmod -R 775 /var/www/html/uploads 2>/dev/null || true

# Verify Python syntax
python -m py_compile config.py
if [ $? -eq 0 ]; then
    echo "✓ config.py syntax is valid"
else
    echo "✗ config.py has syntax errors"
    exit 1
fi

# Start backend (single instance, no workers)
pm2 start "uvicorn main:app --host 0.0.0.0 --port 3000" --name ileap-backend
pm2 save

# Wait a moment for startup
sleep 3

# Show status
echo ""
echo "=== PM2 Status ==="
pm2 status

echo ""
echo "=== Recent Logs ==="
pm2 logs ileap-backend --lines 20 --nostream

echo ""
echo "=== Backend Status ==="
curl -s http://54.251.87.169:3000/api/health || echo "Health check endpoint not available"

ENDSSH

echo ""
echo "=== Fix Complete ==="
echo ""
echo "Backend should now be running on http://47.128.70.19:3000"
echo ""
echo "To view logs: ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19 'pm2 logs ileap-backend'"
echo "To check status: ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19 'pm2 status'"
