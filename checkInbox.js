// checkInbox.js

const { ImapFlow } = require('imapflow');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

async function checkInbox(account) {
  console.log(`\n📥 Connecting to inbox: ${account.label} (${account.email})`);

  const client = new ImapFlow({
    host: account.imapHost,
    port: account.imapPort,
    secure: false, // use true if port is 993 (SSL), false for 143 (STARTTLS)
    auth: {
      user: account.username,
      pass: account.password
    }
  });

  await client.connect();
  console.log('✅ Connected.');

  // Select and lock the inbox
  let lock = await client.getMailboxLock('INBOX');
  try {
    // Search for unseen (unread) emails
    let messages = await client.search({ seen: false });

    if (messages.length === 0) {
      console.log('📭 No unread emails found.');
    } else {
      console.log(`📬 Found ${messages.length} unread email(s).`);

      for await (let message of client.fetch(messages, { envelope: true, source: true })) {
        console.log(`---\n📧 Subject: ${message.envelope.subject}`);
        console.log(`👤 From: ${message.envelope.from.map(f => f.address).join(', ')}`);
      }
    }
  } finally {
    lock.release();
  }

  await client.logout();
  console.log('🔌 Disconnected.\n');
}

// Run it for all accounts
(async () => {
  for (const account of config.imapAccounts) {
    try {
      await checkInbox(account);
    } catch (err) {
      console.error(`❌ Failed for ${account.label}:`, err.message);
    }
  }
})();
