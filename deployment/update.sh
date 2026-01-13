#!/bin/bash
# Quick update script for code changes
# Run from project root: sudo bash deployment/update.sh

set -e

DEPLOY_DIR="/var/www/ileap"
PROJECT_DIR=$(pwd)

echo "🔄 Updating ILEAP deployment..."

# Ask which component to update
echo "Select component to update:"
echo "1) All clients"
echo "2) Backend only"
echo "3) Specific client"
echo "4) Full deployment"
read -p "Enter choice (1-4): " CHOICE

case $CHOICE in
    1)
        # Update all clients
        CLIENTS=("employer" "ojt-coordinator" "ojt-head" "student-trainee" "superadmin" "supervisor")
        for CLIENT in "${CLIENTS[@]}"; do
            echo "🔨 Building $CLIENT..."
            cd "$PROJECT_DIR/client/$CLIENT"
            npm install --legacy-peer-deps
            npm run build -- --configuration production
            rm -rf "$DEPLOY_DIR/clients/$CLIENT"
            mkdir -p "$DEPLOY_DIR/clients/$CLIENT"
            cp -r dist/$CLIENT/browser/* "$DEPLOY_DIR/clients/$CLIENT/"
        done
        echo "✅ All clients updated!"
        ;;
    2)
        # Update backend only
        echo "🐍 Updating backend..."
        cd "$PROJECT_DIR/server-fastapi"
        rsync -av --exclude='venv' --exclude='__pycache__' --exclude='*.pyc' \
            --exclude='.env' "$PROJECT_DIR/server-fastapi/" "$DEPLOY_DIR/api/"
        
        # Reinstall dependencies if requirements.txt changed
        if [ "$PROJECT_DIR/server-fastapi/requirements.txt" -nt "$DEPLOY_DIR/api/.requirements-installed" ]; then
            echo "📦 Updating Python dependencies..."
            source "$DEPLOY_DIR/api/venv/bin/activate"
            pip install -r "$DEPLOY_DIR/api/requirements.txt"
            deactivate
            touch "$DEPLOY_DIR/api/.requirements-installed"
        fi
        
        systemctl restart ileap-api
        echo "✅ Backend updated and restarted!"
        ;;
    3)
        # Update specific client
        echo "Enter client name (employer/ojt-coordinator/ojt-head/student-trainee/superadmin/supervisor):"
        read CLIENT_NAME
        echo "🔨 Building $CLIENT_NAME..."
        cd "$PROJECT_DIR/client/$CLIENT_NAME"
        npm install --legacy-peer-deps
        npm run build -- --configuration production
        rm -rf "$DEPLOY_DIR/clients/$CLIENT_NAME"
        mkdir -p "$DEPLOY_DIR/clients/$CLIENT_NAME"
        cp -r dist/$CLIENT_NAME/browser/* "$DEPLOY_DIR/clients/$CLIENT_NAME/"
        echo "✅ $CLIENT_NAME updated!"
        ;;
    4)
        # Full deployment
        echo "🚀 Running full deployment..."
        bash "$PROJECT_DIR/deployment/deploy.sh"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

# Set permissions
chown -R www-data:www-data "$DEPLOY_DIR"
chmod -R 755 "$DEPLOY_DIR"

echo "✅ Update complete!"
