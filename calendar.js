import { google } from 'googleapis';
import { readFile } from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

async function authorize() {
  const credentials = JSON.parse(await readFile(KEY_PATH, 'utf-8'));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });
  return auth;
}

// Export auth for use in your calendar functions
export default authorize;