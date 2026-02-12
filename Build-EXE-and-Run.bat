@echo off
setlocal
cd /d "%~dp0"

echo === Something to Focus: Build EXE and Run (v5.1.0) ===
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js LTS from https://nodejs.org and run again.
  exit /b 1
)

echo [0/4] Cleaning old dist artifacts...
if exist dist rmdir /s /q dist

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo [2/4] Building fresh Windows portable executable...
call npm run pack:portable
if errorlevel 1 goto :error

echo [3/4] Selecting newest executable from dist...
set "LATEST_EXE="
for /f "delims=" %%F in ('dir /b /a:-d /o:-d "dist\*.exe"') do (
  if not defined LATEST_EXE set "LATEST_EXE=dist\%%F"
)

if not defined LATEST_EXE (
  echo No EXE was found in dist\
  exit /b 1
)

echo [4/4] Launching %LATEST_EXE%
start "" "%LATEST_EXE%"
exit /b 0

:error
echo Build failed. See output above.
exit /b 1
