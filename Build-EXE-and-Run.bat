@echo off
setlocal
cd /d "%~dp0"

echo === Something to Focus: Build EXE and Run ===
where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js LTS from https://nodejs.org and run again.
  exit /b 1
)

echo [1/3] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo [2/3] Building Windows executable...
call npm run pack:win
if errorlevel 1 goto :error

echo [3/3] Launching built executable...
for %%F in ("dist\*.exe") do (
  start "" "%%~fF"
  echo Launched: %%~nxF
  exit /b 0
)

echo No EXE was found in dist\
exit /b 1

:error
echo Build failed. See output above.
exit /b 1
