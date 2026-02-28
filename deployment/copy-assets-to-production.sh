#!/bin/bash
# Copy assets to all deployed portals on production

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📦 Copying assets to all portals${NC}"
echo ""

# Source assets directory (from any portal, they all have the same assets)
SOURCE_ASSETS="client/job-placement-head/public/assets"

if [ ! -d "$SOURCE_ASSETS" ]; then
    echo -e "${RED}Error: Source assets not found at $SOURCE_ASSETS${NC}"
    exit 1
fi

# Array of all portals
PORTALS=(
    "alumni"
    "employer"
    "job-placement-head"
    "ojt-coordinator"
    "ojt-head"
    "student"
    "superadmin"
    "supervisor"
)

# Copy to each portal
for PORTAL in "${PORTALS[@]}"; do
    DEST="/var/www/html/$PORTAL/assets"
    
    echo -e "${BLUE}📋 Copying assets to $PORTAL...${NC}"
    
    # Create assets directory if it doesn't exist
    sudo mkdir -p "$DEST"
    
    # Copy assets
    sudo cp -r "$SOURCE_ASSETS"/* "$DEST/"
    
    # Fix permissions
    sudo chown -R nginx:nginx "$DEST"
    sudo chmod -R 755 "$DEST"
    
    echo -e "${GREEN}✓ Assets copied to $PORTAL${NC}"
done

echo ""
echo -e "${GREEN}🎉 Assets copied to all portals!${NC}"
echo ""
echo -e "${BLUE}Verifying...${NC}"
ls -la /var/www/html/alumni/assets/img/
