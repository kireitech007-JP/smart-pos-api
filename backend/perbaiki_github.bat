@echo off
SET GIT_PATH="c:\Users\JP Production\AppData\Local\GitHubDesktop\app-3.5.6\resources\app\git\cmd\git.exe"
cd "C:\Users\JP Production\Documents\GitHub\smart-retail-pos\backend"

echo 1. Menghapus folder .git lama (untuk reset total)...
rmdir /s /q .git >nul 2>&1

echo 2. Inisialisasi Git baru...
%GIT_PATH% init

echo 3. Mengatur remote ke repositori yang benar...
%GIT_PATH% remote add origin https://github.com/kireitech007-JP/smart-pos-api.git

echo 4. Menambahkan SEMUA file proyek Laravel...
%GIT_PATH% add . -f

echo 5. Melakukan commit pertama...
%GIT_PATH% commit -m "Initial commit: Full Laravel Backend"

echo 6. Mengirim ke GitHub (branch main)...
%GIT_PATH% push origin master:main --force

echo.
echo SELESAI! 
echo Silakan buka: https://github.com/kireitech007-JP/smart-pos-api
echo Pastikan file 'composer.json' dan folder 'app' sudah terlihat di sana.
pause
