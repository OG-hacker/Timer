@echo off
setlocal

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo [2/3] Building Windows EXE artifacts...
call npm run pack:win
if errorlevel 1 goto :error

echo [3/3] Done. Artifacts are in the dist folder.
exit /b 0

:error
echo Build failed.
exit /b 1
