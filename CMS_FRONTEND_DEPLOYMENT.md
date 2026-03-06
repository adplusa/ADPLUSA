# CMS Frontend Deployment Guide (Vercel)

## Issue
The CMS frontend is throwing 404 errors on route refresh (e.g., `/dashboard/media`, `/login`).

## Root Cause
Vercel is not configured to handle SPA (Single Page Application) routing. When you refresh on a nested route, Vercel tries to find a physical file instead of serving `index.html`.

## Solution

### Step 1: Verify Vercel Project Configuration
1. Go to your Vercel dashboard
2. Find the CMS frontend project (e.g., `adpl-agu4`)
3. Go to **Settings** → **General**
4. Verify:
   - **Root Directory**: Should be `cms/frontend` (NOT the project root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Verify vercel.json
The `cms/frontend/vercel.json` file is already configured with:
- SPA routing rewrites (all routes → `/index.html`)
- Static asset preservation (`/assets/*` files are NOT rewritten)
- Proper cache headers
- Clean URLs enabled

### Step 3: Redeploy
1. Push the latest changes:
   ```bash
   git add cms/frontend/vercel.json cms/frontend/.vercelignore
   git commit -m "Fix CMS frontend SPA routing on Vercel"
   git push
   ```

2. Trigger a redeploy:
   - Option A: Push to your main branch (auto-deploys)
   - Option B: Go to Vercel dashboard → Click "Redeploy"

3. Wait for deployment to complete (usually 2-3 minutes)

### Step 4: Test
1. Go to `https://adpl-agu4.vercel.app/login`
2. Refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
3. Should NOT see 404 error
4. Try other routes: `/dashboard`, `/dashboard/media`, etc.

## If Still Getting 404

### Check 1: Root Directory Setting
- Vercel must be set to deploy from `cms/frontend` directory
- NOT from the project root

### Check 2: Build Output
- Verify `dist/index.html` exists after build
- Check that assets are in `dist/assets/`

### Check 3: Clear Vercel Cache
1. Go to Vercel dashboard
2. Project Settings → Deployments
3. Click the three dots on the latest deployment
4. Select "Redeploy" (this clears cache)

### Check 4: Browser Cache
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Or open in incognito/private window

## Configuration Files

### vercel.json
Located at: `cms/frontend/vercel.json`
- Handles SPA routing
- Configures cache headers
- Specifies build settings

### .vercelignore
Located at: `cms/frontend/.vercelignore`
- Tells Vercel which files to ignore during deployment
- Reduces deployment size

## Expected Behavior After Fix

✅ `/login` - Works on refresh
✅ `/dashboard` - Works on refresh
✅ `/dashboard/media` - Works on refresh
✅ `/dashboard/projects` - Works on refresh
✅ Static assets load correctly
✅ No 404 errors on page refresh
