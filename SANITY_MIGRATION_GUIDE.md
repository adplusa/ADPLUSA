# Sanity CMS → Custom CMS Migration Guide

## Overview

This guide outlines the process for migrating content from **Sanity CMS** to your **custom MongoDB-based CMS** located in `/cms`.

---

## Table of Contents

1. [Architecture Comparison](#architecture-comparison)
2. [Schema Mapping](#schema-mapping)
3. [Export Data from Sanity](#export-data-from-sanity)
4. [Transform & Import Data](#transform--import-data)
5. [Asset Migration](#asset-migration)
6. [Update Frontend Integration](#update-frontend-integration)
7. [Verification Checklist](#verification-checklist)

---

## Architecture Comparison

| Aspect                | Sanity CMS                          | Custom CMS                    |
| --------------------- | ----------------------------------- | ----------------------------- |
| **Database**          | Hosted (Sanity Cloud)               | MongoDB                       |
| **Query Language**    | GROQ                                | MongoDB queries / REST API    |
| **Schema Definition** | JavaScript (defineType/defineField) | Mongoose Schemas (TypeScript) |
| **Image Handling**    | Sanity CDN (`@sanity/image-url`)    | AWS S3/CloudFront             |
| **Rich Text**         | Portable Text (blocks)              | HTML or Markdown              |
| **Studio**            | Sanity Studio (embedded)            | React admin panel (Vite)      |

---

## Schema Mapping

### Sanity Schemas → Custom CMS Schemas

| Sanity Type         | Custom CMS Model    | Notes                                   |
| ------------------- | ------------------- | --------------------------------------- |
| `eventType`         | HomePage?           | Main page content                       |
| `aboutPage`         | `About`             | About page                              |
| `contactPage`       | `Contact`           | Contact info                            |
| `faqSection`        | `FAQ`               | FAQ entries                             |
| `projectPage`       | `Project`           | Projects listing                        |
| `projectInternal*`  | `Project` (unified) | Individual projects → single collection |
| `mainServiceType`   | `Service`           | Services listing                        |
| `servicesInternal*` | `Service` (unified) | Individual services → single collection |

### Field Type Mapping

| Sanity Field Type       | Custom CMS Equivalent                   |
| ----------------------- | --------------------------------------- |
| `string`                | `String`                                |
| `text`                  | `String`                                |
| `number`                | `Number`                                |
| `boolean`               | `Boolean`                               |
| `array`                 | `Array` / embedded subdocuments         |
| `image`                 | `{ url: String, darkModeUrl?: String }` |
| `reference`             | MongoDB ObjectId reference              |
| `slug`                  | `String` with unique constraint         |
| Portable Text (`block`) | HTML string (convert during migration)  |

---

## Export Data from Sanity

> ⚠️ **Important**: After the Sanity removal migration, only **Method 3 (HTTP API)** is available. Methods 1 and 2 required `sanity.config.js` and `sanity.cli.js` which have been removed from the project.

### ~~Method 1: CLI Export~~ (No Longer Available)

> ❌ **Deprecated**: This method requires Sanity CLI configuration files which have been removed.

```bash
# These commands NO LONGER WORK after the migration
# npx sanity dataset export production sanity-export.tar.gz
```

### ~~Method 2: GROQ Query Export~~ (No Longer Available)

> ❌ **Deprecated**: This method requires Sanity CLI which is no longer configured.

```bash
# These commands NO LONGER WORK after the migration
# npx sanity documents query "*" > all-docs.ndjson
```

### Method 3: HTTP API (✅ Active - Used by Migration Script)

This is the **only available method** and is what the migration script uses. It connects directly to the Sanity API without requiring local configuration files.

**Run the migration script:**

```bash
cd cms/backend
npm run migrate:sanity
```

The script (`cms/backend/src/scripts/migrate-sanity.ts`) uses the `@sanity/client` library to fetch data via HTTP API:

```javascript
// This is implemented in migrate-sanity.ts
import { createClient } from "@sanity/client";

const sanityClient = createClient({
    projectId: process.env.SANITY_PROJECT_ID || "5ippxm43",
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN || undefined,
    useCdn: false,
});

// Fetch all documents of a type
const docs = await sanityClient.fetch('*[_type == "contactPage"]');
```

**Required Environment Variables** (in `cms/backend/.env`):

```env
MONGODB_URI=your_mongodb_connection_string
SANITY_PROJECT_ID=5ippxm43
SANITY_DATASET=production
SANITY_API_TOKEN=        # Optional, only needed for draft content
```

---

## Transform & Import Data

Create a migration script to transform Sanity data to match your custom CMS schemas:

### Example: Migration Script

```javascript
// cms/backend/src/scripts/migrate-sanity.ts

import { MongoClient } from "mongodb";
import * as fs from "fs";
import * as readline from "readline";
import { parsePortableText } from "./portable-text-parser"; // You'll need to implement this

const MONGO_URI =
    process.env.MONGODB_URI || "mongodb://localhost:27017/architect-cms";

async function migrate() {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db();

    // Read NDJSON file line by line
    const fileStream = fs.createReadStream("sanity-export/data.ndjson");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    for await (const line of rl) {
        const doc = JSON.parse(line);

        // Skip system documents
        if (
            doc._type.startsWith("system.") ||
            doc._type.startsWith("sanity.")
        ) {
            continue;
        }

        // Transform based on document type
        switch (doc._type) {
            case "contactPage":
                await migrateContact(db, doc);
                break;
            case "aboutPage":
                await migrateAbout(db, doc);
                break;
            case "faqSection":
                await migrateFAQ(db, doc);
                break;
            // Handle project* types
            default:
                if (doc._type.startsWith("projectInternal")) {
                    await migrateProject(db, doc);
                } else if (doc._type.startsWith("servicesInternal")) {
                    await migrateService(db, doc);
                }
        }
    }

    await client.close();
    console.log("Migration complete!");
}

async function migrateContact(db, sanityDoc) {
    const contact = {
        title: sanityDoc.mainHeading || "Contact Us",
        description: sanityDoc.seoDescription,
        contactInfo: {
            email: sanityDoc.contactInfo?.email,
            phone: sanityDoc.contactInfo?.phone,
            address: sanityDoc.contactInfo?.address,
        },
        seo: {
            title: sanityDoc.seoTitle,
            description: sanityDoc.seoDescription,
        },
        status: "published",
        createdAt: new Date(sanityDoc._createdAt),
        updatedAt: new Date(sanityDoc._updatedAt),
    };

    await db.collection("contacts").updateOne(
        {}, // Singleton - update the only document
        { $set: contact },
        { upsert: true }
    );
}

// Implement similar functions for other content types...

migrate().catch(console.error);
```

### Key Transformations Needed

1. **Portable Text → HTML**
   Sanity uses Portable Text (array of blocks). Convert to HTML:

    ```bash
    npm install @portabletext/to-html
    ```

    ```javascript
    import { toHTML } from "@portabletext/to-html";

    const html = toHTML(portableTextBlocks);
    ```

2. **Image References → URLs**
   Transform Sanity image references to actual URLs:

    ```javascript
    import imageUrlBuilder from "@sanity/image-url";

    const builder = imageUrlBuilder({ projectId, dataset });
    const imageUrl = builder.image(imageRef).url();
    ```

3. **Slugs**
   Ensure slugs are extracted from Sanity's slug object:

    ```javascript
    const slug = sanityDoc.slug?.current || generateSlug(sanityDoc.title);
    ```

---

## Asset Migration

### Option 1: Manual Migration

1. Extract images from the Sanity export `.tar.gz`
2. Upload to AWS S3 bucket (`architect-cms-images-adpl`)
3. Update image URLs in the migrated documents

### Option 2: Scripted Migration

```javascript
// scripts/migrate-assets.js
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";

const s3 = new S3Client({ region: "ap-south-1" });
const BUCKET = "architect-cms-images-adpl";
const CLOUDFRONT_URL = "https://d1umvm78v43sxr.cloudfront.net";

async function uploadImage(localPath, s3Key) {
    const fileBuffer = fs.readFileSync(localPath);

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: "image/jpeg", // Determine from file
        })
    );

    return `${CLOUDFRONT_URL}/${s3Key}`;
}

// Walk through extracted images folder and upload
async function migrateAssets(imagesDir) {
    const files = fs.readdirSync(imagesDir);
    const urlMap = {};

    for (const file of files) {
        const localPath = path.join(imagesDir, file);
        const s3Key = `migrated/${file}`;
        const url = await uploadImage(localPath, s3Key);
        urlMap[file] = url;
    }

    // Save URL mapping for use in data migration
    fs.writeFileSync("asset-url-map.json", JSON.stringify(urlMap, null, 2));
}
```

---

## Update Frontend Integration

### Current Sanity Client Usage

```javascript
// Current: src/sanity/lib/client.js
import { createClient } from '@sanity/client';
export const client = createClient({ ... });

// Usage in pages
const data = await client.fetch(`*[_type == "contactPage"][0]`);
```

### New Custom CMS API Usage

```javascript
// New: src/lib/cms-client.js
const API_BASE =
    process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:5000/api";

export async function fetchContact() {
    const res = await fetch(`${API_BASE}/contact`);
    return res.json();
}

export async function fetchServices() {
    const res = await fetch(`${API_BASE}/services`);
    return res.json();
}

export async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
}
```

### Image URL Helper

```javascript
// Replace urlFor from @sanity/image-url
// New images are already full URLs from CloudFront

// Old:
import urlFor from "./helpers/sanity";
const src = urlFor(data.image).url();

// New:
const src = data.image?.url;
const darkSrc = data.image?.darkModeUrl;
```

---

## Verification Checklist

### Pre-Migration

- [ ] Backup current Sanity dataset
- [ ] Document all content types in use
- [ ] Ensure custom CMS is running and accessible
- [ ] Test database connection

### Migration

- [ ] Export Sanity data successfully
- [ ] Transform all document types
- [ ] Migrate all assets to S3
- [ ] Import data into MongoDB
- [ ] Verify record counts match

### Post-Migration

- [ ] Update frontend to use new CMS API
- [ ] Test all pages render correctly
- [ ] Verify images load from CloudFront
- [ ] Check dark mode images work
- [ ] Test form submissions
- [ ] Review SEO metadata on all pages
- [ ] Update environment variables

### Cleanup

- [ ] Remove `@sanity/client` dependencies (when ready)
- [ ] Remove `/src/sanity` directory
- [ ] Remove `sanity.config.js` and `sanity.cli.js`
- [ ] Remove `/studio` route
- [ ] Update `.env` to remove Sanity variables

---

## Rollback Plan

If issues occur during migration:

1. Frontend can temporarily switch back to Sanity by restoring the original client code
2. Keep Sanity project active for at least 30 days post-migration
3. Maintain a backup of the original `src/sanity` directory

---

## Timeline Recommendation

| Phase       | Duration | Tasks                       |
| ----------- | -------- | --------------------------- |
| **Phase 1** | 1 day    | Export data, set up scripts |
| **Phase 2** | 2-3 days | Transform & import data     |
| **Phase 3** | 1-2 days | Migrate assets              |
| **Phase 4** | 2-3 days | Update frontend integration |
| **Phase 5** | 1 day    | Testing & verification      |
| **Phase 6** | Ongoing  | Monitoring & cleanup        |

**Total Estimated Time: 7-10 days**
