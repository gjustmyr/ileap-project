#!/bin/bash
# Upload the corrected config.py to EC2 server

echo "Uploading fixed config.py to EC2..."

# Upload the local config.py to EC2
scp -i deployment/ileap-keykey.pem server-fastapi/config.py ec2-user@47.128.70.19:/home/ec2-user/ileap-project/server-fastapi/config.py

if [ $? -eq 0 ]; then
    echo "✓ config.py uploaded successfully"
    echo ""
    echo "Now SSH into EC2 and restart the backend:"
    echo "  ssh -i deployment/ileap-keykey.pem ec2-user@47.128.70.19"
    echo "  cd /home/ec2-user/ileap-project/server-fastapi"
    echo "  source venv/bin/activate"
    echo "  pm2 delete all"
    echo "  pm2 start \"uvicorn main:app --host 0.0.0.0 --port 3000\" --name ileap-backend"
    echo "  pm2 save"
    echo "  pm2 logs ileap-backend"
else
    echo "✗ Failed to upload config.py"
    exit 1
fi
