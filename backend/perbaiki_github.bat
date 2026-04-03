@echo off
SET GIT_PATH="c:\Users\JP Production\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
cd "C:\Users\JP Production\Documents\GitHub\smart-retail-pos\backend"

echo Menambah file bootstrap...
%GIT_PATH% add bootstrap/app.php -f
%GIT_PATH% add bootstrap/providers.php -f

echo Melakukan commit...
%GIT_PATH% commit -m "FIX: Paksa file bootstrap masuk"

echo Mengirim ke GitHub (branch main)...
%GIT_PATH% push origin master:main --force

echo Selesai! Silakan cek di website GitHub.
pause
