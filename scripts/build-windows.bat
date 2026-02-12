@echo off
setlocal
cd /d "%~dp0\.."

echo [0/3] Cleaning old dist artifacts...
if exist dist rmdir /s /q dist

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo [2/3] Building Windows portable EXE artifacts...
call npm run pack:portable
if errorlevel 1 goto :error

echo [3/3] Done. Fresh artifact is in dist\
exit /b 0

:error
echo Build failed.
exit /b 1
