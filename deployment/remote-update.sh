#!/bin/bash

# ILEAP Remote Update Script
# Updates an existing deployment with latest code

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
        --help)
            echo "Usage: ./remote-update.sh --pem <pem-file> --host <ec2-host> [options]"
            echo ""
            echo "Required:"
            echo "  --pem <file>     Path to PEM key file"
            echo "  --host <host>    EC2 host (IP or domain)"
            echo ""
            echo "Optional:"
            echo "  --user <user>    SSH user (default: ec2-user)"
            echo ""
            echo "Example:"
            echo "  ./remote-update.sh --pem ~/keys/my-key.pem --host 54.123.45.67"
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
if [ -z "$PEM_FILE" ] || [ -z "$EC2_HOST" ]; then
    print_error "Missing required arguments"
    echo "Use --help for usage information"
    exit 1
fi

# Check if PEM file exists
if [ ! -f "$PEM_FILE" ]; then
    print_error "PEM file not found: $PEM_FILE"
    exit 1
fi

chmod 400 "$PEM_FILE"

# Function to run remote commands
run_remote() {
    ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "$@"
}

print_header "ILEAP Update Deployment"

# Pull latest code
print_status "Pulling latest code from GitHub..."
run_remote "cd /home/$EC2_USER/ileap-project && git pull origin main"

# Update backend
print_header "Updating Backend"
run_remote "cd /home/$EC2_USER/ileap-project/server-fastapi && source venv/bin/activate && pip install -r requirements.txt --quiet"
run_remote "sudo systemctl restart ileap-backend"
sleep 3

# Build and deploy portals
print_header "Rebuilding Portals"
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

# Fix permissions
print_status "Setting permissions..."
run_remote "sudo chown -R nginx:nginx /var/www/html && sudo chmod -R 755 /var/www/html && sudo chmod -R 775 /var/www/html/uploads"

# Reload Nginx
print_status "Reloading Nginx..."
run_remote "sudo nginx -t && sudo systemctl reload nginx"

# Verify
print_header "Verifying Services"
if run_remote "sudo systemctl is-active --quiet ileap-backend"; then
    print_status "✓ Backend is running"
else
    print_error "✗ Backend is not running"
    run_remote "sudo journalctl -u ileap-backend -n 20"
fi

if run_remote "sudo systemctl is-active --quiet nginx"; then
    print_status "✓ Nginx is running"
else
    print_error "✗ Nginx is not running"
fi

print_header "Update Complete!"
echo ""
print_status "All portals have been updated with the latest code"
echo "  URL: http://$EC2_HOST"
echo ""
