const nodemailer = require('nodemailer');
const config = require('../config/config');

// Check if SMTP is configured
const isSmtpConfigured = config.SMTP_HOST && config.SMTP_PORT && config.SMTP_USER && config.SMTP_PASS;

// Debug logging
console.log('📧 SMTP Configuration Check:');
console.log('   SMTP_HOST:', config.SMTP_HOST ? '✅ Set' : '❌ Missing');
console.log('   SMTP_PORT:', config.SMTP_PORT ? `✅ ${config.SMTP_PORT}` : '❌ Missing');
console.log('   SMTP_USER:', config.SMTP_USER ? '✅ Set' : '❌ Missing');
console.log('   SMTP_PASS:', config.SMTP_PASS ? '✅ Set' : '❌ Missing');

let transporter = null;

if (isSmtpConfigured) {
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: parseInt(config.SMTP_PORT),
    secure: parseInt(config.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
  console.log('✅ SMTP transporter configured successfully');
} else {
  console.warn('⚠️  SMTP not configured. Email sending will be skipped in development.');
  console.warn('   Create a .env file in the root directory with SMTP settings.');
}

const sendEmail = async ({ to, subject, text, attachments = [] }) => {
  // Skip email sending if SMTP is not configured (development mode)
  if (!isSmtpConfigured || !transporter) {
    console.log('📧 Email sending skipped (SMTP not configured):');
    console.log(`   To: ${to}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Attachments: ${attachments.length} file(s)`);
    return { messageId: 'skipped-dev-mode' };
  }

  try {
    const mailOptions = {
      from: `"Isai Illam" <${config.EMAIL_FROM}>`,
      to,
      subject,
      text,
      attachments,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };