// index.js

// 1. Load required modules
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load .env variables

// 2. Load config.json file
const configPath = path.join(__dirname, 'config.json');
let config;

try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  console.log(`✅ Config file loaded. Found ${config.imapAccounts.length} inbox(es):`);
  config.imapAccounts.forEach((account, i) => {
    console.log(`${i + 1}. ${account.label} – ${account.email}`);
  });
} catch (err) {
  console.error('❌ Failed to load config.json:', err.message);
  process.exit(1);
}

// 3. Check Chatbase API keys
if (process.env.CHATBASE_API_KEY && process.env.CHATBASE_AGENT_ID) {
  console.log('✅ Chatbase API credentials loaded.');
} else {
  console.warn('⚠️ Missing Chatbase API key or agent ID. Check your .env file!');
}
