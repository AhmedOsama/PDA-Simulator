@echo off
title Medical Pump Simulator - Local Server
color 0A

echo ================================================
echo    Medical Pump Simulator
echo    Starting Local Server...
echo ================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed!
    echo Please install Python from: https://www.python.org/downloads/
    pause
    exit
)

echo [OK] Python detected
echo.
echo Server will start on: http://localhost:8080
echo Opening browser in 3 seconds...
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

:: Wait 2 seconds then open browser
timeout /t 2 /nobreak >nul
start http://localhost:8080/login.html

:: Start the server
python -m http.server 8080
