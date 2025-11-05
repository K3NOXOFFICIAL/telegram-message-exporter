# Telegram Chat Export Message Extractor

This script extracts all messages from Telegram HTML export files (messages.html, messages2.html, ..., messages17.html) and combines them into a single text file in the correct order.

## Usage

1. **Install dependencies** (if not already installed):
   ```powershell
   npm install cheerio
   ```



2. **Quick extraction (recommended):**
   - Double-click `extract_messages.bat` anywhere.
   - You will be prompted for:
     - The path to the Telegram export folder (where the messages.html files are)
     - The export name (used as the .txt filename)
   - The result will be saved as `S:\Coding\telegram-message-exporter\Exports\<export_name>.txt`.

3. **Manual script usage:**
   ```powershell
   node extract_messages.js
   ```
   - The script will prompt you for the source folder and export name.
   - The result will be saved as `S:\Coding\telegram-message-exporter\Exports\<export_name>.txt`.

## Notes
- The script requires Node.js and the `cheerio` package for HTML parsing.
- Only message text is extracted (media-only messages are ignored unless they have text).
- Service messages (like date separators) are included as plain text.

## Troubleshooting

### "The system cannot find the file specified." error

If you see this error after a successful extraction (i.e., you see a message like `Extracted XXXX messages to S:\Coding\telegram-message-exporter\Exports\<export_name>.txt`), and the output file is present, you can safely ignore it. This error is not caused by the script or batch file, but may be due to how the script was launched (for example, from a shortcut with an incorrect working directory) or from the terminal environment. The extraction is complete as long as the output file exists at the specified location.
