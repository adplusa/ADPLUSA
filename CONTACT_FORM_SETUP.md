# Contact Form Setup Guide

## Current Status
❌ **Email service NOT configured** - Missing Gmail credentials

## Required Environment Variables

### 1. Backend (Lambda) - Add to AWS Lambda Environment Variables

Go to AWS Lambda Console → `cms-backend-api-CmsApiFunction-*` → Configuration → Environment variables

```env
GMAIL_USER=adplusa123@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### 2. Frontend (Vercel) - Add to Vercel Project Settings

Go to Vercel Dashboard → Project Settings → Environment Variables

```env
NEXT_PUBLIC_CMS_API_URL=https://szlvt92np8.execute-api.us-east-1.amazonaws.com
```

## How to Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Enable **2-Step Verification** (if not already enabled)
4. Search for "App passwords" or go to: https://myaccount.google.com/apppasswords
5. Click **Select app** → Choose "Mail"
6. Click **Select device** → Choose "Other (Custom name)"
7. Enter name: "ADPL CMS Backend"
8. Click **Generate**
9. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)
10. Use this as `GMAIL_APP_PASSWORD`

## Setup Steps

### Step 1: Configure Gmail App Password
1. Follow the steps above to generate an app password
2. Copy the password

### Step 2: Update Lambda Environment Variables
```bash
# Using AWS CLI
aws lambda update-function-configuration \
  --function-name cms-backend-api-CmsApiFunction-54Ij3aXugJpL \
  --environment "Variables={
    MONGODB_URI=mongodb+srv://...,
    JWT_SECRET=your-secret-key-here-change-in-production,
    AWS_ACCESS_KEY_ID=AKIAY2TFM23LM5ZV6PE2,
    AWS_SECRET_ACCESS_KEY=Ih1kg+Nj9xUjNaUzl77eRBT/68G4JP1K8wWBbwV8,
    AWS_BUCKET_NAME=cms-media-prod-606876784342,
    APP_AWS_REGION=us-east-1,
    AWS_CLOUDFRONT_URL=d33bb8xwyugywj.cloudfront.net,
    REDIS_URL=rediss://default:AS_nAAIncDFlM2Q2N2U3NzlhNWY0YTdhOGUzOWIzZDJkYWM2NDlmZXAxMTIyNjM@finer-goblin-12263.upstash.io:6379,
    GMAIL_USER=adplusa123@gmail.com,
    GMAIL_APP_PASSWORD=your-app-password-here
  }" \
  --profile default \
  --region us-east-1
```

OR manually in AWS Console:
1. Go to AWS Lambda Console
2. Find function: `cms-backend-api-CmsApiFunction-54Ij3aXugJpL`
3. Go to **Configuration** → **Environment variables**
4. Click **Edit**
5. Add:
   - Key: `GMAIL_USER`, Value: `adplusa123@gmail.com`
   - Key: `GMAIL_APP_PASSWORD`, Value: `[your-app-password]`
6. Click **Save**

### Step 3: Update Vercel Environment Variables
1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project: `adpl`
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   - Key: `NEXT_PUBLIC_CMS_API_URL`
   - Value: `https://szlvt92np8.execute-api.us-east-1.amazonaws.com`
   - Environment: Production, Preview, Development (select all)
5. Click **Save**
6. Go to **Deployments** → **Redeploy** latest deployment

## Testing

After configuration:

1. Go to: https://adpl.vercel.app/contact
2. Fill out the contact form
3. Submit
4. Check email at: adplusa123@gmail.com
5. You should receive an email with the inquiry

## Troubleshooting

### Email not received?
1. Check Lambda logs in CloudWatch
2. Look for errors like "GMAIL_USER: MISSING" or "GMAIL_APP_PASSWORD: MISSING"
3. Verify Gmail app password is correct
4. Check spam folder

### Form submission fails?
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_CMS_API_URL` is set in Vercel
3. Check Network tab for failed requests
4. Verify backend API is accessible

### Backend returns 500 error?
1. Check Lambda CloudWatch logs
2. Look for nodemailer errors
3. Verify Gmail credentials are correct
4. Check if 2-Step Verification is enabled on Gmail account

## Current Configuration

- **Backend API**: https://szlvt92np8.execute-api.us-east-1.amazonaws.com
- **Frontend**: https://adpl.vercel.app
- **CMS Admin**: https://adpl-agu4.vercel.app
- **Email Destination**: adplusa123@gmail.com (always) + dynamic email from CMS settings
