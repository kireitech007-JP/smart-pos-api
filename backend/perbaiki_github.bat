@echo off
SET GIT_PATH="c:\Users\JP Production\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
cd "C:\Users\JP Production\Documents\GitHub\smart-retail-pos\backend"

echo Membersihkan index git...
%GIT_PATH% rm -r --cached .

echo Menambah SEMUA file proyek Laravel...
%GIT_PATH% add . -f

echo Melakukan commit...
%GIT_PATH% commit -m "FIX: Memastikan semua folder (bootstrap, routes, app, dll) masuk ke repositori"

echo Mengirim ke GitHub (branch main)...
%GIT_PATH% push origin master:main --force

echo Selesai! Silakan cek di website GitHub folder 'routes' dan 'bootstrap' sudah ada.
pause
