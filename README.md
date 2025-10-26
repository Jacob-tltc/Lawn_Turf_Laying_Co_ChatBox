# Lawn_Turf_Laying_Co_ChatBox
This repository stores code for automation reading all incoming emails with customers' enquiries, generating replies by a AI chat box, and sending those replies back to a customer. 

# Lawn Turf Laying Co. – Customer Email Automation

This project automates incoming email handling for The Lawn Turf Laying Co. using a trained AI chatbot.

## 📌 Purpose

To reduce the time spent replying to customer enquiries by using an intelligent assistant that:
- Monitors multiple inboxes (e.g., `mail@`, `info@`)
- Parses and understands incoming enquiries
- Sends smart replies via email using Chatbase AI
- Plans to check calendar availability (Google Calendar integration coming soon)

## 🔧 Tech Stack

- Node.js (automation engine)
- IMAP & SMTP (email reading/sending)
- Chatbase API (AI replies)
- Google Calendar API (coming soon)

## 📁 Folder Structure
/project-root
├── config.json # Email settings and mailbox definitions
├── index.js # Main automation script
├── .env # API keys (not included in repo)
├── .gitignore # Prevents .env from being uploaded
└── README.md # This file

## ⚙️ Setup Instructions

1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file (based on `.env.example`)
4. Populate `config.json` with Jon’s email info
5. Run the script with `node index.js`

## 🛡️ Security Notes

- API keys and passwords are stored in `.env` and `config.json`
- Do not publish this repo publicly unless credentials are removed or rotated

## 🤖 AI Configuration

This project uses a custom-trained AI via [Chatbase.co](https://chatbase.co), designed to:
- Answer customer FAQs about turf installation
- Confirm availability (coming soon)
- Help customers prepare for the installation

## 🧠 Future Plans

- Add smart appointment booking using Google Calendar
- Dashboard for logs and insights
- WhatsApp or SMS integration (for team reminders)

---

> Built with care for Jon’s team by Jacob Litwin (gjl.it3@gmail.com)
