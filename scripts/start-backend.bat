@echo off
echo 🚀 Starting Backend Server...
echo.
echo Server will run on: http://localhost:5174
echo API endpoints:
echo   - GET /api/data
echo   - GET /api/health
echo   - GET /api/lihat-lainnya
echo.
echo Press Ctrl+C to stop the server
echo.
node server/app-no-db.js
pause