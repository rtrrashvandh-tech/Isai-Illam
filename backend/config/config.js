// Load .env from multiple locations (root and backend directory)
const path = require('path');
const fs = require('fs');

// Try root .env first (for Netlify Dev), then backend/.env
const rootEnv = path.resolve(__dirname, '../../.env');
const backendEnv = path.resolve(__dirname, '../.env');

if (fs.existsSync(rootEnv)) {
  require('dotenv').config({ path: rootEnv });
  console.log('📁 Loaded .env from root directory');
} else if (fs.existsSync(backendEnv)) {
  require('dotenv').config({ path: backendEnv });
  console.log('📁 Loaded .env from backend directory');
} else {
  require('dotenv').config(); // Try default location
  console.log('⚠️  No .env file found, using environment variables only');
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'rtrrashavndh@gmail.com',
  EXCEL_FILE_PATH: './registrations.xlsx'
};