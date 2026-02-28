#!/bin/bash
# Fix image paths for all portals to use relative paths

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 Fixing image paths for all portals${NC}"
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CLIENT_DIR="$PROJECT_ROOT/client"

# Array of all frontend apps
APPS=(
    "superadmin"
    "ojt-head"
    "ojt-coordinator"
    "student-trainee"
    "employer"
    "supervisor"
    "job-placement-head"
    "alumni"
)

fix_images_in_file() {
    local file=$1
    if [ -f "$file" ]; then
        # Replace absolute paths with relative paths
        sed -i 's|"/assets/|"assets/|g' "$file"
        sed -i "s|'/assets/|'assets/|g" "$file"
        sed -i 's|url("/assets/|url("assets/|g' "$file"
        sed -i "s|url('/assets/|url('assets/|g" "$file"
        sed -i 's|url(&quot;/assets/|url(&quot;assets/|g' "$file"
    fi
}

for APP in "${APPS[@]}"; do
    APP_DIR="$CLIENT_DIR/$APP"
    
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}✗ Directory not found: $APP_DIR${NC}"
        continue
    fi
    
    echo -e "${BLUE}📝 Fixing $APP...${NC}"
    
    # Find and fix all HTML files
    find "$APP_DIR/src" -name "*.html" -type f | while read file; do
        fix_images_in_file "$file"
    done
    
    # Find and fix all TypeScript files
    find "$APP_DIR/src" -name "*.ts" -type f | while read file; do
        fix_images_in_file "$file"
    done
    
    # Find and fix all CSS files
    find "$APP_DIR/src" -name "*.css" -type f | while read file; do
        fix_images_in_file "$file"
    done
    
    echo -e "${GREEN}✓ Fixed $APP${NC}"
done

echo ""
echo -e "${GREEN}🎉 All image paths fixed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Review changes: git diff"
echo "2. Rebuild all portals: ./deployment/build-all-frontends.sh"
echo "3. Deploy to production"
