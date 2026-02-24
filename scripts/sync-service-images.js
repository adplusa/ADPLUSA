#!/usr/bin/env node

const BACKEND_URL = process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:5500";

async function fetchData(endpoint) {
    const response = await fetch(`${BACKEND_URL}${endpoint}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return json.data || json;
}

async function main() {
    console.log("Verifying service images...\n");

    const homepage = await fetchData("/api/public/homepage");
    const services = await fetchData("/api/public/services");

    if (!homepage?.serviceBoxes?.length || !services?.length) {
        console.error("❌ Missing data");
        process.exit(1);
    }

    const serviceBoxMap = new Map();
    homepage.serviceBoxes.forEach((box) => {
        if (box.url && box.image) {
          const slug = box.url.split("/").filter(Boolean).pop();
          serviceBoxMap.set(slug, box.image);
      }
  });

    let correct = 0, mismatch = 0, missing = 0;
    const mismatches = [];

    for (const service of services) {
      if (service.slug === "main-services") continue;

      const matchingImage = serviceBoxMap.get(service.slug);
      if (!matchingImage) {
        console.log(`⚠  ${service.title}: NO MATCHING BOX`);
        missing++;
        continue;
    }

      if (service.displayImage?.url === matchingImage.url) {
          console.log(`✓ ${service.title}`);
          correct++;
      } else {
          console.log(`✗ ${service.title}: MISMATCH`);
          mismatch++;
          mismatches.push({ title: service.title, slug: service.slug, expected: matchingImage.url });
      }
  }

    console.log(`\nSummary: ${correct} correct, ${mismatch} mismatch, ${missing} missing\n`);

    if (mismatch > 0) {
        console.log("Services needing update:");
        mismatches.forEach((m) => {
        console.log(`  - ${m.title} (${m.slug}): ${m.expected}`);
    });
      process.exit(1);
  } else {
      console.log("✓ All images synchronized!");
  }
}

main().catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
});
