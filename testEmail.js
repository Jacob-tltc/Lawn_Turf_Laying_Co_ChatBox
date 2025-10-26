import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testSMTP() {
  console.log("🚀 Testing SMTP...");

  const transporter = nodemailer.createTransport({
    host: "us2.smtp.mailhostbox.com",
    port: 587,
    secure: false, // port 587 uses STARTTLS
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS
    }
  });

  const info = await transporter.sendMail({
    from: `"Test Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.TEST_RECIPIENT || process.env.EMAIL_USER,
    subject: "SMTP Test Email",
    text: "This is a test email sent from Node.js using SMTP."
  });

  console.log(`✅ SMTP: Message sent: ${info.messageId}`);
}

async function testIMAP() {
  console.log("📥 Testing IMAP...");

  const client = new ImapFlow({
    host: "us2.imap.mailhostbox.com",
    port: 993,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await client.connect();

  let lock = await client.getMailboxLock("INBOX");
  try {
    console.log(`✅ IMAP: Connected. Total messages: ${client.mailbox.exists}`);
  } finally {
    lock.release();
  }

  await client.logout();
  console.log("🔌 IMAP: Disconnected.");
}

(async () => {
  try {
    await testSMTP();
    await testIMAP();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();