/**
 * CMS Client Module
 * Provides typed functions for fetching content from the custom CMS API
 * Supports SSR, SSG, and ISR with proper error handling
 */

import type {
    Homepage,
    Project,
    Service,
    About,
    Contact,
    FAQ,
    GeneralSettings,
    MainServicePage,
    ProjectsPage,
    CMSResponse,
} from "./cms-types";

/**
 * CMS API base URL from environment variable
 * Falls back to localhost for development
 */
const CMS_API_URL = (
    process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8000"
)
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

/**
 * Default revalidation time in seconds for ISR
 */
const DEFAULT_REVALIDATE = 0;

/**
 * Fetch options for Next.js data fetching
 */
interface FetchOptions {
    revalidate?: number | false;
    tags?: string[];
}

/**
 * Generic fetch function for CMS API endpoints
 * Handles errors gracefully by returning null instead of throwing
 *
 * @param endpoint - API endpoint path (without /api/public prefix)
 * @param options - Next.js fetch options for caching/revalidation
 * @returns The data or null if an error occurred
 */
async function fetchCMS<T>(
    endpoint: string,
    options: FetchOptions = {},
): Promise<T | null> {
    const { revalidate = DEFAULT_REVALIDATE, tags } = options;
    const isServer = typeof window === "undefined";

    let cacheKey = "";
    let redis: any = null;

    // 1. Try to get from Redis cache first (Server only)
    // 1. Try to get from Redis cache first (Server only)
    if (isServer) {
        try {
            // Dynamic import to prevent client-side bundling of ioredis
            const redisModule = await import("./redis");
            redis = redisModule.redis;

            if (redis) {
                // We use the full endpoint as part of the key to match backend invalidation
                cacheKey = `cms:${endpoint}`;

                try {
                    const cachedData = await redis.get(cacheKey);
                    if (cachedData) {
                        console.log(`[Redis] HIT 🚀: ${cacheKey}`);
                        return JSON.parse(cachedData) as T;
                    }
                    console.log(`[Redis] MISS 💨: ${cacheKey}`);
                } catch (redisError) {
                    // Gracefully handle Redis errors (e.g., connection lost) and fall back to DB
                    console.warn(
                        `[Redis] Error getting key ${cacheKey}, falling back to DB:`,
                        redisError,
                    );
                }
            }
        } catch (importError) {
            console.error("Failed to import or use Redis module:", importError);
        }
    }

    try {
        const url = `${CMS_API_URL}/api/public${endpoint}`;

        console.log(`[API] Fetching from DB 📦: ${endpoint}`);

        const fetchOptions: RequestInit & {
            next?: { revalidate?: number | false; tags?: string[] };
        } = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        // Add Next.js specific options for caching
        if (typeof revalidate === "number" || revalidate === false) {
            fetchOptions.next = { revalidate };
        }
        if (tags && tags.length > 0) {
            fetchOptions.next = { ...fetchOptions.next, tags };
        }

        // Explicitly prevent caching if revalidate is 0
        if (revalidate === 0) {
            fetchOptions.cache = "no-store";
        }

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            console.error(
                `CMS fetch failed: ${endpoint} - Status: ${response.status}`,
            );
            return null;
        }

        const result: CMSResponse<T> = await response.json();

        if (!result.success) {
            console.error(`CMS API error: ${endpoint} - ${result.error}`);
            return null;
        }

        // 2. Save successful response to Redis (Server only)
        if (isServer && redis && cacheKey) {
            try {
                // Store with no expiry (or very long one), relying on backend invalidation
                await redis.set(cacheKey, JSON.stringify(result.data));
                console.log(`[Redis] SET 💾: ${cacheKey}`);
            } catch (redisError) {
                // Similarly, if setting cache fails, just log it and move on
                console.warn(
                    `[Redis] Error setting key ${cacheKey}:`,
                    redisError,
                );
            }
        }

        return result.data;
    } catch (error) {
        console.error(`CMS fetch error: ${endpoint}`, error);
        return null;
    }
}

// ============================================================================
// Homepage
// ============================================================================

/**
 * Fetch homepage content (singleton document)
 */
export async function getHomepage(
    options?: FetchOptions,
): Promise<Homepage | null> {
    return fetchCMS<Homepage>("/homepage", {
        ...options,
        tags: ["homepage", ...(options?.tags || [])],
    });
}

// ============================================================================
// Projects
// ============================================================================

/**
 * Fetch all projects sorted by order
 */
export async function getProjects(
    options?: FetchOptions,
): Promise<Project[] | null> {
    return fetchCMS<Project[]>("/projects", {
        ...options,
        tags: ["projects", ...(options?.tags || [])],
    });
}

/**
 * Fetch a single project by slug
 */
export async function getProject(
    slug: string,
    options?: FetchOptions,
): Promise<Project | null> {
    if (!slug) {
        console.error("getProject: slug is required");
        return null;
    }
    return fetchCMS<Project>(`/projects/${encodeURIComponent(slug)}`, {
        ...options,
        tags: ["projects", `project-${slug}`, ...(options?.tags || [])],
    });
}

/**
 * Fetch only featured projects
 * Used for carousels and featured project sections
 */
export async function getFeaturedProjects(
    options?: FetchOptions,
): Promise<Project[] | null> {
    return fetchCMS<Project[]>("/projects?featured=true", {
        ...options,
        tags: ["projects", "featured-projects", ...(options?.tags || [])],
    });
}

/**
 * Get all project slugs for static generation
 */
export async function getProjectSlugs(): Promise<string[]> {
    const projects = await getProjects({ revalidate: false });
    if (!projects) return [];
    return projects.map((project) => project.slug);
}

// ============================================================================
// Services
// ============================================================================

/**
 * Fetch all services sorted by order
 */
export async function getServices(
    options?: FetchOptions,
): Promise<Service[] | null> {
    return fetchCMS<Service[]>("/services", {
        ...options,
        tags: ["services", ...(options?.tags || [])],
    });
}

/**
 * Fetch a single service by slug
 */
export async function getService(
    slug: string,
    options?: FetchOptions,
): Promise<Service | null> {
    if (!slug) {
        console.error("getService: slug is required");
        return null;
    }
    return fetchCMS<Service>(`/services/${encodeURIComponent(slug)}`, {
        ...options,
        tags: ["services", `service-${slug}`, ...(options?.tags || [])],
    });
}

/**
 * Get all service slugs for static generation
 */
export async function getServiceSlugs(): Promise<string[]> {
    const services = await getServices({ revalidate: false });
    if (!services) return [];
    return services.map((service) => service.slug);
}

// ============================================================================
// Static Pages
// ============================================================================

/**
 * Fetch about page content (singleton document)
 */
export async function getAbout(options?: FetchOptions): Promise<About | null> {
    return fetchCMS<About>("/about", {
        ...options,
        tags: ["about", ...(options?.tags || [])],
    });
}

/**
 * Fetch contact page content (singleton document)
 */
export async function getContact(
    options?: FetchOptions,
): Promise<Contact | null> {
    return fetchCMS<Contact>("/contact", {
        ...options,
        tags: ["contact", ...(options?.tags || [])],
    });
}

/**
 * Fetch FAQ content (singleton document)
 */
export async function getFAQ(options?: FetchOptions): Promise<FAQ | null> {
    return fetchCMS<FAQ>("/faq", {
        ...options,
        tags: ["faq", ...(options?.tags || [])],
    });
}

// ============================================================================
// Main Service Page
// ============================================================================

/**
 * Fetch main service page content (singleton document)
 * Used for the /mainservice page
 */
export async function getMainServicePage(
    options?: FetchOptions,
): Promise<MainServicePage | null> {
    return fetchCMS<MainServicePage>("/main-service-page", {
        ...options,
        tags: ["main-service-page", ...(options?.tags || [])],
    });
}

// ============================================================================
// Projects Page
// ============================================================================

/**
 * Fetch projects page content (singleton document)
 * Used for the /projects listing page SEO and heading
 */
export async function getProjectsPage(
    options?: FetchOptions,
): Promise<ProjectsPage | null> {
    return fetchCMS<ProjectsPage>("/projects-page", {
        ...options,
        tags: ["projects-page", ...(options?.tags || [])],
    });
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Check if the CMS API is available
 */
export async function checkCMSHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${CMS_API_URL}/api/health`, {
            method: "GET",
            cache: "no-store",
        });
        return response.ok;
    } catch {
        return false;
    }
}

// ============================================================================
// General Settings API Functions
// ============================================================================

/**
 * Fetch general settings (site logos, favicon, etc.)
 * @param options - Optional fetch options for caching
 * @returns GeneralSettings data or null if not found/error
 */
export async function getGeneralSettings(
    options?: FetchOptions,
): Promise<GeneralSettings | null> {
    return fetchCMS<GeneralSettings>("/general-settings", {
        ...options,
        tags: ["general-settings", ...(options?.tags || [])],
    });
}

/**
 * Get the CMS API URL (useful for debugging)
 */
export function getCMSApiUrl(): string {
    return CMS_API_URL;
}
