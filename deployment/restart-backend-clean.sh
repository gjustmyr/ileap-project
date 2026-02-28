#!/bin/bash
# Clean restart of backend on EC2
# This script stops all PM2 instances, ensures directories exist, and restarts backend

echo "=== ILEAP Backend Clean Restart ==="
echo ""

# Stop all PM2 processes
echo "1. Stopping all PM2 processes..."
pm2 stop all
pm2 delete all
pm2 save --force

# Kill any process using port 3000
echo ""
echo "2. Killing any process on port 3000..."
sudo lsof -ti:3000 | xargs -r sudo kill -9 2>/dev/null || echo "No process found on port 3000"

# Ensure upload directories exist with correct permissions
echo ""
echo "3. Setting up upload directories..."
sudo mkdir -p /var/www/html/uploads/{profile_pictures,requirements,resumes,moa,logos,requirement_templates,documents,accomplishments}
sudo chown -R ec2-user:nginx /var/www/html/uploads
sudo chmod -R 775 /var/www/html/uploads

# Verify directories
echo ""
echo "4. Verifying upload directories..."
ls -la /var/www/html/uploads/

# Navigate to backend directory
cd /home/ec2-user/ileap-project/server-fastapi || exit 1

# Activate virtual environment
echo ""
echo "5. Activating virtual environment..."
source venv/bin/activate

# Start backend with PM2
echo ""
echo "6. Starting backend with PM2..."
pm2 start "uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4" --name ileap-backend

# Save PM2 configuration
pm2 save

# Show status
echo ""
echo "7. PM2 Status:"
pm2 status

# Wait a moment for startup
sleep 3

# Test backend
echo ""
echo "8. Testing backend..."
curl -s http://localhost:3000/ | head -20

echo ""
echo "9. Testing API docs endpoint..."
curl -s http://localhost:3000/docs | head -20

echo ""
echo "=== Backend restart complete ==="
echo ""
echo "To view logs: pm2 logs ileap-backend"
echo "To check status: pm2 status"
echo "API docs: http://47.128.70.19:3000/docs"
