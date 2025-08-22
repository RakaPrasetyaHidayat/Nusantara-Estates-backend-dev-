@echo off
echo Starting Nusantara Estates Full Application...
echo.

echo Checking if MySQL is running...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I /N "mysqld.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MySQL is running
) else (
    echo ❌ MySQL is not running. Please start MySQL first.
    pause
    exit /b 1
)

echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d c:\Users\VINY\Documents\nusantara-estates && node server\app.js"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Development Server...
start "Frontend Server" cmd /k "cd /d c:\Users\VINY\Documents\nusantara-estates && npm run dev"

echo.
echo ✅ Both servers are starting...
echo.
echo Backend: http://localhost:5174
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul