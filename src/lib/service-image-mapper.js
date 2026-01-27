/**
 * Service Image Mapper Utility
 *
 * Maps homepage service box images to their corresponding services for use on the
 * main services page grid. This ensures consistent images between homepage and
 * main service page while preserving the original service images for individual
 * service/slug pages.
 *
 * Usage:
 *   import { createServiceImageMap, getServiceGridImage } from '@/lib/service-image-mapper';
 *
 *   const imageMap = createServiceImageMap(homepageData?.serviceBoxes);
 *   const gridImage = getServiceGridImage(service, imageMap);
 */

/**
 * Extracts the slug from a service URL.
 * Handles URLs like "/services/some-slug", "/mainservice", etc.
 *
 * @param {string} url - The service URL
 * @returns {string|null} - The extracted slug or null
 */
function extractSlugFromUrl(url) {
    if (!url) return null;

    // Match patterns like /services/slug or /service/slug
    const match = url.match(/\/services?\/([^\/\?#]+)/i);
    return match ? match[1].toLowerCase() : null;
}

/**
 * Normalizes a service title for comparison.
 * Converts to lowercase and removes extra whitespace.
 *
 * @param {string} title - The service title
 * @returns {string} - Normalized title
 */
function normalizeTitle(title) {
    if (!title) return "";
    return title.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Creates a mapping from service identifiers (slug and title) to homepage images.
 *
 * @param {Array} serviceBoxes - The serviceBoxes array from homepage data
 * @returns {Object} - A map with keys as slugs and titles, values as image objects
 *
 * @example
 * const map = createServiceImageMap(homepageData.serviceBoxes);
 * // Returns: {
 * //   'architectural-design': { url: '...', alt: '...' },
 * //   'Architectural Design': { url: '...', alt: '...' },
 * //   ...
 * // }
 */
export function createServiceImageMap(serviceBoxes) {
    if (!serviceBoxes || !Array.isArray(serviceBoxes)) {
        return {};
    }

    const imageMap = {};

    serviceBoxes.forEach((box) => {
        if (!box?.image?.url) return;

        const imageData = {
            url: box.image.url,
            alt: box.image.alt || box.title || "Service",
        };

        // Map by slug extracted from URL
        const slug = extractSlugFromUrl(box.url);
        if (slug) {
            imageMap[slug] = imageData;
        }

        // Also map by normalized title for fallback matching
        if (box.title) {
            const normalizedTitle = normalizeTitle(box.title);
            imageMap[normalizedTitle] = imageData;
        }
    });

    return imageMap;
}

/**
 * Gets the appropriate image for a service grid display.
 * Prioritizes homepage images over service's own images for consistency.
 *
 * @param {Object} service - The service object from the services array
 * @param {Object} imageMap - The image map created by createServiceImageMap
 * @returns {Object|null} - The image object { url, alt } or null if not found
 *
 * @example
 * const imageMap = createServiceImageMap(homepageData.serviceBoxes);
 * const image = getServiceGridImage(service, imageMap);
 * if (image) {
 *   <Image src={image.url} alt={image.alt} ... />
 * }
 */
export function getServiceGridImage(service, imageMap) {
    if (!service) return null;

    // Try to find a matching homepage image
    if (imageMap && Object.keys(imageMap).length > 0) {
        // Try matching by slug first
        if (service.slug && imageMap[service.slug.toLowerCase()]) {
            return imageMap[service.slug.toLowerCase()];
        }

        // Try matching by normalized title
        if (service.title) {
            const normalizedTitle = normalizeTitle(service.title);
            if (imageMap[normalizedTitle]) {
                return imageMap[normalizedTitle];
            }
        }
    }

    // Fallback to service's own images (displayImage > bannerImage > image)
    // These are the original images still needed for /services/[slug] pages
    if (service.displayImage?.url) {
        return {
            url: service.displayImage.url,
            alt: service.displayImage.alt || service.title || "Service",
        };
    }

    if (service.bannerImage?.url) {
        return {
            url: service.bannerImage.url,
            alt: service.bannerImage.alt || service.title || "Service",
        };
    }

    if (service.image?.url) {
        return {
            url: service.image.url,
            alt: service.image.alt || service.title || "Service",
        };
    }

    return null;
}

/**
 * Checks if a service has a mapped homepage image available.
 *
 * @param {Object} service - The service object
 * @param {Object} imageMap - The image map from createServiceImageMap
 * @returns {boolean} - True if a homepage image is available
 */
export function hasHomepageImage(service, imageMap) {
    if (!service || !imageMap) return false;

    // Check by slug
    if (service.slug && imageMap[service.slug.toLowerCase()]) {
        return true;
    }

    // Check by title
    if (service.title) {
        const normalizedTitle = normalizeTitle(service.title);
        return !!imageMap[normalizedTitle];
    }

    return false;
}
