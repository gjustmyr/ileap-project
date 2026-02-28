#!/bin/bash

# ILEAP Remote Logs Viewer
# View logs from remote EC2 instance

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[INFO]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
PEM_FILE=""
EC2_HOST=""
EC2_USER="ec2-user"
LOG_TYPE="backend"

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
        --type)
            LOG_TYPE="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./remote-logs.sh --pem <pem-file> --host <ec2-host> [options]"
            echo ""
            echo "Required:"
            echo "  --pem <file>     Path to PEM key file"
            echo "  --host <host>    EC2 host (IP or domain)"
            echo ""
            echo "Optional:"
            echo "  --user <user>    SSH user (default: ec2-user)"
            echo "  --type <type>    Log type: backend, nginx-error, nginx-access, all (default: backend)"
            echo ""
            echo "Example:"
            echo "  ./remote-logs.sh --pem ~/keys/my-key.pem --host 54.123.45.67 --type backend"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Validate
if [ -z "$PEM_FILE" ] || [ -z "$EC2_HOST" ]; then
    print_error "Missing required arguments. Use --help for usage information"
    exit 1
fi

if [ ! -f "$PEM_FILE" ]; then
    print_error "PEM file not found: $PEM_FILE"
    exit 1
fi

chmod 400 "$PEM_FILE"

print_status "Connecting to $EC2_HOST..."

case $LOG_TYPE in
    backend)
        print_status "Showing backend logs (Ctrl+C to exit)..."
        ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo journalctl -u ileap-backend -f"
        ;;
    nginx-error)
        print_status "Showing Nginx error logs (Ctrl+C to exit)..."
        ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo tail -f /var/log/nginx/error.log"
        ;;
    nginx-access)
        print_status "Showing Nginx access logs (Ctrl+C to exit)..."
        ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo tail -f /var/log/nginx/access.log"
        ;;
    all)
        print_status "Showing all logs (Ctrl+C to exit)..."
        ssh -i "$PEM_FILE" -o StrictHostKeyChecking=no "$EC2_USER@$EC2_HOST" "sudo journalctl -u ileap-backend -f & sudo tail -f /var/log/nginx/error.log"
        ;;
    *)
        print_error "Unknown log type: $LOG_TYPE"
        echo "Valid types: backend, nginx-error, nginx-access, all"
        exit 1
        ;;
esac
