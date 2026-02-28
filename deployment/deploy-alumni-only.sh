#!/bin/bash
# Deploy Alumni Portal Only

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying Alumni Portal${NC}"
echo ""

# Check if dist-prod/alumni exists
if [ ! -d "dist-prod/alumni" ]; then
    echo -e "${RED}Error: dist-prod/alumni not found${NC}"
    echo "Please build the alumni portal first:"
    echo "  cd client/alumni && npm run build -- --configuration production --base-href=/alumni/"
    exit 1
fi

# Backup existing alumni portal
echo -e "${BLUE}📦 Backing up existing alumni portal...${NC}"
if [ -d "/var/www/html/alumni" ]; then
    sudo cp -r /var/www/html/alumni /var/www/html/alumni.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backup created${NC}"
fi

# Deploy new alumni portal
echo -e "${BLUE}🚀 Deploying new alumni portal...${NC}"
sudo rm -rf /var/www/html/alumni
sudo cp -r dist-prod/alumni /var/www/html/

# Fix permissions
echo -e "${BLUE}🔧 Fixing permissions...${NC}"
sudo chown -R nginx:nginx /var/www/html/alumni
sudo chmod -R 755 /var/www/html/alumni

# Verify deployment
if [ -f "/var/www/html/alumni/index.html" ]; then
    echo -e "${GREEN}✓ Alumni portal deployed successfully${NC}"
    echo ""
    echo -e "${BLUE}Alumni Portal is now available at:${NC}"
    echo -e "  http://54.251.87.169/alumni"
    echo ""
else
    echo -e "${RED}✗ Deployment verification failed${NC}"
    exit 1
fi
