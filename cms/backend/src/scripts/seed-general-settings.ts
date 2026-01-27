/**
 * Seed Script: General Settings
 *
 * This script uploads the default header logo, footer logo, and favicon to S3,
 * then creates the GeneralSettings record in MongoDB.
 *
 * Usage: npx ts-node src/scripts/seed-general-settings.ts
 *
 * Make sure to run this from the cms/backend directory with proper environment variables set.
 */

import * as fs from "fs";
import * as path from "path";
import mongoose from "mongoose";
import { config } from "../config/env";
import { uploadImageToS3 } from "../utils/s3";
import { GeneralSettings } from "../database/schemas/generalSettings.schema";

// Path to the Next.js public directory (relative from cms/backend)
const PUBLIC_DIR = path.resolve(__dirname, "../../../../public");

// Default assets to upload
const ASSETS = {
    headerLogo: {
        filename: "n.png",
        alt: "ADPL Consulting Logo",
    },
    footerLogo: {
        filename: "footer-logo.png",
        alt: "ADPL Consulting Footer Logo",
    },
    favicon: {
        filename: "icon.png",
        alt: "ADPL Consulting Favicon",
    },
};

async function seedGeneralSettings(): Promise<void> {
    console.log("🚀 Starting General Settings seed script...\n");

    // Connect to MongoDB
    console.log("📦 Connecting to MongoDB...");
    try {
        await mongoose.connect(config.mongodbUri);
        console.log("✅ Connected to MongoDB\n");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        process.exit(1);
    }

    // Check if GeneralSettings already exists
    const existingSettings = await GeneralSettings.findOne();
    if (existingSettings) {
        console.log(
            "⚠️  GeneralSettings already exists. Updating with new uploads...\n",
        );
    }

    // Upload assets to S3
    console.log("☁️  Uploading assets to S3...\n");

    const uploadedAssets: {
        headerLogo?: { url: string; alt: string };
        footerLogo?: { url: string; alt: string };
        favicon?: { url: string; alt: string };
    } = {};

    for (const [key, asset] of Object.entries(ASSETS)) {
        const filePath = path.join(PUBLIC_DIR, asset.filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  File not found: ${filePath} - Skipping ${key}`);
            continue;
        }

        try {
            console.log(`📤 Uploading ${asset.filename}...`);
            const buffer = fs.readFileSync(filePath);

            const result = await uploadImageToS3({
                buffer,
                originalName: asset.filename,
                folder: "logos",
            });

            uploadedAssets[key as keyof typeof uploadedAssets] = {
                url: result.cdnUrl,
                alt: asset.alt,
            };

            console.log(`   ✅ Uploaded: ${result.cdnUrl}`);
        } catch (error) {
            console.error(`   ❌ Failed to upload ${asset.filename}:`, error);
        }
    }

    console.log("\n💾 Saving to database...");

    // Create or update GeneralSettings
    try {
        if (existingSettings) {
            // Update existing
            if (uploadedAssets.headerLogo)
                existingSettings.headerLogo = uploadedAssets.headerLogo;
            if (uploadedAssets.footerLogo)
                existingSettings.footerLogo = uploadedAssets.footerLogo;
            if (uploadedAssets.favicon)
                existingSettings.favicon = uploadedAssets.favicon;
            existingSettings.siteTitle = "ADPL Consulting LLC";
            existingSettings.siteDescription =
                "A trusted partner to architects, engineers, contractors, and real estate consultants across India and the U.S.";

            await existingSettings.save();
            console.log("✅ Updated existing GeneralSettings record");
        } else {
            // Create new
            const newSettings = new GeneralSettings({
                headerLogo: uploadedAssets.headerLogo,
                footerLogo: uploadedAssets.footerLogo,
                favicon: uploadedAssets.favicon,
                siteTitle: "ADPL Consulting LLC",
                siteDescription:
                    "A trusted partner to architects, engineers, contractors, and real estate consultants across India and the U.S.",
            });

            await newSettings.save();
            console.log("✅ Created new GeneralSettings record");
        }
    } catch (error) {
        console.error("❌ Failed to save GeneralSettings:", error);
    }

    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("\n🎉 Seed script completed!");
}

// Run the seed script
seedGeneralSettings().catch((error) => {
    console.error("❌ Seed script failed:", error);
    process.exit(1);
});
