# Email Setup Guide - Resend Integration

This guide will help you set up email sending for gym-it digital product delivery.

## Step 1: Create a Resend Account

1. Go to [https://resend.com/signup](https://resend.com/signup)
2. Sign up for a **FREE account** (3,000 emails/month included)
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** in the sidebar
3. Click **Create API Key**
4. Name it: "gym-it-production" (or similar)
5. Select permission: **Full Access**
6. Copy the API key (starts with `re_...`)

## Step 3: Add Domain (Important!)

### Option A: Use Your Gmail for Testing (Quick Start)
Resend needs domain verification to send from `gym.it.digital@gmail.com`. For testing:

1. In Resend dashboard, you can send from `onboarding@resend.dev` first
2. Update `lib/email.ts` line 15 to:
   ```typescript
   from: 'gym-it <onboarding@resend.dev>',
   ```

### Option B: Verify Your Domain (Recommended for Production)
1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `gym-it.com` or purchase one)
4. Follow DNS verification instructions
5. Once verified, update `lib/email.ts` to use your domain:
   ```typescript
   from: 'gym-it <noreply@yourdomain.com>',
   ```

## Step 4: Add Environment Variables

Add these to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Site URL (for generating download links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to your production URL later
```

### Example:
```bash
RESEND_API_KEY=re_AbCdEf123456_your_actual_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 5: Restart Your Dev Server

After adding the environment variables:

```bash
# Stop the dev server (Ctrl+C)
npm run dev
```

## Step 6: Test the Email Flow

1. Go to http://localhost:3000/products
2. Add a product to cart
3. Go to checkout
4. Complete a test payment
5. Check the customer's email inbox for the download email!

## Email Template Features

The email includes:
- ✅ Beautiful HTML design with gym-it branding
- ✅ Order number
- ✅ List of all purchased products
- ✅ Direct download links for each product
- ✅ Professional footer with gym.it.digital@gmail.com sender
- ✅ Mobile-responsive design

## Troubleshooting

### Email not sending?
1. Check if `RESEND_API_KEY` is set in `.env.local`
2. Check server logs for errors (look for 📧 emoji)
3. Verify the API key is correct in Resend dashboard
4. Make sure you restarted the dev server after adding env vars

### Emails going to spam?
1. Verify your domain in Resend (Option B above)
2. Add SPF and DKIM records as instructed by Resend
3. Use a custom domain instead of Gmail address

### Need to change sender email?
1. Edit `lib/email.ts` line 15
2. Update the `from` field to your verified domain/email

## Production Checklist

Before going live:
- [ ] Verify your custom domain in Resend
- [ ] Update `NEXT_PUBLIC_SITE_URL` to your production URL
- [ ] Update sender email from test address to your domain
- [ ] Test with real email addresses
- [ ] Check spam folder placement
- [ ] Set up email monitoring in Resend dashboard

## Free Tier Limits

Resend FREE plan includes:
- 3,000 emails per month
- 100 emails per day
- API access
- Email logs and analytics

Perfect for small to medium businesses!

---

**Need Help?**
- Resend Docs: https://resend.com/docs
- Resend Support: support@resend.com
