#!/bin/bash

# ILEAP Development Environment Startup Script
# This script starts all frontends and the backend server

echo "================================================"
echo "Starting ILEAP Development Environment"
echo "================================================"

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to workspace root
WORKSPACE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$WORKSPACE_ROOT"

echo -e "\n${YELLOW}Starting Backend on port 3000...${NC}"
cd server-fastapi
# Start backend with uvicorn reload on port 3000
gnome-terminal --tab --title="Backend (Port 3000)" -- bash -c "cd '$WORKSPACE_ROOT/server-fastapi' && uvicorn main:app --reload --host 0.0.0.0 --port 3000; exec bash" 2>/dev/null || \
xterm -T "Backend (Port 3000)" -e "cd '$WORKSPACE_ROOT/server-fastapi' && uvicorn main:app --reload --host 0.0.0.0 --port 3000; exec bash" 2>/dev/null || \
start "Backend (Port 3000)" cmd /k "cd /d %WORKSPACE_ROOT%\server-fastapi && uvicorn main:app --reload --host 0.0.0.0 --port 3000" 2>/dev/null || \
echo -e "${GREEN}Run manually: cd server-fastapi && uvicorn main:app --reload --host 0.0.0.0 --port 3000${NC}"

echo -e "\n${YELLOW}Starting Frontend Applications...${NC}"

# Array of frontends with their ports
declare -A FRONTENDS=(
    ["superadmin"]="4200"
    ["employer"]="4201"
    ["ojt-coordinator"]="4202"
    ["ojt-head"]="4203"
    ["student-trainee"]="4204"
    ["supervisor"]="4205"
)

# Start each frontend
for APP in "${!FRONTENDS[@]}"; do
    PORT="${FRONTENDS[$APP]}"
    echo -e "${GREEN}Starting $APP on port $PORT...${NC}"
    
    # Try different terminal emulators
    gnome-terminal --tab --title="$APP (Port $PORT)" -- bash -c "cd '$WORKSPACE_ROOT/client/$APP' && npm start; exec bash" 2>/dev/null || \
    xterm -T "$APP (Port $PORT)" -e "cd '$WORKSPACE_ROOT/client/$APP' && npm start; exec bash" 2>/dev/null || \
    start "$APP (Port $PORT)" cmd /k "cd /d %WORKSPACE_ROOT%\client\$APP && npm start" 2>/dev/null || \
    echo -e "${GREEN}Run manually: cd client/$APP && npm start${NC}"
done

echo -e "\n${GREEN}================================================${NC}"
echo -e "${GREEN}All services starting...${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Backend API:        http://localhost:3000"
echo "Superadmin:         http://localhost:4200"
echo "Employer:           http://localhost:4201"
echo "OJT Coordinator:    http://localhost:4202"
echo "OJT Head:           http://localhost:4203"
echo "Student Trainee:    http://localhost:4204"
echo "Supervisor:         http://localhost:4205"
echo ""
echo -e "${YELLOW}Note: If terminals didn't open automatically, run the commands manually${NC}"
echo "================================================"
