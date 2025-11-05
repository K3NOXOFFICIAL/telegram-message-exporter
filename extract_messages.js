// Telegram HTML export message extractor
// Usage: Install cheerio with 'npm install cheerio' if not present
// Run: node extract_messages.js

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');



const readline = require('readline');
const EXPORT_DIR = process.env.EXPORT_DIR || 'S:/Coding/telegram-message-exporter/@Exports';

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function main() {
  const srcFolder = await askQuestion('Enter the path to the Telegram export folder: ');
  const exportName = await askQuestion('Enter the export name (will be used as the .txt filename): ');
  const baseDir = path.resolve(srcFolder);
  const outFile = path.join(EXPORT_DIR, exportName + '.txt');

  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }

  // Find all files matching messages*.html in the directory
  let allFiles;
  try {
    allFiles = fs.readdirSync(baseDir);
  } catch (e) {
    console.error('Could not read directory:', baseDir);
    process.exit(1);
  }
  const files = allFiles
    .filter(f => /^messages\d*\.html$/.test(f) || f === 'messages.html')
    .sort((a, b) => {
      if (a === 'messages.html') return -1;
      if (b === 'messages.html') return 1;
      const aNum = parseInt(a.match(/^messages(\d*)\.html$/)[1] || '1', 10);
      const bNum = parseInt(b.match(/^messages(\d*)\.html$/)[1] || '1', 10);
      return aNum - bNum;
    });

  if (files.length === 0) {
    console.error('No messages*.html files found in', baseDir);
    process.exit(1);
  }

  let allMessages = [];
  for (const fname of files) {
    const fpath = path.join(baseDir, fname);
    allMessages = allMessages.concat(extractMessagesFromFile(fpath));
  }

  fs.writeFileSync(outFile, allMessages.join('\n'), 'utf8');
  console.log(`Extracted ${allMessages.length} messages to ${outFile}`);
}

function extractMessagesFromFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);
  const messages = [];
  $('.message').each((i, el) => {
    const $msg = $(el);
    if ($msg.hasClass('service')) {
      // Service message (date or event)
      const dateText = $msg.find('.body.details').text().trim();
      if (dateText) messages.push(dateText);
      return;
    }
    const time = $msg.find('.pull_right.date.details').first().text().trim();
    const sender = $msg.find('.from_name').first().text().trim();
    const text = $msg.find('.text').first().text().trim();
    if (text) {
      let line = '';
      if (sender) {
        line += `[${time}] ${sender}: ${text}`;
      } else {
        line += `[${time}]: ${text}`;
      }
      messages.push(line);
    }
  });
  return messages;
}


if (require.main === module) {
  main();
}