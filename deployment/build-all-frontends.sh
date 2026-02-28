#!/bin/bash
# Build All ILEAP Frontend Applications in Production Mode
# Run this script from your EC2 instance after uploading code

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\047.128.70.1933[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Production IP
EC2_IP="47.128.70.19"

echo -e "${BLUE}🚀 Building All ILEAP Frontend Applications${NC}"
echo -e "${BLUE}Production IP: ${EC2_IP}${NC}"
echo ""

# Detect if running locally or on EC2
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Determine source and destination directories
if [ -d "/home/ubuntu/ileap-source" ]; then
    # Running on EC2
    SOURCE_DIR="/home/ubuntu/ileap-source/client"
    DEST_DIR="/var/www/ileap/clients"
    USE_SUDO="sudo"
    echo -e "${GREEN}Running on EC2 server${NC}"
else
    # Running locally
    SOURCE_DIR="$PROJECT_ROOT/client"
    DEST_DIR="$PROJECT_ROOT/dist-prod"
    USE_SUDO=""
    echo -e "${GREEN}Running locally${NC}"
    echo -e "${BLUE}Build output will be in: ${DEST_DIR}${NC}"
    mkdir -p "$DEST_DIR"
fi
echo ""

# Ask to delete existing builds
if [ -d "$DEST_DIR" ] && [ "$(ls -A $DEST_DIR 2>/dev/null)" ]; then
    echo -e "${BLUE}Existing build directory found: ${DEST_DIR}${NC}"
    read -p "Do you want to delete existing builds before building? (yes/no): " DELETE_CONFIRM
    if [ "$DELETE_CONFIRM" = "yes" ]; then
        echo -e "${BLUE}🗑️  Deleting existing builds...${NC}"
        $USE_SUDO rm -rf "${DEST_DIR}"/*
        echo -e "${GREEN}✓ Existing builds deleted${NC}"
    else
        echo -e "${BLUE}Keeping existing builds, will overwrite during deployment${NC}"
    fi
    echo ""
fi

# Array of all frontend apps
APPS=(
    "student-trainee"
    "employer"
    "ojt-coordinator"
    "ojt-head"
    "superadmin"
    "supervisor"
)

# Function to build an app
build_app() {
    local APP_NAME=$1
    echo -e "${BLUE}📦 Building ${APP_NAME}...${NC}"
    
    # Navigate to app directory
    cd "${SOURCE_DIR}/${APP_NAME}"
    
    # Create environment file
    mkdir -p src/environments
    cat > src/environments/environment.prod.ts << EOF
export const environment = {
  production: true,
  apiUrl: 'http://${EC2_IP}:3000'
};
EOF
    
    echo -e "  ➜ Installing dependencies..."
    npm install --legacy-peer-deps 2>&1 | tee /tmp/npm-install-${APP_NAME}.log || {
        echo -e "${RED}  ✗ Failed to install dependencies for ${APP_NAME}${NC}"
        echo -e "${RED}  Check log: /tmp/npm-install-${APP_NAME}.log${NC}"
        return 1
    }
    
    echo -e "  ➜ Building production bundle..."
    npm run build -- --configuration production 2>&1 | tee /tmp/npm-build-${APP_NAME}.log || {
        echo -e "${RED}  ✗ Failed to build ${APP_NAME}${NC}"
        echo -e "${RED}  Check log: /tmp/npm-build-${APP_NAME}.log${NC}"
        return 1
    }
    
    # Clean destination
    echo -e "  ➜ Deploying to ${DEST_DIR}/${APP_NAME}..."
    $USE_SUDO rm -rf "${DEST_DIR}/${APP_NAME}"
    $USE_SUDO mkdir -p "${DEST_DIR}/${APP_NAME}"
    
    # Copy built files
    if [ -d "dist/${APP_NAME}/browser" ]; then
        $USE_SUDO cp -r dist/${APP_NAME}/browser/* "${DEST_DIR}/${APP_NAME}/"
    elif [ -d "dist/${APP_NAME}" ]; then
        $USE_SUDO cp -r dist/${APP_NAME}/* "${DEST_DIR}/${APP_NAME}/"
    else
        echo -e "${RED}  ✗ Build output not found for ${APP_NAME}${NC}"
        return 1
    fi
    
    # Verify deployment
    if [ -f "${DEST_DIR}/${APP_NAME}/index.html" ]; then
        echo -e "${GREEN}  ✓ ${APP_NAME} built and deployed successfully${NC}"
        return 0
    else
        echo -e "${RED}  ✗ Deployment verification failed for ${APP_NAME}${NC}"
        return 1
    fi
}

# Build all apps
FAILED_APPS=()
SUCCESSFUL_APPS=()

for APP in "${APPS[@]}"; do
    if build_app "$APP"; then
        SUCCESSFUL_APPS+=("$APP")
    else
        FAILED_APPS+=("$APP")
    fi
    echo ""
done

# Summary
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}Build Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Successful: ${#SUCCESSFUL_APPS[@]}/${#APPS[@]}${NC}"
for APP in "${SUCCESSFUL_APPS[@]}"; do
    echo -e "  ${GREEN}✓${NC} ${APP}"
done

if [ ${#FAILED_APPS[@]} -gt 0 ]; then
    echo -e "${RED}✗ Failed: ${#FAILED_APPS[@]}/${#APPS[@]}${NC}"
    for APP in "${FAILED_APPS[@]}"; do
        echo -e "  ${RED}✗${NC} ${APP}"
    done
fi

echo ""
echo -e "${BLUE}Application URLs:${NC}"
echo -e "  Landing Page: http://${EC2_IP}"
echo -e "  Student:      http://${EC2_IP}:7000"
echo -e "  Employer:     http://${EC2_IP}:7001"
echo -e "  Coordinator:  http://${EC2_IP}:7002"
echo -e "  OJT Head:     http://${EC2_IP}:7003"
echo -e "  Superadmin:   http://${EC2_IP}:7004"
echo -e "  Supervisor:   http://${EC2_IP}:7100"
echo -e "  API Docs:     http://${EC2_IP}:3000/docs"

if [ ${#FAILED_APPS[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All frontends built successfully!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some builds failed. Check errors above.${NC}"
    exit 1
fi
