# Service Image Verification Script

## Purpose

This script verifies that service images are synchronized between the homepage `serviceBoxes` and the actual service records in the database. It identifies mismatches and provides clear instructions for updating them.

## Problem it Solves

The homepage uses `homepageData.serviceBoxes[].image.url` for service images, while the main service page uses `service.displayImage.url`. These can get out of sync, causing different images to appear on different pages.

## How it Works

1. **Fetches homepage data** - Gets all service boxes from the homepage CMS data
2. **Fetches all services** - Gets all service records from the database
3. **Compares images** - Checks if each service's `displayImage` matches its serviceBox image
4. **Reports mismatches** - Shows which services need updates with exact MongoDB commands

## Usage

### Prerequisites

- The CMS backend must be running (default: `http://localhost:5500`)
- Node.js must be installed
- The `NEXT_PUBLIC_CMS_API_URL` environment variable should be set (defaults to localhost:5500)

### Running the Script

From the project root directory:

```bash
# Make sure the backend is running first
npm run dev:all

# In another terminal, run the verification script
node scripts/sync-service-images.js
```

### What to Expect

The script will output:

- Number of serviceBoxes found
- Number of services found
- Verification results for each service (✓ correct, ✗ mismatch, ⚠ no match)
- A summary of results
- MongoDB commands to fix mismatches (if any)

Example output when mismatches are found:

```text
======================================================================
IMAGE VERIFICATION RESULTS
======================================================================

✗  3D Modelling, Rendering & Walkthrough
   Slug: 3d-modelling
   Status: MISMATCH
   Current:  none
   Expected: https://cdn.example.com/image.jpg

✓  BIM Services
   Status: CORRECT
   Image: https://cdn.example.com/correct-image.jpg

======================================================================
SUMMARY
======================================================================
  ✓ Correct:   3 service(s)
  ✗  Mismatch:  5 service(s)
  ⚠  No Match:  0 service(s)
  Total:       8 service(s)
======================================================================

📋 MANUAL UPDATE REQUIRED
======================================================================
...MongoDB commands provided...
```

## Updating Mismatched Images

### Option 1: Via CMS Admin Panel

1. Copy the expected URL from the script output
2. Log into the CMS admin panel
3. Navigate to Services
4. Find the service by its slug
5. Update the "Display Image" field with the expected URL
6. Save the service

### Option 2: Via MongoDB (Faster for Multiple Updates)

Copy and run the MongoDB commands provided by the script:

```javascript
db.services.updateOne(
    { slug: "360-view" },
    { $set: { "displayImage.url": "https://cdn.example.com/image.jpg" } },
);
```

To update all services at once via MongoDB shell:

```bash
mongosh <your-connection-string>
use <your-database-name>

# Paste all the updateOne commands from the script output
```

## Status Codes

- **✓ CORRECT** - Service image matches homepage image, no action needed
- **✗ MISMATCH** - Service image doesn't match homepage image, update required
- **⚠ NO MATCH** - Service has no matching entry in homepage serviceBoxes

## Important Notes

- The script **does not** automatically update images (CMS has no public update API)
- The `main-services` service is automatically skipped
- Services without a matching serviceBox entry are reported but not counted as errors
- The script exits with code 1 if mismatches are found, code 0 if all are correct

## Troubleshooting

### "No serviceBoxes found in homepage data"

- Check that your homepage has service boxes configured in the CMS
- Verify the CMS backend is running and accessible at the correct URL

### "No services found"

- Check that you have services in your database
- Verify the CMS backend API is responding

### "No matching serviceBox for: [Service Name]"

- The service exists but has no entry in homepage serviceBoxes
- Either add it to serviceBoxes in the CMS, or this is expected for services not shown on homepage

## When to Run This Script

Run this script when:

- You've updated service images in the homepage CMS
- You notice different images on homepage vs `/mainservice` page
- After migrating or importing service data
- Before deploying to production to ensure consistency
- As part of a CI/CD pipeline to catch sync issues

## Related Files

- `/src/app/HomeClient.js` (lines 706-744) - Uses `homepageData.serviceBoxes`
- `/src/app/mainservice/MainServiceClient.js` (lines 228-264) - Uses `service.displayImage`
- `/cms/backend/src/models/Service.ts` - Service model definition
- `/cms/backend/src/routes/service.routes.ts` - Service API routes
