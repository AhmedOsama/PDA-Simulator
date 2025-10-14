@echo off
echo Starting local development server...
echo.
echo Server will run on http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080
pause
