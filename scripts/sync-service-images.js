#!/usr/bin/env node

/**
 * Script to verify and show mismatches between homepage serviceBox images
 * and service displayImage URLs
 *
 * This script:
 * 1. Fetches homepage data to get service images from serviceBoxes
 * 2. Fetches all services
 * 3. Compares and reports any mismatches
 * 4. Provides instructions for manual updates in the CMS
 */

const BACKEND_URL =
    process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:5500";

async function fetchData(endpoint) {
    const url = `${BACKEND_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const json = await response.json();
        // API returns { success, data }, extract data
        return json.data || json;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error.message);
        throw error;
    }
}

async function main() {
    console.log("=".repeat(70));
    console.log("Service Image Verification Script");
    console.log("=".repeat(70));

    // Step 1: Fetch homepage data
    console.log("\n[1/2] Fetching homepage data...");
    const homepageData = await fetchData("/api/public/homepage");

    if (!homepageData?.serviceBoxes || homepageData.serviceBoxes.length === 0) {
        console.error("❌ No serviceBoxes found in homepage data");
        process.exit(1);
    }

    console.log(`✓ Found ${homepageData.serviceBoxes.length} service boxes`);

    // Step 2: Fetch all services
    console.log("\n[2/2] Fetching all services...");
    const services = await fetchData("/api/public/services");

    if (!services || services.length === 0) {
        console.error("❌ No services found");
        process.exit(1);
    }

    console.log(`✓ Found ${services.length} services`);

    // Create a mapping of service URLs to their images from homepage
    const serviceBoxMap = new Map();
    homepageData.serviceBoxes.forEach((box) => {
        if (box.url && box.image) {
            // Extract slug from URL (e.g., "/services/slug" -> "slug")
            const urlParts = box.url.split("/").filter(Boolean);
            const slug = urlParts[urlParts.length - 1];
            serviceBoxMap.set(slug, box.image);
        }
    });

    console.log("\n" + "=".repeat(70));
    console.log("IMAGE VERIFICATION RESULTS");
    console.log("=".repeat(70));

    let correctCount = 0;
    let mismatchCount = 0;
    let missingCount = 0;
    const mismatches = [];

    for (const service of services) {
        // Skip the main-services service itself
        if (service.slug === "main-services") {
            continue;
        }

        // Check if this service has a corresponding serviceBox
        const matchingImage = serviceBoxMap.get(service.slug);

        if (!matchingImage) {
            console.log(`\n⚠  ${service.title}`);
            console.log(`   Slug: ${service.slug}`);
            console.log(`   Status: NO MATCHING SERVICE BOX`);
            console.log(
                `   Current displayImage: ${service.displayImage?.url || "none"}`,
            );
            missingCount++;
            continue;
        }

        const currentDisplayImageUrl = service.displayImage?.url;
        const expectedImageUrl = matchingImage.url;

        if (currentDisplayImageUrl === expectedImageUrl) {
            console.log(`\n✓  ${service.title}`);
            console.log(`   Status: CORRECT`);
            console.log(`   Image: ${currentDisplayImageUrl}`);
            correctCount++;
        } else {
            console.log(`\n✗  ${service.title}`);
            console.log(`   Slug: ${service.slug}`);
            console.log(`   Status: MISMATCH`);
            console.log(`   Current:  ${currentDisplayImageUrl || "none"}`);
            console.log(`   Expected: ${expectedImageUrl}`);
            mismatchCount++;
            mismatches.push({
                title: service.title,
                slug: service.slug,
                current: currentDisplayImageUrl,
                expected: expectedImageUrl,
            });
        }
    }

    // Summary
    console.log("\n" + "=".repeat(70));
    console.log("SUMMARY");
    console.log("=".repeat(70));
    console.log(`  ✓ Correct:   ${correctCount} service(s)`);
    console.log(`  ✗  Mismatch:  ${mismatchCount} service(s)`);
    console.log(`  ⚠  No Match:  ${missingCount} service(s)`);
    console.log(`  Total:       ${services.length} service(s)`);
    console.log("=".repeat(70));

    if (mismatchCount > 0) {
        console.log("\n📋 MANUAL UPDATE REQUIRED");
        console.log("=".repeat(70));
        console.log(
            "The following services need their displayImage updated in the CMS:",
        );
        console.log("");

        mismatches.forEach((m, i) => {
            console.log(`${i + 1}. Service: ${m.title}`);
            console.log(`   Slug: ${m.slug}`);
            console.log(`   Update displayImage to: ${m.expected}`);
            console.log("");
        });

        console.log("Instructions:");
        console.log("  1. Log into the CMS admin panel");
        console.log("  2. Navigate to Services");
        console.log("  3. For each service listed above:");
        console.log("     - Find the service by slug");
        console.log(
            '     - Update the "Display Image" field with the "Expected" URL above',
        );
        console.log("     - Save the service");
        console.log("");
        console.log("OR update directly in MongoDB if you have access:");
        console.log("");
        mismatches.forEach((m) => {
            console.log(`  db.services.updateOne(`);
            console.log(`    { slug: "${m.slug}" },`);
            console.log(
                `    { $set: { "displayImage.url": "${m.expected}" } }`,
            );
            console.log(`  )`);
            console.log("");
        });

        process.exit(1);
    } else {
        console.log("\n✓ All service images are correctly synchronized!");
        console.log("  No action needed.");
    }
}

// Run the script
main().catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
});
