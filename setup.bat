@echo off
REM Setup script for Telegram Message Exporter
REM This will create extract_messages.bat with the chosen export directory

setlocal enabledelayedexpansion

set /p export_dir="Enter the path for the @exports folder (e.g., C:\path\to\@exports): "
set /p bat_location="Enter the full path where to create extract_messages.bat (e.g., C:\path\to\extract_messages.bat): "

REM Create the directory if it doesn't exist
for %%F in ("%bat_location%") do mkdir "%%~dpF" 2>nul

REM Write the batch file
(
echo @echo off
echo REM Telegram Chat Export Message Extractor
echo REM This batch file will run the extraction script, which will prompt for folder and export name
echo.
echo where npm ^>nul 2^>nul
echo if %%errorlevel%% neq 0 (
echo     echo Node.js and npm are required but not found in PATH.
echo     pause
echo     exit /b 1
echo )
echo.
echo REM Install cheerio if not already installed
echo if not exist node_modules (
echo     echo Installing dependencies...
echo     npm install cheerio
echo )
echo.
echo REM Set the export directory
echo set EXPORT_DIR=!export_dir!
echo.
echo REM Run the extraction script (will prompt for folder and export name)
echo node extract_messages.js
echo.
echo if %%errorlevel%% neq 0 (
echo     echo Extraction failed. See error above.
echo     pause
echo     exit /b %%errorlevel%%
echo )
echo.
echo echo Extraction complete. See %%EXPORT_DIR%%\^<export_name^>.txt for results.
echo pause
) > "%bat_location%"

echo extract_messages.bat created at %bat_location%
pause