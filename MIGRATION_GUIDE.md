# MongoDB Migration & Image Migration Guide

## Overview
This guide walks you through migrating all data from Sanity CMS to MongoDB and uploading images to S3.

## Prerequisites
- MongoDB connection string (MONGO_DB_URI)
- Sanity project ID and dataset
- AWS S3 credentials
- Backend environment variables configured

## Step 1: Prepare Environment Variables

Make sure your `.env` file in `cms/backend/` has:
```
MONGO_DB_URI=your_mongodb_connection_string
SANITY_PROJECT_ID=your_sanity_project_id
SANITY_DATASET=your_sanity_dataset
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=cms-media-prod-606876784342
```

## Step 2: Run Full Migration

Navigate to the backend directory:
```bash
cd cms/backend
```

Install dependencies if not already done:
```bash
npm install
```

Run the migration script:
```bash
npm run migrate
```

This will:
1. Connect to MongoDB
2. Fetch all data from Sanity CMS
3. Download all images from Sanity
4. Upload images to S3
5. Transform and store all data in MongoDB
6. Create collections for: Homepage, Projects, Services, FAQ, About, Contact, General Settings, etc.

## Step 3: Verify Migration

Check the migration output for:
- ✓ Homepage migrated
- ✓ Projects count
- ✓ Services count
- ✓ Images uploaded successfully
- ✓ All other collections

## Step 4: Test Data in CMS Frontend

1. Start the CMS frontend:
```bash
cd cms/frontend
npm run dev
```

2. Login with credentials:
   - Username: `admin`
   - Password: `admin123456`

3. Verify all data appears in the dashboard

## Step 5: Test Data in Main Frontend

1. Start the main frontend:
```bash
npm run dev
```

2. Visit pages to verify:
   - Homepage loads with migrated data
   - Projects page shows all projects
   - Services page shows all services
   - About, FAQ, Contact pages load correctly

## Step 6: Deploy Backend

If everything looks good, deploy the backend:
```bash
cd cms/backend
npm run deploy
```

## Troubleshooting

### Images not uploading
- Check S3 bucket name is correct
- Verify AWS credentials have S3 permissions
- Check CloudFront distribution is configured

### MongoDB connection fails
- Verify MONGO_DB_URI is correct
- Check MongoDB is accessible from your network
- Ensure database user has proper permissions

### Data not appearing in CMS
- Check MongoDB connection in backend
- Verify collections were created
- Check browser console for API errors

### Sanity data not fetching
- Verify SANITY_PROJECT_ID and SANITY_DATASET
- Check Sanity API token if required
- Ensure Sanity project is accessible

## Notes
- The migration script handles image transformation and S3 upload
- All SEO fields are preserved
- Slugs are auto-generated from titles if not provided
- The script is idempotent - can be run multiple times safely
