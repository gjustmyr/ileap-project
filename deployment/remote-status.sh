#!/bin/bash

# ILEAP Remote Status Checker
# Check status of all services on EC2

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }

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
            echo "Usage: ./remote-status.sh --pem <pem-file> --host <ec2-host>"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$PEM_FILE" ] || [ -z "$EC2_HOST" ]; then
    echo "Missing required arguments. Use --help for usage information"
    exit 1
fi

if [ ! -f "$PEM_FILE" ]; then
    echo "PEM file not found: $PEM_FILE"
    exit 1
fi

chmod 400 "$PEM_FILE"

run_remote() {
    ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "$@" 2>/dev/null
}

echo ""
echo "=========================================="
echo "ILEAP System Status"
echo "=========================================="
echo ""

# Check services
echo "Services:"
if run_remote "sudo systemctl is-active --quiet nginx"; then
    print_status "Nginx is running"
else
    print_error "Nginx is not running"
fi

if run_remote "sudo systemctl is-active --quiet ileap-backend"; then
    print_status "Backend is running"
else
    print_error "Backend is not running"
fi

if run_remote "sudo systemctl is-active --quiet postgresql"; then
    print_status "PostgreSQL is running"
else
    print_error "PostgreSQL is not running"
fi

echo ""
echo "System Info:"
run_remote "echo '  CPU Usage: ' && top -bn1 | grep 'Cpu(s)' | sed 's/.*, *\([0-9.]*\)%* id.*/\1/' | awk '{print 100 - \$1\"%\"}'"
run_remote "echo '  Memory: ' && free -h | awk '/^Mem:/ {print \$3 \" / \" \$2}'"
run_remote "echo '  Disk: ' && df -h / | awk 'NR==2 {print \$3 \" / \" \$2 \" (\" \$5 \" used)\"}'"

echo ""
echo "Portal Files:"
PORTALS=("superadmin" "ojt-head" "ojt-coordinator" "student" "employer" "supervisor" "jp-head" "alumni")
for portal in "${PORTALS[@]}"; do
    if run_remote "[ -f /var/www/html/$portal/index.html ]"; then
        print_status "$portal deployed"
    else
        print_error "$portal not found"
    fi
done

echo ""
echo "Recent Backend Logs:"
run_remote "sudo journalctl -u ileap-backend -n 5 --no-pager"

echo ""
echo "=========================================="
echo ""
