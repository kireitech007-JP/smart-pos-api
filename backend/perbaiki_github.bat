@echo off
SET GIT_PATH="c:\Users\JP Production\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
cd "C:\Users\JP Production\Documents\GitHub\smart-retail-pos\backend"

echo 1. Membersihkan cache Git...
%GIT_PATH% rm -r --cached . >nul 2>&1

echo 2. Menambahkan semua folder (app, bootstrap, routes, dll)...
%GIT_PATH% add . -f

echo 3. Melakukan commit...
%GIT_PATH% commit -m "FIX: Sinkronisasi total semua folder Laravel"

echo 4. Mengirim ke GitHub branch main...
%GIT_PATH% push origin main --force

echo.
echo Selesai! Silakan cek website GitHub Anda.
echo Pastikan folder 'bootstrap' dan 'routes' sudah muncul.
pause