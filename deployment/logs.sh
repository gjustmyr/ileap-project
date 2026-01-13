#!/bin/bash
# View ILEAP logs

echo "ILEAP Log Viewer"
echo "=================="
echo "1) Backend API logs (live)"
echo "2) Nginx error logs (live)"
echo "3) Nginx access logs (live)"
echo "4) Backend API logs (last 100 lines)"
echo "5) All systemd errors"
read -p "Enter choice (1-5): " CHOICE

case $CHOICE in
    1)
        journalctl -u ileap-api -f
        ;;
    2)
        tail -f /var/log/nginx/ileap-api-error.log
        ;;
    3)
        tail -f /var/log/nginx/ileap-api-access.log
        ;;
    4)
        journalctl -u ileap-api -n 100 --no-pager
        ;;
    5)
        journalctl -p err -n 50 --no-pager
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
