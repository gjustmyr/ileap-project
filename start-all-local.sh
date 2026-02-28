#!/bin/bash
# Start all ILEAP portals locally

echo "=== Starting ILEAP System Locally ==="
echo ""

# Start backend
echo "Starting backend on port 3000..."
cd server-fastapi
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
uvicorn main:app --reload --port 3000 &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
cd ..

# Wait for backend to start
sleep 3

# Start all frontends
echo ""
echo "Starting frontends..."

# Superadmin - 4200
echo "Starting Superadmin on port 4200..."
cd client/superadmin
npm install > /dev/null 2>&1
npm start &
cd ../..

# OJT Head - 4201
echo "Starting OJT Head on port 4201..."
cd client/ojt-head
npm install > /dev/null 2>&1
npm start &
cd ../..

# OJT Coordinator - 4202
echo "Starting OJT Coordinator on port 4202..."
cd client/ojt-coordinator
npm install > /dev/null 2>&1
npm start &
cd ../..

# Student - 4203
echo "Starting Student on port 4203..."
cd client/student-trainee
npm install > /dev/null 2>&1
npm start &
cd ../..

# Employer - 4204
echo "Starting Employer on port 4204..."
cd client/employer
npm install > /dev/null 2>&1
npm start &
cd ../..

# Supervisor - 4205
echo "Starting Supervisor on port 4205..."
cd client/supervisor
npm install > /dev/null 2>&1
npm start &
cd ../..

# Job Placement Head - 4206
echo "Starting Job Placement Head on port 4206..."
cd client/job-placement-head
npm install > /dev/null 2>&1
npm start &
cd ../..

# Alumni - 4207
echo "Starting Alumni on port 4207..."
cd client/alumni
npm install > /dev/null 2>&1
npm start &
cd ../..

echo ""
echo "=== All services starting... ==="
echo ""
echo "Wait 30-60 seconds for all services to be ready"
echo ""
echo "Access portals at:"
echo "  Backend:              http://localhost:3000"
echo "  Superadmin:           http://localhost:4200"
echo "  OJT Head:             http://localhost:4201"
echo "  OJT Coordinator:      http://localhost:4202"
echo "  Student:              http://localhost:4203"
echo "  Employer:             http://localhost:4204"
echo "  Supervisor:           http://localhost:4205"
echo "  Job Placement Head:   http://localhost:4206"
echo "  Alumni:               http://localhost:4207"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
wait
