@echo off
echo Initializing Nusantara Estates Database...
echo.

echo Step 1: Setting up database structure...
node "c:\Users\VINY\Documents\nusantara-estates\database\setup-database.js"

echo.
echo Step 2: Inserting sample properties...
node "c:\Users\VINY\Documents\nusantara-estates\scripts\setup-properties.js"

echo.
echo Database initialization completed!
echo You can now start the backend server.
pause