import dotenv from 'dotenv';
dotenv.config();

if (process.env.BOT_ACTIVE !== 'true') {
  console.log("🤖 Bot is in standby mode (BOT_ACTIVE is not 'true'). Exiting safely.");
  process.exit(0);
}

import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { estimatePrice } from './pricingEngine.js'; // ✅ Correct import

dotenv.config();

const LOG_DIR = './logs';
const LOG_RETENTION_DAYS = 10;
await fs.mkdir(LOG_DIR, { recursive: true });

// Load config
const config = JSON.parse(await fs.readFile('./config.json', 'utf8'));

// --- Utility functions ---
function domainFromAddress(email) {
  return email.split('@')[1].toLowerCase();
}

function matchesAny(text, patterns) {
  return patterns.some(pattern => text.includes(pattern));
}

function getLogFilePath(inboxEmail) {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `${inboxEmail.replace(/[@.]/g, '_')}-log-${dateStr}.log`;
  return path.join(LOG_DIR, filename);
}

async function writeLog(inboxEmail, message) {
  const filepath = getLogFilePath(inboxEmail);
  const timestamp = new Date().toISOString();
  await fs.appendFile(filepath, `[${timestamp}] ${message}\n`);
}

async function cleanupOldLogs() {
  const files = await fs.readdir(LOG_DIR);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOG_RETENTION_DAYS);

  for (const file of files) {
    const match = file.match(/log-(\d{4}-\d{2}-\d{2})\.log$/);
    if (match) {
      const fileDate = new Date(match[1]);
      if (fileDate < cutoff) {
        await fs.unlink(path.join(LOG_DIR, file));
      }
    }
  }
}

// --- Main process ---
async function processEmails() {
  const imapUser = process.env.IMAP_USER;

  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT),
    secure: true,
    auth: {
      user: imapUser,
      pass: process.env.IMAP_PASSWORD
    }
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  await client.connect();
  console.log(`📥 Connected to IMAP as ${imapUser}`);
  const logEmail = imapUser;

  let lock = await client.getMailboxLock('INBOX');
  try {
    let searchCriteria;

    if (config.testFromEmail && config.testFromEmail.trim() !== "") {
      console.log(`🔍 Test mode: searching for unseen emails from ${config.testFromEmail}`);
      searchCriteria = { seen: false, from: config.testFromEmail.trim() };
    } else {
      console.log("🔍 Normal mode: searching for all unseen emails");
      searchCriteria = { seen: false };
    }

    const unseen = await client.search(searchCriteria);
    console.log(`🔎 Found ${unseen.length} unseen emails, processing up to ${config.maxEmailsToProcess}...`);
    await writeLog(logEmail, `Found ${unseen.length} unseen emails`);

    const toProcess = unseen.slice(0, config.maxEmailsToProcess);

    for (let seq of toProcess) {
      const message = await client.fetchOne(seq, { envelope: true, source: true, uid: true });
      const { envelope, source, uid } = message;
      const fromAddress = envelope.from[0].address.toLowerCase();
      const subject = (envelope.subject || '').toLowerCase();
      const domain = domainFromAddress(fromAddress);

      await writeLog(logEmail, `📨 Processing email UID ${uid} from ${fromAddress} | Subject: "${subject}"`);

      // Filtering logic
      if (config.ignore_senders_domains.includes(domain)) {
        await writeLog(logEmail, `⚠️ Ignored blocked domain: ${domain}`);
        continue;
      }

      if (config.approved_senders_domains.length > 0 && !config.approved_senders_domains.includes(domain)) {
        await writeLog(logEmail, `⚠️ Skipped unapproved domain: ${domain}`);
        continue;
      }

      if (matchesAny(subject, config.ignore_subject_keywords)) {
        await writeLog(logEmail, `⚠️ Ignored due to blocked subject keyword.`);
        continue;
      }

      const parsed = await simpleParser(source);
      const rawBodyText = parsed.text || '';
      const bodyText = rawBodyText.toLowerCase(); // only used for filters

      if (matchesAny(bodyText, config.ignore_body_keywords)) {
        await writeLog(logEmail, `⚠️ Ignored due to blocked body keyword.`);
        continue;
      }

      if (config.approved_subject_keywords.length > 0 && !matchesAny(subject, config.approved_subject_keywords)) {
        await writeLog(logEmail, `⚠️ Skipped: subject lacks approved keywords.`);
        continue;
      }

      if (config.approved_body_keywords.length > 0 && !matchesAny(bodyText, config.approved_body_keywords)) {
        await writeLog(logEmail, `⚠️ Skipped: body lacks approved keywords.`);
        continue;
      }

      if (config.maxBodyLength && bodyText.length > config.maxBodyLength) {
        await writeLog(logEmail, `⚠️ Skipped: body too long.`);
        continue;
      }

      // Inject estimate (if applicable)
      const priceResult = estimatePrice(rawBodyText);
      const modifiedBody = `PLEASE NOTE: The following estimate is based on our internal pricing logic:\n\n${priceResult.comment}\n\n---\n\nOriginal message:\n${rawBodyText}`;

      await writeLog(logEmail, `🧠 Querying Chatbase...`);

      const chatbaseResponse = await fetch('https://www.chatbase.co/api/v1/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.CHATBASE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            { role: 'user', content: modifiedBody }
          ],
          chatbotId: process.env.CHATBASE_AGENT_ID,
          temperature: 0.7
        })
      });

      if (!chatbaseResponse.ok) {
        const errorText = await chatbaseResponse.text();
        await writeLog(logEmail, `❌ Chatbase error: ${chatbaseResponse.status} ${chatbaseResponse.statusText} | ${errorText}`);
        continue;
      }

      const chatbaseData = await chatbaseResponse.json();
      const replyText = chatbaseData.text || 'Thank you for your enquiry. We will get back to you shortly.';

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: fromAddress,
        subject: `RE: ${envelope.subject}`,
        text: replyText
      });

      await writeLog(logEmail, `✅ Replied to UID ${uid} | ${fromAddress}`);
    }
  } finally {
    lock.release();
    await client.logout();
    console.log('🔌 Disconnected from IMAP');
  }
}

await cleanupOldLogs();
processEmails().catch(console.error);