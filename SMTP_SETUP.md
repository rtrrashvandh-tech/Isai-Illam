# SMTP Email Configuration Guide

To enable email sending with PDF attachments, you need to configure SMTP settings.

## Option 1: Gmail SMTP (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Isai Illam Registration" as the name
   - Copy the 16-character app password

3. **Set Environment Variables**:

### For Local Development (.env file):
Create a `.env` file in the root directory:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-character-app-password
EMAIL_FROM=your-email@gmail.com
```

### For Netlify Deployment:
1. Go to Netlify Dashboard → Your Site → Site settings → Environment variables
2. Add these variables:
   - `SMTP_HOST` = `smtp.gmail.com`
   - `SMTP_PORT` = `587`
   - `SMTP_USER` = `your-email@gmail.com`
   - `SMTP_PASS` = `your-16-character-app-password`
   - `EMAIL_FROM` = `your-email@gmail.com`

## Option 2: Other SMTP Providers

### Outlook/Hotmail:
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
EMAIL_FROM=your-email@outlook.com
```

### SendGrid:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=your-verified-sender@example.com
```

### Mailgun:
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
EMAIL_FROM=your-verified-sender@example.com
```

## Testing

After configuring SMTP:
1. Restart Netlify Dev: `npm run start`
2. Submit a test registration
3. Check the terminal logs for:
   - `✅ Email sent: <message-id>` (success)
   - Or `📧 Email sending skipped` (if SMTP not configured)

## Troubleshooting

- **Connection refused**: Check SMTP_HOST and SMTP_PORT are correct
- **Authentication failed**: Verify SMTP_USER and SMTP_PASS are correct
- **Email not received**: Check spam folder, verify EMAIL_FROM is correct

## Security Note

⚠️ **Never commit `.env` file to git!** It's already in `.gitignore`.

For production, always use environment variables in Netlify Dashboard, never hardcode credentials.

