#!/bin/bash
# Setup Nginx on EC2 to serve all 8 portals

echo "=== Setting up Nginx on EC2 ==="
echo ""

ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19 << 'ENDSSH'

# Install Nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo dnf install -y nginx
    echo "✓ Nginx installed"
else
    echo "✓ Nginx already installed"
fi

# Create Nginx configuration
echo "Creating Nginx configuration..."
sudo tee /etc/nginx/conf.d/ileap.conf > /dev/null << 'NGINXCONF'
# ILEAP Multi-Portal Configuration

# Backend API proxy
upstream backend {
    server 127.0.0.1:3000;
}

# Main server block
server {
    listen 80;
    server_name 47.128.70.19;
    
    # Increase buffer sizes for large requests
    client_max_body_size 50M;
    client_body_buffer_size 128k;
    
    # Root directory for static files
    root /var/www/html;
    
    # Logging
    access_log /var/log/nginx/ileap-access.log;
    error_log /var/log/nginx/ileap-error.log;
    
    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # Upload files
    location /uploads/ {
        alias /var/www/html/uploads/;
        autoindex off;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Superadmin Portal
    location /superadmin {
        alias /var/www/html/superadmin;
        try_files $uri $uri/ /superadmin/index.html;
        index index.html;
    }
    
    # OJT Head Portal
    location /ojt-head {
        alias /var/www/html/ojt-head;
        try_files $uri $uri/ /ojt-head/index.html;
        index index.html;
    }
    
    # OJT Coordinator Portal
    location /ojt-coordinator {
        alias /var/www/html/ojt-coordinator;
        try_files $uri $uri/ /ojt-coordinator/index.html;
        index index.html;
    }
    
    # Student Portal
    location /student {
        alias /var/www/html/student;
        try_files $uri $uri/ /student/index.html;
        index index.html;
    }
    
    # Employer Portal
    location /employer {
        alias /var/www/html/employer;
        try_files $uri $uri/ /employer/index.html;
        index index.html;
    }
    
    # Supervisor Portal
    location /supervisor {
        alias /var/www/html/supervisor;
        try_files $uri $uri/ /supervisor/index.html;
        index index.html;
    }
    
    # Job Placement Head Portal
    location /job-placement-head {
        alias /var/www/html/job-placement-head;
        try_files $uri $uri/ /job-placement-head/index.html;
        index index.html;
    }
    
    # Alumni Portal
    location /alumni {
        alias /var/www/html/alumni;
        try_files $uri $uri/ /alumni/index.html;
        index index.html;
    }
    
    # Default landing page
    location = / {
        return 200 '<!DOCTYPE html>
<html>
<head>
    <title>ILEAP Portal</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .portal-list { list-style: none; padding: 0; }
        .portal-list li { margin: 10px 0; }
        .portal-list a { display: block; padding: 15px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
        .portal-list a:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>ILEAP Portal System</h1>
    <p>Select your portal:</p>
    <ul class="portal-list">
        <li><a href="/superadmin">Superadmin Portal</a></li>
        <li><a href="/ojt-head">OJT Head Portal</a></li>
        <li><a href="/ojt-coordinator">OJT Coordinator Portal</a></li>
        <li><a href="/student">Student Portal</a></li>
        <li><a href="/employer">Employer Portal</a></li>
        <li><a href="/supervisor">Supervisor Portal</a></li>
        <li><a href="/job-placement-head">Job Placement Head Portal</a></li>
        <li><a href="/alumni">Alumni Portal</a></li>
    </ul>
</body>
</html>';
        add_header Content-Type text/html;
    }
}
NGINXCONF

echo "✓ Nginx configuration created"

# Test Nginx configuration
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✓ Nginx configuration is valid"
    
    # Enable and start Nginx
    echo "Starting Nginx..."
    sudo systemctl enable nginx
    sudo systemctl restart nginx
    
    if [ $? -eq 0 ]; then
        echo "✓ Nginx started successfully"
    else
        echo "✗ Failed to start Nginx"
        sudo systemctl status nginx
        exit 1
    fi
else
    echo "✗ Nginx configuration has errors"
    exit 1
fi

# Check Nginx status
echo ""
echo "=== Nginx Status ==="
sudo systemctl status nginx --no-pager

# Show listening ports
echo ""
echo "=== Listening Ports ==="
sudo netstat -tlnp | grep -E ':(80|3000)'

# Set proper permissions for web directory
echo ""
echo "Setting permissions..."
sudo chown -R nginx:nginx /var/www/html
sudo chmod -R 755 /var/www/html
sudo chmod -R 775 /var/www/html/uploads
echo "✓ Permissions set"

ENDSSH

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Your portals should now be accessible at:"
echo "  http://47.128.70.19/              (Landing page)"
echo "  http://47.128.70.19/superadmin"
echo "  http://47.128.70.19/ojt-head"
echo "  http://47.128.70.19/ojt-coordinator"
echo "  http://47.128.70.19/student"
echo "  http://47.128.70.19/employer"
echo "  http://47.128.70.19/supervisor"
echo "  http://47.128.70.19/job-placement-head"
echo "  http://47.128.70.19/alumni"
echo ""
echo "Backend API: http://47.128.70.19/api/"
