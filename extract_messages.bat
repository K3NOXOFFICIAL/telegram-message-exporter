@echo off
REM Telegram Chat Export Message Extractor
REM This batch file will run the extraction script, which will prompt for folder and export name

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js and npm are required but not found in PATH.
    pause
    exit /b 1
)

REM Install cheerio if not already installed
if not exist node_modules (
    echo Installing dependencies...
    npm install cheerio
)

REM Run the extraction script (will prompt for folder and export name)
node extract_messages.js

if %errorlevel% neq 0 (
    echo Extraction failed. See error above.
    pause
    exit /b %errorlevel%
)

echo Extraction complete. See S:\Coding\telegram-message-exporter\@Exports\<export_name>.txt for results.
pause
