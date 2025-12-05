# Gmail SMTP Setup Guide

To start sending emails via your Gmail account, follow these steps:

## 1. Get Your App Password

If you haven't already:
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Create a new app password for "Mail" and copy the 16-character code.

## 2. Update Environment Variables

Open your `.env.local` file and add the following:

```bash
# Gmail SMTP Settings
GMAIL_USER=gym.it.digital@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password_here
```

Replace `your_16_char_app_password_here` with the password you copied.

## 3. Restart the Server

For the changes to take effect, you must restart your development server:

```bash
npm run dev
```

## 4. Test It

Make a test purchase, and the email should arrive directly in your inbox!
