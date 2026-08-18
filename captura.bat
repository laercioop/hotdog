@echo off
setlocal
cd /d "%~dp0"

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0captura.ps1"
if errorlevel 1 (
  echo.
  echo Nao foi possivel gerar a captura.
  pause
  exit /b 1
)

echo.
pause
endlocal
exit /b 0
