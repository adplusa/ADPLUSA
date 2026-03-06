# Vercel Setup Instructions for CMS Frontend

## Problem
Page reloads on routes like `/dashboard/services` return 404 errors.

## Solution
Configure Vercel to use the correct Root Directory for the monorepo.

## Steps to Fix in Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/dashboard
2. Select your project (adpl-agu4)
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Click **Edit**
6. Set Root Directory to: `cms/frontend`
7. Click **Save**
8. Go to **Deployments** tab
9. Click **Redeploy** on the latest deployment

## Verify Configuration

After redeployment, the following should work:
- Navigate to: https://adpl-agu4.vercel.app/dashboard/services
- Refresh the page (F5 or Cmd+R)
- Should load without 404 error

## How It Works

The `cms/frontend/vercel.json` file contains:
- SPA routing rewrites (all routes → /index.html)
- Proper cache headers
- Asset handling

When Root Directory is set to `cms/frontend`, Vercel will:
1. Use the vercel.json in that directory
2. Run `npm install` and `npm run build` in that directory
3. Deploy the `dist` folder
4. Apply the routing rules correctly

## Alternative: Use Vercel CLI

If you prefer command line:

```bash
cd cms/frontend
vercel --prod
```

This will deploy only the frontend directory.
