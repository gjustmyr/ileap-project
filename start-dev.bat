@echo off
REM ILEAP Development Environment Startup Script for Windows
REM This script starts all frontends and the backend server

echo ================================================
echo Starting ILEAP Development Environment
echo ================================================

SET WORKSPACE_ROOT=%~dp0

echo.
echo Starting Backend on port 3000...
start "Backend (Port 3000)" cmd /k "cd /d %WORKSPACE_ROOT%server-fastapi && uvicorn main:app --reload --host 0.0.0.0 --port 3000"

timeout /t 2 /nobreak >nul

echo.
echo Starting Frontend Applications...

echo Starting Superadmin on port 4200...
start "Superadmin (Port 4200)" cmd /k "cd /d %WORKSPACE_ROOT%client\superadmin && npm start"

timeout /t 1 /nobreak >nul

echo Starting Employer on port 4201...
start "Employer (Port 4201)" cmd /k "cd /d %WORKSPACE_ROOT%client\employer && npm start"

timeout /t 1 /nobreak >nul

echo Starting OJT Coordinator on port 4202...
start "OJT Coordinator (Port 4202)" cmd /k "cd /d %WORKSPACE_ROOT%client\ojt-coordinator && npm start"

timeout /t 1 /nobreak >nul

echo Starting OJT Head on port 4203...
start "OJT Head (Port 4203)" cmd /k "cd /d %WORKSPACE_ROOT%client\ojt-head && npm start"

timeout /t 1 /nobreak >nul

echo Starting Student Trainee on port 4204...
start "Student Trainee (Port 4204)" cmd /k "cd /d %WORKSPACE_ROOT%client\student-trainee && npm start"

timeout /t 1 /nobreak >nul

echo Starting Supervisor on port 4700...
start "Supervisor (Port 4700)" cmd /k "cd /d %WORKSPACE_ROOT%client\supervisor && npm start"

echo.
echo ================================================
echo All services starting in separate windows...
echo ================================================
echo.
echo Backend API:        http://localhost:3000
echo Superadmin:         http://localhost:4200
echo Employer:           http://localhost:4201
echo OJT Coordinator:    http://localhost:4202
echo OJT Head:           http://localhost:4203
echo Student Trainee:    http://localhost:4204
echo Supervisor:         http://localhost:4700
echo.
echo ================================================

pause
