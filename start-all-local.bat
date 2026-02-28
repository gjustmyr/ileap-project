@echo off
REM Start all ILEAP portals locally on Windows

echo === Starting ILEAP System Locally ===
echo.

REM Start backend
echo Starting backend on port 3000...
start "Backend" cmd /k "cd server-fastapi && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && uvicorn main:app --reload --port 3000"
timeout /t 5 /nobreak > nul

REM Start all frontends
echo.
echo Starting frontends...

echo Starting Superadmin on port 4200...
start "Superadmin" cmd /k "cd client\superadmin && npm install && npm start"

echo Starting OJT Head on port 4201...
start "OJT Head" cmd /k "cd client\ojt-head && npm install && npm start"

echo Starting OJT Coordinator on port 4202...
start "OJT Coordinator" cmd /k "cd client\ojt-coordinator && npm install && npm start"

echo Starting Student on port 4203...
start "Student" cmd /k "cd client\student-trainee && npm install && npm start"

echo Starting Employer on port 4204...
start "Employer" cmd /k "cd client\employer && npm install && npm start"

echo Starting Supervisor on port 4205...
start "Supervisor" cmd /k "cd client\supervisor && npm install && npm start"

echo Starting Job Placement Head on port 4206...
start "Job Placement Head" cmd /k "cd client\job-placement-head && npm install && npm start"

echo Starting Alumni on port 4207...
start "Alumni" cmd /k "cd client\alumni && npm install && npm start"

echo.
echo === All services starting... ===
echo.
echo Wait 30-60 seconds for all services to be ready
echo.
echo Access portals at:
echo   Backend:              http://54.251.87.169:3000
echo   Superadmin:           http://localhost:4200
echo   OJT Head:             http://localhost:4201
echo   OJT Coordinator:      http://localhost:4202
echo   Student:              http://localhost:4203
echo   Employer:             http://localhost:4204
echo   Supervisor:           http://localhost:4205
echo   Job Placement Head:   http://localhost:4206
echo   Alumni:               http://localhost:4207
echo.
echo Close all terminal windows to stop services
pause
