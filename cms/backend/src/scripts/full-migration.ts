#!/usr/bin/env ts-node

/**
 * Full Migration Script: Sanity CMS to MongoDB
 * 
 * This script:
 * 1. Drops all existing collections
 * 2. Re-migrates all data from Sanity with proper field mapping
 * 3. Uploads images to S3 with correct URLs
 * 
 * Usage:
 *   npx ts-node src/scripts/full-migration.ts
 */

import { createClient } from '@sanity/client';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import axios from 'axios';
import { config as envConfig } from '../config/env';
import { uploadImageToS3 } from '../utils/s3';

// Import models
import { Homepage } from '../database/schemas/homepage.schema';
import { Project } from '../database/schemas/project.schema';
import { Service } from '../database/schemas/service.schema';
import { FAQ } from '../database/schemas/faq.schema';
import { About } from '../database/schemas/about.schema';
import { Contact } from '../database/schemas/contact.schema';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize Sanity client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '5ippxm43',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Stats tracking
const stats = {
  images: { success: 0, failed: 0 },
  homepage: false,
  projects: 0,
  services: 0,
  faq: false,
  about: false,
  contact: false,
};

/**
 * Build Sanity image URL from reference or ID
 */
function buildSanityImageUrl(refOrId: string): string {
  if (!refOrId) return '';
  
  // Handle both _ref format (image-{id}-{dimensions}-{format}) 
  // and _id format (image-{id}-{dimensions}-{format})
  let ref = refOrId;
  if (ref.startsWith('image-')) {
    ref = ref.substring(6); // Remove 'image-' prefix
  }
  
  // ref is now: {id}-{dimensions}-{format}
  const parts = ref.split('-');
  if (parts.length < 3) return '';
  
  const format = parts.pop()!;
  const dimensions = parts.pop()!;
  const id = parts.join('-');
  
  return `https://cdn.sanity.io/images/5ippxm43/production/${id}-${dimensions}.${format}`;
}

/**
 * Build Sanity file URL from reference
 */
function buildSanityFileUrl(ref: string): string {
  if (!ref) return '';
  // ref format: file-{id}-{format}
  const parts = ref.replace('file-', '').split('-');
  const format = parts.pop();
  const id = parts.join('-');
  return `https://cdn.sanity.io/files/5ippxm43/production/${id}.${format}`;
}

/**
 * Download image from URL
 */
async function downloadImage(url: string): Promise<Buffer | null> {
  if (!url) return null;
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 60000,
    });
    return Buffer.from(response.data);
  } catch (error) {
    console.error(`  ✗ Failed to download: ${url}`);
    return null;
  }
}

/**
 * Migrate image to S3
 */
async function migrateImage(imageRef: string, folder: string, name: string): Promise<string> {
  if (!imageRef) return '';
  
  const sanityUrl = buildSanityImageUrl(imageRef);
  if (!sanityUrl) return '';

  try {
    const buffer = await downloadImage(sanityUrl);
    if (!buffer) {
      stats.images.failed++;
      return sanityUrl; // Fallback to Sanity URL
    }

    const result = await uploadImageToS3({
      buffer,
      originalName: name,
      folder,
    });

    stats.images.success++;
    console.log(`  ✓ ${name}`);
    return result.cdnUrl;
  } catch (error) {
    stats.images.failed++;
    return sanityUrl;
  }
}

/**
 * Convert portable text to plain text
 */
function portableTextToPlain(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks
    .map(block => {
      if (block._type === 'block' && block.children) {
        return block.children.map((child: any) => child.text || '').join('');
      }
      return '';
    })
    .join('\n\n');
}

/**
 * Convert portable text to HTML
 */
function portableTextToHTML(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return '';
  
  return blocks.map(block => {
    if (block._type === 'block' && block.children) {
      const text = block.children.map((child: any) => {
        let t = child.text || '';
        if (child.marks?.includes('strong')) t = `<strong>${t}</strong>`;
        if (child.marks?.includes('em')) t = `<em>${t}</em>`;
        return t;
      }).join('');
      
      const style = block.style || 'normal';
      if (style === 'normal') return `<p>${text}</p>`;
      return `<${style}>${text}</${style}>`;
    }
    return '';
  }).join('\n');
}

/**
 * Truncate string to max length (only for SEO fields with actual browser limits)
 * SEO Title: 60 chars (Google truncates at ~60)
 * SEO Description: 160 chars (Google truncates at ~160)
 */
function truncateSEO(str: string, max: number): string {
  if (!str || str.length <= max) return str || '';
  return str.substring(0, max - 3) + '...';
}

/**
 * Generate URL-friendly slug from title
 * Example: "Resident - Diamond Drive" -> "resident-diamond-drive"
 */
function generateSlugFromTitle(title: string): string {
    if (!title) return '';
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special chars except spaces and hyphens
        .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Transform legacy serviceInternal URLs to new /services/[slug] format
 */
const SERVICE_URL_MAP: Record<string, string> = {
    '/serviceInternalOne': '/services/drafting-to-cad',
    '/serviceInternalTwo': '/services/permit-drawing',
    '/serviceInternalThree': '/services/working-drawings',
    '/serviceInternalFour': '/services/3d-modelling',
    '/serviceInternalFive': '/services/360-view',
    '/serviceInternalSix': '/services/bim-services',
    '/serviceInternalSeven': '/services/boq-services',
    '/serviceInternalEight': '/services/mep-drafting',
};

function transformServiceUrl(url: string): string {
    if (!url) return '/mainservice';
    return SERVICE_URL_MAP[url] || url;
}

// ============================================
// HOMEPAGE MIGRATION
// ============================================
async function migrateHomepage() {
  console.log('\n📄 Migrating Homepage...');
  
  const query = `*[_type == "homepage"][0]{
    seoTitle,
    seoDescription,
    slides[]{image{asset->{_id, url}, alt}},
    slidesDarkMode[]{image{asset->{_id, url}}},
    sliderImage{asset->{_id, url}},
    sliderTextOne, sliderTextTwo, sliderTextThree, sliderTextFour, sliderTextFive,
    trustIconsHeading,
    serviceRelatedIcon[]{
      serviceRelatedImg{asset->{_id, url}},
      serviceRelatedNumber,
      serviceRelatedName
    },
    serviceHeading,
    serviceBox[]{
      boxUrl,
      serviceBoxImg{asset->{_id, url}},
      serviceBoxTitle
    },
    serviceBoxDarkMode[]{
      boxUrl,
      serviceBoxImg{asset->{_id, url}},
      serviceBoxTitle
    },
    home_services_cta,
    technologyHeading,
    technologyImgs[]{technologyImage{asset->{_id, url}}},
    technologyImgsDarkMode[]{technologyImage{asset->{_id, url}}},
    workingProcessHeading,
    workingProcessSubHeading,
    processSteps[]{stepTitle, stepText, stepImage{asset->{_id, url}}},
    processStepsDarkMode[]{stepImage{asset->{_id, url}}},
    allowLightHeading,
    allowUsHeading,
    allowRightHeading,
    paragraph,
    ctaButton,
    peoplImageOne{asset->{_id, url}},
    peoplImageOneDarkMode{asset->{_id, url}},
    peoplImageTwoDarkMode{asset->{_id, url}},
    peopleVideo{asset->{_id, url}},
    peopleVideoDarkMode{asset->{_id, url}},
    peopleText,
    founderSlider[]{
      founderTitle,
      founderDescription,
      founderDescriptionTwo,
      founderName,
      founderAchievements,
      partnerLabel,
      partner,
      image{asset->{_id, url}},
      imageDarkMode{asset->{_id, url}}
    },
    contactUsTitle,
    contactUsButton,
    contactUsSectionImg{asset->{_id, url}},
    contactUsSectionImgDarkMode{asset->{_id, url}}
  }`;

  const data = await sanityClient.fetch(query);
  if (!data) {
    console.log('  No homepage found in Sanity');
    return;
  }

  console.log('  Migrating images...');

  // Migrate slides
  const slides: any[] = [];
  if (data.slides) {
    for (let i = 0; i < data.slides.length; i++) {
      const slide = data.slides[i];
      // Get image ref from either _ref or construct from _id
      let ref = slide.image?.asset?._ref;
      if (!ref && slide.image?.asset?._id) {
        ref = slide.image.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/slides', `slide-${i + 1}.jpg`);
      slides.push({
        image: { url, alt: slide.image?.alt || `Slide ${i + 1}` },
        order: i,
      });
    }
  }

  // Migrate trust icons (serviceRelatedIcon)
  const trustIcons: any[] = [];
  if (data.serviceRelatedIcon) {
    for (let i = 0; i < data.serviceRelatedIcon.length; i++) {
      const icon = data.serviceRelatedIcon[i];
      let ref = icon.serviceRelatedImg?.asset?._ref;
      if (!ref && icon.serviceRelatedImg?.asset?._id) {
        ref = icon.serviceRelatedImg.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/trust-icons', `icon-${i + 1}.png`);
      trustIcons.push({
        image: { url, alt: icon.serviceRelatedName || '' },
        number: icon.serviceRelatedNumber || '',
        name: icon.serviceRelatedName || '',
        order: i,
      });
    }
  }

  // Migrate service boxes
  const serviceBoxes: any[] = [];
  if (data.serviceBox) {
    for (let i = 0; i < data.serviceBox.length; i++) {
      const box = data.serviceBox[i];
      let ref = box.serviceBoxImg?.asset?._ref;
      if (!ref && box.serviceBoxImg?.asset?._id) {
        ref = box.serviceBoxImg.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/services', `service-${i + 1}.jpg`);
      serviceBoxes.push({
          url: transformServiceUrl(box.boxUrl || ''),
        image: { url, alt: box.serviceBoxTitle || '' },
        title: box.serviceBoxTitle || '',
        order: i,
      });
    }
  }

  // Migrate technology images
  const technologyImages: any[] = [];
  if (data.technologyImgs) {
    for (let i = 0; i < data.technologyImgs.length; i++) {
      const tech = data.technologyImgs[i];
      let ref = tech.technologyImage?.asset?._ref;
      if (!ref && tech.technologyImage?.asset?._id) {
        ref = tech.technologyImage.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/technology', `tech-${i + 1}.jpg`);
      technologyImages.push({
        image: { url, alt: `Technology ${i + 1}` },
        order: i,
      });
    }
  }

  // Migrate process steps
  const processSteps: any[] = [];
  if (data.processSteps) {
    for (let i = 0; i < data.processSteps.length; i++) {
      const step = data.processSteps[i];
      let ref = step.stepImage?.asset?._ref;
      if (!ref && step.stepImage?.asset?._id) {
        ref = step.stepImage.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/process', `step-${i + 1}.jpg`);
      processSteps.push({
        title: step.stepTitle || '',
        description: step.stepText || '',
        image: { url, alt: step.stepTitle || '' },
        order: i,
      });
    }
  }

  // Migrate slider image
  let sliderImageUrl = '';
  let sliderRef = data.sliderImage?.asset?._ref;
  if (!sliderRef && data.sliderImage?.asset?._id) {
    sliderRef = data.sliderImage.asset._id;
  }
  if (sliderRef) {
    sliderImageUrl = await migrateImage(sliderRef, 'homepage', 'slider-image.png');
  }

  // Migrate about images
  const aboutImages: any[] = [];
  let aboutRef = data.peoplImageOne?.asset?._ref;
  if (!aboutRef && data.peoplImageOne?.asset?._id) {
    aboutRef = data.peoplImageOne.asset._id;
  }
  if (aboutRef) {
    const url = await migrateImage(aboutRef, 'homepage/about', 'about-1.jpg');
    aboutImages.push({ url, alt: 'About 1' });
  }

  // Migrate founder slides
  const founderSlides: any[] = [];
  if (data.founderSlider) {
    for (let i = 0; i < data.founderSlider.length; i++) {
      const founder = data.founderSlider[i];
      let ref = founder.image?.asset?._ref;
      if (!ref && founder.image?.asset?._id) {
        ref = founder.image.asset._id;
      }
      const url = await migrateImage(ref, 'homepage/founders', `founder-${i + 1}.jpg`);
      founderSlides.push({
        title: founder.founderTitle || '',
        description: portableTextToPlain(founder.founderDescription),
        descriptionTwo: portableTextToPlain(founder.founderDescriptionTwo),
        name: founder.founderName || '',
        achievements: founder.founderAchievements || '',
        partnerLabel: founder.partnerLabel || '',
        partner: founder.partner || '',
        image: { url, alt: founder.founderName || '' },
        order: i,
      });
    }
  }

  // Migrate contact image
  let contactImageUrl = '';
  let contactRef = data.contactUsSectionImg?.asset?._ref;
  if (!contactRef && data.contactUsSectionImg?.asset?._id) {
    contactRef = data.contactUsSectionImg.asset._id;
  }
  if (contactRef) {
    contactImageUrl = await migrateImage(contactRef, 'homepage', 'contact-image.jpg');
  }

  // Build slider texts array
  const sliderTexts = [
    data.sliderTextOne,
    data.sliderTextTwo,
    data.sliderTextThree,
    data.sliderTextFour,
    data.sliderTextFive,
  ].filter(Boolean);

  // Create homepage document
  const homepage = {
    seoTitle: data.seoTitle || 'Home',
      seoDescription: truncateSEO(data.seoDescription || '', 160),
    sliderTitle: '',
    slides,
    trustIconsHeading: data.trustIconsHeading || '',
    trustIcons,
    serviceHeading: data.serviceHeading || '',
    serviceBoxes,
    serviceCta: data.home_services_cta || '',
    technologyHeading: data.technologyHeading || '',
    technologyImages,
    workingProcessHeading: data.workingProcessHeading || '',
    workingProcessSubHeading: data.workingProcessSubHeading || '',
    processSteps,
    sliderImage: sliderImageUrl ? { url: sliderImageUrl, alt: 'Slider' } : undefined,
    sliderTexts,
    aboutLightHeading: data.allowLightHeading || '',
    aboutUsHeading: data.allowUsHeading || '',
    aboutRightHeading: data.allowRightHeading || '',
    aboutParagraph: portableTextToHTML(data.paragraph),
    aboutCtaButton: data.ctaButton || '',
    aboutImages,
    peopleText: data.peopleText || '',
    founderSlides,
    contactTitle: data.contactUsTitle || '',
    contactButton: data.contactUsButton || '',
    contactImage: contactImageUrl ? { url: contactImageUrl, alt: 'Contact' } : undefined,
  };

  await Homepage.deleteMany({});
  await Homepage.create(homepage);
  stats.homepage = true;
  console.log('  ✓ Homepage migrated');
}


// ============================================
// PROJECTS MIGRATION
// ============================================
async function migrateProjects() {
  console.log('\n📄 Migrating Projects...');
  
    // First, get the project listing page for reference images
    const listingQuery = `*[_type == "projectPage"][0]{
    seoTitle,
    seoDescription,
    heading,
    projects[]{
      title,
      image{asset->{_id, url}},
      link
    }
  }`;

    const listingData = await sanityClient.fetch(listingQuery);

    // Create a map of slug -> listing image
    const listingImageMap = new Map();
    if (listingData?.projects) {
        for (const proj of listingData.projects) {
            const linkSlug = proj.link?.split('/').pop() || '';
            if (linkSlug && proj.image?.asset) {
                listingImageMap.set(linkSlug, {
                    title: proj.title,
                    imageRef: proj.image.asset._id || proj.image.asset._ref
                });
            }
        }
    }

    // Get ALL project internal pages (note: type is projectInternalPage*)
    const internalQuery = `*[_type match "projectInternalPage*"]{
    _type,
    title,
    slug,
    seoTitle,
    seoDescription,
    introText,
    moreContent,
    mainImage{asset->{_id, url}},
    mainImageDarkMode{asset->{_id, url}},
    projectDetails[]{label, items},
    projectImages{
      topImages[]{asset->{_id, url}},
      bottomImage{asset->{_id, url}},
      topImagesDarkMode[]{asset->{_id, url}},
      bottomImageDarkMode{asset->{_id, url}}
    },
    projectImagesTwo{
      topImagesTwo[]{asset->{_id, url}},
      bottomImageTwo{asset->{_id, url}},
      topImagesTwoDarkMode[]{asset->{_id, url}},
      bottomImageTwoDarkMode{asset->{_id, url}}
    }
  }`;

    const internalPages = await sanityClient.fetch(internalQuery);

    console.log(`  Found ${listingData?.projects?.length || 0} projects in listing`);
    console.log(`  Found ${internalPages?.length || 0} internal project pages`);

    await Project.deleteMany({});

    if (!internalPages || internalPages.length === 0) {
        console.log('  No project internal pages found in Sanity');
        return;
    }

    // Process ALL internal pages
    for (let i = 0; i < internalPages.length; i++) {
        const page = internalPages[i];
        const sanitySlug = page.slug?.current;

        if (!sanitySlug) {
            console.log(`  ⚠ Skipping project without slug: ${page.title}`);
            continue;
        }

        const title = page.title || `Project ${i + 1}`;
        // Generate slug from title instead of using Sanity's slug
        const baseSlug = generateSlugFromTitle(title);

        // Check if we have a listing image for this project (use Sanity slug for lookup)
        const listingInfo = listingImageMap.get(sanitySlug);
        const isFeatured = listingImageMap.has(sanitySlug);

        // Collect all images for the gallery
        const allImages: any[] = [];

        // First, try to use listing image if available
        if (listingInfo?.imageRef) {
            const listingImageUrl = await migrateImage(listingInfo.imageRef, `projects/${baseSlug}`, 'listing.jpg');
            if (listingImageUrl) {
                allImages.push({ url: listingImageUrl, alt: title });
            }
        }

        // Migrate internal page main image
        if (page.mainImage?.asset?._id || page.mainImage?.asset?._ref) {
            const mainRef = page.mainImage.asset._id || page.mainImage.asset._ref;
            const mainImageUrl = await migrateImage(mainRef, `projects/${baseSlug}`, 'main.jpg');
            if (mainImageUrl) {
                // Only add if different from listing image
                if (!allImages.some(img => img.url === mainImageUrl)) {
                    allImages.push({ url: mainImageUrl, alt: `${title} - Main` });
                }
            }
        }

        // Migrate image galleries
        const imageGalleries: any[] = [];

        // Migrate projectImages.topImages
        if (page.projectImages?.topImages) {
            const galleryImages: any[] = [];
            for (let j = 0; j < page.projectImages.topImages.length; j++) {
                const img = page.projectImages.topImages[j];
                const ref = img.asset?._id || img.asset?._ref;
                if (ref) {
                    const url = await migrateImage(ref, `projects/${baseSlug}/gallery1`, `img-${j + 1}.jpg`);
                    if (url) {
                        galleryImages.push({ url, alt: `${title} - Gallery 1 Image ${j + 1}` });
                    }
                }
            }
            if (galleryImages.length > 0) {
                imageGalleries.push({ title: 'Gallery 1', images: galleryImages });
            }
        }

        // Migrate projectImages.bottomImage
        if (page.projectImages?.bottomImage?.asset) {
            const ref = page.projectImages.bottomImage.asset._id || page.projectImages.bottomImage.asset._ref;
            if (ref) {
                const url = await migrateImage(ref, `projects/${baseSlug}/gallery1`, 'bottom.jpg');
                if (url) {
                    if (imageGalleries.length > 0 && imageGalleries[0].title === 'Gallery 1') {
                        imageGalleries[0].images.push({ url, alt: `${title} - Bottom Image` });
                    } else {
                        imageGalleries.push({ title: 'Gallery 1', images: [{ url, alt: `${title} - Bottom Image` }] });
                    }
                }
            }
        }

        // Migrate projectImagesTwo.topImagesTwo
        if (page.projectImagesTwo?.topImagesTwo) {
            const galleryImages: any[] = [];
            for (let j = 0; j < page.projectImagesTwo.topImagesTwo.length; j++) {
                const img = page.projectImagesTwo.topImagesTwo[j];
                const ref = img.asset?._id || img.asset?._ref;
                if (ref) {
                    const url = await migrateImage(ref, `projects/${baseSlug}/gallery2`, `img-${j + 1}.jpg`);
                    if (url) {
                        galleryImages.push({ url, alt: `${title} - Gallery 2 Image ${j + 1}` });
                    }
                }
            }
            if (galleryImages.length > 0) {
                imageGalleries.push({ title: 'Gallery 2', images: galleryImages });
            }
        }

        // Build project details - keep items as array for frontend compatibility
        const projectDetails: any[] = [];
        if (page.projectDetails) {
            for (const detail of page.projectDetails) {
                // Store value as the first item or joined string for display
                // But also keep items array for frontend that expects it
                const items = detail.items || [];
                projectDetails.push({
                    label: detail.label || '',
                    value: items.join(', ').trim() || '',
                    items: items, // Keep original items array
                });
            }
        }

        // Build introText (displayed as paragraph)
        const introText = page.introText || '';

        // Build moreContent as HTML (displayed in expandable section)
        let moreContent = '';
        if (page.moreContent && Array.isArray(page.moreContent)) {
            // Convert array of strings to HTML paragraphs/list
            const contentItems = page.moreContent
                .filter((item: any) => item && typeof item === 'string' && item.trim())
                .map((item: string) => item.trim());
            if (contentItems.length > 0) {
                // First item might be a heading like "Scope of work"
                const firstItem = contentItems[0];
                if (firstItem.toLowerCase().includes('scope') || firstItem.toLowerCase().includes('work')) {
                    moreContent = `<h3>${firstItem}</h3><ul>`;
                    for (let j = 1; j < contentItems.length; j++) {
                        moreContent += `<li>${contentItems[j]}</li>`;
                    }
                    moreContent += '</ul>';
                } else {
                    // Just paragraphs
                    moreContent = contentItems.map((item: string) => `<p>${item}</p>`).join('');
                }
            }
        }

    await Project.create({
      title,
        slug: baseSlug,
        description: introText, // Keep for backward compatibility
        introText, // New field for frontend
        moreContent, // HTML content for expandable section
        images: allImages,
        imageGalleries,
        projectDetails,
      category: '',
        featured: isFeatured,
        link: `/projects/${baseSlug}`,
        seoTitle: truncateSEO(page.seoTitle || title, 60),
        seoDescription: truncateSEO(page.seoDescription || '', 160),
    });

    stats.projects++;
        console.log(`  ✓ ${title} (${baseSlug})${isFeatured ? ' [featured]' : ''}`);
  }
}

// ============================================
// SERVICES MIGRATION
// ============================================

// Mapping of Sanity service types to slugs
const SERVICE_TYPE_SLUG_MAP: Record<string, string> = {
    'servicesOnePage': 'drafting-to-cad',
    'servicesTwoPage': 'permit-drawing',
    'servicesThreePage': 'working-drawings',
    'servicesFourPage': '3d-modelling',
    'servicesFivePage': '360-view',
    'servicesSixPage': 'bim-services',
    'serviceInternalSevenPage': 'boq-services',
    'serviceInternalEightPage': 'mep-drafting',
};

async function migrateServices() {
  console.log('\n📄 Migrating Services...');
  
    await Service.deleteMany({});

    // First, migrate the main service page (serviceTwoPage)
    const mainQuery = `*[_type == "serviceTwoPage"][0]{
    seoTitle,
    seoDescription,
    title,
    serviceBannerImage{asset->{_id, url}},
    serviceBannerImageDarkMode{asset->{_id, url}},
    whyWorkWithUs{
      title,
      features[]{title, description, icon},
      image{asset->{_id, url}},
      imageDarkMode{asset->{_id, url}}
    }
  }`;

    const mainData = await sanityClient.fetch(mainQuery);
    if (mainData) {
        const title = mainData.whyWorkWithUs?.title || mainData.title || 'Our Services';
        const slug = 'main-services';

        let bannerUrl = '';
        const bannerRef = mainData.serviceBannerImage?.asset?._ref || mainData.serviceBannerImage?.asset?._id;
        if (bannerRef) {
            bannerUrl = await migrateImage(bannerRef, 'services/main', 'banner.png');
        }

        let mainImageUrl = '';
        const mainRef = mainData.whyWorkWithUs?.image?.asset?._ref || mainData.whyWorkWithUs?.image?.asset?._id;
        if (mainRef) {
            mainImageUrl = await migrateImage(mainRef, 'services/main', 'main.jpg');
        }

        await Service.create({
            title,
            slug,
            description: '',
            content: '',
            bannerImage: { url: bannerUrl, alt: 'Services Banner' },
            features: mainData.whyWorkWithUs?.features || [],
            image: { url: mainImageUrl, alt: 'Why Work With Us' },
            seoTitle: mainData.seoTitle || title,
            seoDescription: truncateSEO(mainData.seoDescription || '', 160),
            order: 0,
        });

        stats.services++;
        console.log(`  ✓ ${title} (main-services)`);
    }

    // Now migrate all individual service pages
    const serviceTypes = [
        'servicesOnePage',
        'servicesTwoPage',
        'servicesThreePage',
        'servicesFourPage',
        'servicesFivePage',
        'servicesSixPage',
        'serviceInternalSevenPage',
        'serviceInternalEightPage',
    ];

    const allServicesQuery = `*[_type in ${JSON.stringify(serviceTypes)}]{
    _type,
    _id,
    title,
    seoTitle,
    seoDescription,
    serviceBannerImage{asset->{_id, url}},
    serviceBannerImageDarkMode{asset->{_id, url}},
    servicesList[]{
      title,
      description,
      image{asset->{_id, url}},
      imageDarkMode{asset->{_id, url}}
    },
    keyActivities[]{title, description},
    reasonsToWork[]{title, description},
    founderImage{asset->{_id, url}}
  }`;

    const allServices = await sanityClient.fetch(allServicesQuery);

    if (!allServices || allServices.length === 0) {
        console.log('  No individual service pages found in Sanity');
    return;
  }

    console.log(`  Found ${allServices.length} individual service pages`);

    for (let i = 0; i < allServices.length; i++) {
        const service = allServices[i];
        const slug = SERVICE_TYPE_SLUG_MAP[service._type] || service._type.replace(/Page$/, '').toLowerCase();
        const title = service.title || `Service ${i + 1}`;

        // Migrate banner image
        let bannerUrl = '';
        const bannerRef = service.serviceBannerImage?.asset?._ref || service.serviceBannerImage?.asset?._id;
        if (bannerRef) {
            bannerUrl = await migrateImage(bannerRef, `services/${slug}`, 'banner.png');
        }

        // Migrate services list items with images
        const servicesList: any[] = [];
        if (service.servicesList) {
            for (let j = 0; j < service.servicesList.length; j++) {
                const item = service.servicesList[j];
                let imageUrl = '';
                const imageRef = item.image?.asset?._ref || item.image?.asset?._id;
                if (imageRef) {
                    imageUrl = await migrateImage(imageRef, `services/${slug}`, `service-item-${j + 1}.jpg`);
                }

                servicesList.push({
                    title: item.title || '',
                    description: item.description || '',
                    image: imageUrl ? { url: imageUrl, alt: item.title || '' } : undefined,
                    link: '',
                    isExternal: false,
                    order: j,
                });
            }
        }

        // Migrate key activities
        const keyActivities: any[] = [];
        if (service.keyActivities) {
            for (let j = 0; j < service.keyActivities.length; j++) {
                const activity = service.keyActivities[j];
                keyActivities.push({
                    title: activity.title || '',
                    description: activity.description || '',
                    order: j,
                });
            }
        }

        // Convert reasonsToWork to features format for backward compatibility
        const features: any[] = [];
        if (service.reasonsToWork) {
            for (const reason of service.reasonsToWork) {
                features.push({
                    title: reason.title || '',
                    description: reason.description || '',
                });
            }
        }

        // Get description from first servicesList item
        const description = servicesList[0]?.description || '';

        await Service.create({
            title,
            slug,
            description,
            content: '',
            bannerImage: bannerUrl ? { url: bannerUrl, alt: `${title} Banner` } : undefined,
            servicesList,
            keyActivities,
            features,
            seoTitle: truncateSEO(service.seoTitle || title, 60),
            seoDescription: truncateSEO(service.seoDescription || '', 160),
            order: i + 1,
        });

        stats.services++;
        console.log(`  ✓ ${title} (${slug})`);
    }
}

// ============================================
// FAQ MIGRATION
// ============================================
async function migrateFAQ() {
  console.log('\n📄 Migrating FAQ...');
  
  const query = `*[_type == "faqSection"][0]{
    seoTitle,
    seoDescription,
    title,
    categories[]{
      title,
      description,
      chatLink,
      image{asset->{_id, url}},
      imageDarkMode{asset->{_id, url}},
      faqs[]{question, answer}
    }
  }`;

  const data = await sanityClient.fetch(query);
  if (!data) {
    console.log('  No FAQ found in Sanity');
    return;
  }

  await FAQ.deleteMany({});

  const categories: any[] = [];
  if (data.categories) {
    for (let i = 0; i < data.categories.length; i++) {
      const cat = data.categories[i];
      let imageUrl = '';
        // Handle both _ref and _id formats
        const imageRef = cat.image?.asset?._ref || cat.image?.asset?._id;
        if (imageRef) {
            imageUrl = await migrateImage(imageRef, 'faq', `category-${i + 1}.jpg`);
      }

      categories.push({
        title: cat.title || '',
        description: cat.description || '',
        chatLink: cat.chatLink || '',
        image: { url: imageUrl, darkModeUrl: '' },
        faqs: (cat.faqs || []).map((faq: any) => ({
          question: faq.question || '',
          answer: faq.answer || '',
        })),
      });
    }
  }

  await FAQ.create({
    title: data.title || 'FAQ',
    categories,
    seoTitle: data.seoTitle || 'FAQ',
      seoDescription: truncateSEO(data.seoDescription || '', 160),
  });

  stats.faq = true;
    console.log(`  ✓ FAQ migrated (${categories.length} categories)`);
}

// ============================================
// ABOUT MIGRATION
// ============================================
async function migrateAbout() {
  console.log('\n📄 Migrating About Page...');
  
  const query = `*[_type == "aboutPage"][0]{
    seoTitle,
    seoDescription,
    allowLightHeading,
    allowUsHeading,
    allowRightHeading,
    paragraph,
    anchorLinks[]{label, targetId},
    sections[]{
      sectionId,
      title,
      body,
      image{asset->{_id, url}},
      imageDarkMode{asset->{_id, url}}
    }
  }`;

  const data = await sanityClient.fetch(query);
  if (!data) {
    console.log('  No About page found in Sanity');
    return;
  }

  await About.deleteMany({});

  const sections: any[] = [];
  if (data.sections) {
    for (let i = 0; i < data.sections.length; i++) {
      const sec = data.sections[i];
      let imageUrl = '';
      if (sec.image?.asset?._ref) {
        imageUrl = await migrateImage(sec.image.asset._ref, 'about', `section-${i + 1}.jpg`);
      }

      sections.push({
        sectionId: sec.sectionId || '',
        title: sec.title || '',
        body: sec.body || '',
        image: { url: imageUrl, darkModeUrl: '' },
      });
    }
  }

  await About.create({
    allowLightHeading: data.allowLightHeading || '',
    allowUsHeading: data.allowUsHeading || '',
    allowRightHeading: data.allowRightHeading || '',
    paragraph: portableTextToHTML(data.paragraph),
    anchorLinks: data.anchorLinks || [],
    sections,
    seoTitle: data.seoTitle || 'About Us',
      seoDescription: truncateSEO(data.seoDescription || '', 160),
  });

  stats.about = true;
  console.log('  ✓ About page migrated');
}

// ============================================
// CONTACT MIGRATION
// ============================================
async function migrateContact() {
  console.log('\n📄 Migrating Contact Page...');
  
  const query = `*[_type == "contactPage"][0]{
    seoTitle,
    seoDescription,
    mainHeading,
    contactImage{asset->{_id, url}},
    contactImageDarkMode{asset->{_id, url}},
    introText,
    contactInfo{address, phone, email},
    googleMapEmbedUrl,
    whyWorkWithUsHeading,
    whyWorkWithUsItems[]{icon, title, description},
    rightImage{asset->{_id, url}},
    talkIdeasHeading,
    formFields[]{label, name, type, required}
  }`;

  const data = await sanityClient.fetch(query);
  if (!data) {
    console.log('  No Contact page found in Sanity');
    return;
  }

  await Contact.deleteMany({});

    // Migrate contact image (handle both _ref and _id)
    let contactImageUrl = '';
    const contactImageRef = data.contactImage?.asset?._ref || data.contactImage?.asset?._id;
    if (contactImageRef) {
        contactImageUrl = await migrateImage(contactImageRef, 'contact', 'contact-image.jpg');
    }

    // Migrate right image (handle both _ref and _id)
    let rightImageUrl = '';
    const rightImageRef = data.rightImage?.asset?._ref || data.rightImage?.asset?._id;
    if (rightImageRef) {
        rightImageUrl = await migrateImage(rightImageRef, 'contact', 'right-image.jpg');
    }

    // Build form fields - use from Sanity or create defaults
    const formFields = data.formFields?.length > 0
        ? data.formFields.map((field: any) => ({
            label: field.label || '',
            name: field.name || '',
            type: field.type || 'text',
            required: field.required !== false,
        }))
        : [
            { label: 'Name', name: 'name', type: 'text', required: true },
            { label: 'Email', name: 'email', type: 'email', required: true },
            { label: 'Phone', name: 'phone', type: 'phone', required: true },
            { label: 'Service', name: 'service', type: 'text', required: false },
            { label: 'Message', name: 'message', type: 'textarea', required: true },
        ];

    // Build why work with us items
    const whyWorkWithUsItems = (data.whyWorkWithUsItems || []).map((item: any) => ({
        icon: item.icon || '',
        title: item.title || '',
        description: item.description || '',
    }));

  await Contact.create({
    title: data.mainHeading || 'Contact Us',
      mainHeading: data.mainHeading || 'Get in touch',
    description: portableTextToHTML(data.introText),
      introText: portableTextToHTML(data.introText),
      formFields,
      contactImage: contactImageUrl ? { url: contactImageUrl, alt: 'Contact Image' } : undefined,
    contactInfo: {
      email: data.contactInfo?.email || '',
      phone: data.contactInfo?.phone || '',
      address: data.contactInfo?.address || '',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
      },
    },
      googleMapEmbedUrl: data.googleMapEmbedUrl || '',
      whyWorkWithUsHeading: data.whyWorkWithUsHeading || '',
      whyWorkWithUsItems,
      rightImage: rightImageUrl ? { url: rightImageUrl, alt: 'Why Work With Us' } : undefined,
      talkIdeasHeading: data.talkIdeasHeading || "Let's Talk Ideas",
    seoTitle: data.seoTitle || 'Contact Us',
      seoDescription: truncateSEO(data.seoDescription || '', 160),
  });

  stats.contact = true;
  console.log('  ✓ Contact page migrated');
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  FULL MIGRATION: Sanity CMS → MongoDB');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    console.log('\n🔌 Connecting to MongoDB...');
    await mongoose.connect(envConfig.mongodbUri);
    console.log('✓ Connected to MongoDB');

    // Run all migrations
    await migrateHomepage();
    await migrateProjects();
    await migrateServices();
    await migrateFAQ();
    await migrateAbout();
    await migrateContact();

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('  MIGRATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`  Homepage: ${stats.homepage ? '✓' : '✗'}`);
    console.log(`  Projects: ${stats.projects}`);
    console.log(`  Services: ${stats.services}`);
    console.log(`  FAQ: ${stats.faq ? '✓' : '✗'}`);
    console.log(`  About: ${stats.about ? '✓' : '✗'}`);
    console.log(`  Contact: ${stats.contact ? '✓' : '✗'}`);
    console.log(`  Images: ${stats.images.success} success, ${stats.images.failed} failed`);
    console.log('═══════════════════════════════════════════════════════════\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
