@echo off
chcp 65001 >nul
title Album Mundial 2026 - Servidor Local
color 0A

echo.
echo  ===================================================
echo     ALBUM MUNDIAL 2026 - PANINI COLOMBIA
echo  ===================================================
echo.
echo  Buscando tu direccion IP...
echo.

for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set IP=%%a
)
set IP=%IP: =%

echo  ===================================================
echo.
echo   Tu album esta listo! Abre esta direccion
echo   en Chrome o Safari de tu celular:
echo.
echo   http://%IP%:8000/album-mundial-2026.html
echo.
echo  ===================================================
echo.
echo   IMPORTANTE: Tu celular debe estar conectado
echo   al mismo WiFi que este computador.
echo.
echo   NO cierres esta ventana mientras uses la app.
echo   Presiona Ctrl+C para detener el servidor.
echo.
echo  ===================================================
echo.

cd /d "%~dp0"
python -m http.server 8000
