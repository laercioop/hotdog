@echo off
setlocal
cd /d "%~dp0"

where python >nul 2>nul
if errorlevel 1 (
  echo Python nao foi encontrado neste computador.
  echo Instale o Python e marque a opcao "Add Python to PATH".
  pause
  exit /b 1
)

start "Servidor do gerador ASJ" /min python -m http.server 8765 --bind 127.0.0.1
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:8765/gerador.html"

endlocal
exit /b 0
