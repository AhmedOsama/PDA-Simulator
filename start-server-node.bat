@echo off
echo Checking if http-server is installed...
where http-server >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing http-server...
    npm install -g http-server
)
echo.
echo Starting local development server...
echo Server will run on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
http-server -p 8080 -c-1
pause
