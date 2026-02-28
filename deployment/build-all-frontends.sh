#!/bin/bash
# Build All ILEAP Frontend Applications in Production Mode

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Production IP
EC2_IP="54.251.87.169"

echo -e "${BLUE}🚀 Building All ILEAP Frontend Applications${NC}"
echo -e "${BLUE}Production IP: ${EC2_IP}${NC}"
echo ""

# Detect script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SOURCE_DIR="$PROJECT_ROOT/client"
DEST_DIR="$PROJECT_ROOT/dist-prod"

echo -e "${GREEN}Running locally${NC}"
echo -e "${BLUE}Source: ${SOURCE_DIR}${NC}"
echo -e "${BLUE}Output: ${DEST_DIR}${NC}"
echo ""

# Create destination directory
mkdir -p "$DEST_DIR"

# Ask to delete existing builds
if [ -d "$DEST_DIR" ] && [ "$(ls -A $DEST_DIR 2>/dev/null)" ]; then
    echo -e "${YELLOW}Existing build directory found${NC}"
    read -p "Delete existing builds? (yes/no): " DELETE_CONFIRM
    if [ "$DELETE_CONFIRM" = "yes" ]; then
        echo -e "${BLUE}🗑️  Deleting existing builds...${NC}"
        rm -rf "${DEST_DIR}"/*
        echo -e "${GREEN}✓ Existing builds deleted${NC}"
    fi
    echo ""
fi

# Array of all frontend apps with their base hrefs
declare -A APPS
APPS=(
    ["superadmin"]="/superadmin/"
    ["ojt-head"]="/ojt-head/"
    ["ojt-coordinator"]="/ojt-coordinator/"
    ["student-trainee"]="/student/"
    ["employer"]="/employer/"
    ["supervisor"]="/supervisor/"
    ["job-placement-head"]="/jp-head/"
    ["alumni"]="/alumni/"
)

# Function to build an app
build_app() {
    local APP_NAME=$1
    local BASE_HREF=$2
    
    echo -e "${BLUE}📦 Building ${APP_NAME}...${NC}"
    
    # Check if app directory exists
    if [ ! -d "${SOURCE_DIR}/${APP_NAME}" ]; then
        echo -e "${RED}  ✗ Directory not found: ${SOURCE_DIR}/${APP_NAME}${NC}"
        return 1
    fi
    
    # Navigate to app directory
    cd "${SOURCE_DIR}/${APP_NAME}"
    
    # Update environment file for production
    if [ -d "src/environments" ]; then
        echo -e "  ➜ Updating environment configuration..."
        cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://${EC2_IP}/api'
};
EOF
    fi
    
    echo -e "  ➜ Installing dependencies..."
    npm install --silent 2>&1 | tee /tmp/npm-install-${APP_NAME}.log || {
        echo -e "${RED}  ✗ Failed to install dependencies for ${APP_NAME}${NC}"
        return 1
    }
    
    echo -e "  ➜ Building production bundle with base-href=${BASE_HREF}..."
    # MSYS_NO_PATHCONV=1 npm run build -- --configuration production --base-href=${BASE_HREF} 2>&1 | tee /tmp/npm-build-${APP_NAME}.log || {

    MSYS_NO_PATHCONV=1 ng build --configuration production {
        echo -e "${RED}  ✗ Failed to build ${APP_NAME}${NC}"
        return 1
    }
    
    # Clean destination
    echo -e "  ➜ Copying to ${DEST_DIR}/${APP_NAME}..."
    rm -rf "${DEST_DIR}/${APP_NAME}"
    mkdir -p "${DEST_DIR}/${APP_NAME}"
    
    # Copy built files
    if [ -d "dist/${APP_NAME}/browser" ]; then
        cp -r dist/${APP_NAME}/browser/* "${DEST_DIR}/${APP_NAME}/"
    elif [ -d "dist/${APP_NAME}" ]; then
        cp -r dist/${APP_NAME}/* "${DEST_DIR}/${APP_NAME}/"
    else
        echo -e "${RED}  ✗ Build output not found for ${APP_NAME}${NC}"
        return 1
    fi
    
    # Verify deployment
    if [ -f "${DEST_DIR}/${APP_NAME}/index.html" ]; then
        echo -e "${GREEN}  ✓ ${APP_NAME} built successfully${NC}"
        return 0
    else
        echo -e "${RED}  ✗ Build verification failed for ${APP_NAME}${NC}"
        return 1
    fi
}

# Build all apps
FAILED_APPS=()
SUCCESSFUL_APPS=()

for APP_NAME in "${!APPS[@]}"; do
    BASE_HREF="${APPS[$APP_NAME]}"
    if build_app "$APP_NAME" "$BASE_HREF"; then
        SUCCESSFUL_APPS+=("$APP_NAME")
    else
        FAILED_APPS+=("$APP_NAME")
    fi
    echo ""
done

# Summary
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Build Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Successful: ${#SUCCESSFUL_APPS[@]}/8${NC}"
for APP in "${SUCCESSFUL_APPS[@]}"; do
    echo -e "  ${GREEN}✓${NC} ${APP}"
done

if [ ${#FAILED_APPS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Failed: ${#FAILED_APPS[@]}/8${NC}"
    for APP in "${FAILED_APPS[@]}"; do
        echo -e "  ${RED}✗${NC} ${APP}"
    done
fi

echo ""
echo -e "${BLUE}Built files are in: ${DEST_DIR}${NC}"
echo ""
echo -e "${BLUE}After deployment, portals will be available at:${NC}"
echo -e "  Superadmin:        http://${EC2_IP}/superadmin"
echo -e "  OJT Head:          http://${EC2_IP}/ojt-head"
echo -e "  OJT Coordinator:   http://${EC2_IP}/ojt-coordinator"
echo -e "  Student:           http://${EC2_IP}/student"
echo -e "  Employer:          http://${EC2_IP}/employer"
echo -e "  Supervisor:        http://${EC2_IP}/supervisor"
echo -e "  Job Placement:     http://${EC2_IP}/jp-head"
echo -e "  Alumni:            http://${EC2_IP}/alumni"
echo -e "  API Docs:          http://${EC2_IP}/api/docs"
echo ""

if [ ${#FAILED_APPS[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All frontends built successfully!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Upload to EC2: scp -i deployment/ileap-keykey.pem -r dist-prod/* ec2-user@${EC2_IP}:/tmp/ileap-dist/"
    echo -e "  2. Deploy on EC2: sudo cp -r /tmp/ileap-dist/* /var/www/html/"
    echo -e "  3. Fix permissions: sudo chown -R nginx:nginx /var/www/html && sudo chmod -R 755 /var/www/html"
    exit 0
else
    echo -e "${RED}⚠️  Some builds failed. Check errors above.${NC}"
    exit 1
fi
