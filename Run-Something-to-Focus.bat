@echo off
setlocal

REM Always run from repository/app directory
cd /d "%~dp0"

if exist "index.html" (
  echo Launching Something to Focus in your default browser...
  start "" "%cd%\index.html"
  exit /b 0
)

echo Could not find index.html next to this launcher.
echo Make sure Run-Something-to-Focus.bat is in the same folder as index.html.
exit /b 1
