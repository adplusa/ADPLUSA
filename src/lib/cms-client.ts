/**
 * CMS Client Module
 * Fetches content from the CMS backend API.
 * All caching is handled server-side by the backend Redis middleware.
 */

import type {
    Homepage, Project, Service, About, Contact, FAQ,
    GeneralSettings, MainServicePage, ProjectsPage, CMSResponse,
} from "./cms-types";

const CMS_API_URL = (process.env.NEXT_PUBLIC_CMS_API_URL || "http://localhost:8000")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

const DEFAULT_REVALIDATE = 0;

interface FetchOptions {
    revalidate?: number | false;
    tags?: string[];
}

async function fetchCMS<T>(endpoint: string, options: FetchOptions = {}): Promise<T | null> {
    const { revalidate = DEFAULT_REVALIDATE, tags } = options;

    try {
        const url = `${CMS_API_URL}/api/public${endpoint}`;
        const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
            headers: { "Content-Type": "application/json" },
        };

        if (typeof revalidate === "number" || revalidate === false) {
            fetchOptions.next = { revalidate };
        }
        if (tags && tags.length > 0) {
            fetchOptions.next = { ...fetchOptions.next, tags };
        }
        if (revalidate === 0) {
            fetchOptions.cache = "no-store";
        }

        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            console.error(`CMS fetch failed: ${endpoint} - Status: ${response.status}`);
            return null;
        }

        const result: CMSResponse<T> = await response.json();
        if (!result.success) {
            console.error(`CMS API error: ${endpoint} - ${result.error}`);
            return null;
        }

        return result.data;
    } catch (error) {
        console.error(`CMS fetch error: ${endpoint}`, error);
        return null;
    }
}

/**
 * Fetch all pages of paginated data until the end.
 * Used for endpoints that return paginated results.
 */
async function fetchAllPages<T>(endpoint: string, options: FetchOptions = {}): Promise<T[] | null> {
    const { revalidate = DEFAULT_REVALIDATE, tags } = options;
    const allData: T[] = [];
    let page = 1;
    let hasMore = true;

    try {
        while (hasMore) {
            const paginatedEndpoint = `${endpoint}${endpoint.includes("?") ? "&" : "?"}page=${page}`;
            const url = `${CMS_API_URL}/api/public${paginatedEndpoint}`;
            const fetchOptions: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } = {
                headers: { "Content-Type": "application/json" },
            };

            if (typeof revalidate === "number" || revalidate === false) {
                fetchOptions.next = { revalidate };
            }
            if (tags && tags.length > 0) {
                fetchOptions.next = { ...fetchOptions.next, tags };
            }
            if (revalidate === 0) {
                fetchOptions.cache = "no-store";
            }

            const response = await fetch(url, fetchOptions);
            if (!response.ok) {
                console.error(`CMS fetch failed: ${paginatedEndpoint} - Status: ${response.status}`);
                break;
            }

            const result: CMSResponse<T[]> = await response.json();
            if (!result.success || !result.data) {
                break;
            }

            allData.push(...result.data);

            // Check if there are more pages
            // If we got fewer items than the limit (default 20), we've reached the end
            if (result.data.length < 20) {
                hasMore = false;
            }

            page++;
        }

        return allData.length > 0 ? allData : null;
    } catch (error) {
        console.error(`CMS fetch all pages error: ${endpoint}`, error);
        return null;
    }
}

// Homepage
export async function getHomepage(options?: FetchOptions): Promise<Homepage | null> {
    return fetchCMS<Homepage>("/homepage", { ...options, tags: ["homepage", ...(options?.tags || [])] });
}

// Projects
export async function getProjects(options?: FetchOptions): Promise<Project[] | null> {
    return fetchAllPages<Project>("/projects", { ...options, tags: ["projects", ...(options?.tags || [])] });
}

export async function getProject(slug: string, options?: FetchOptions): Promise<Project | null> {
    if (!slug) return null;
    return fetchCMS<Project>(`/projects/${encodeURIComponent(slug)}`, { ...options, tags: ["projects", `project-${slug}`, ...(options?.tags || [])] });
}

export async function getFeaturedProjects(options?: FetchOptions): Promise<Project[] | null> {
    return fetchAllPages<Project>("/projects?featured=true", { ...options, tags: ["projects", "featured-projects", ...(options?.tags || [])] });
}

export async function getProjectSlugs(): Promise<string[]> {
    const projects = await getProjects({ revalidate: false });
    return projects ? projects.map((p) => p.slug) : [];
}

// Services
export async function getServices(options?: FetchOptions): Promise<Service[] | null> {
    return fetchAllPages<Service>("/services", { ...options, tags: ["services", ...(options?.tags || [])] });
}

export async function getService(slug: string, options?: FetchOptions): Promise<Service | null> {
    if (!slug) return null;
    return fetchCMS<Service>(`/services/${encodeURIComponent(slug)}`, { ...options, tags: ["services", `service-${slug}`, ...(options?.tags || [])] });
}

export async function getServiceSlugs(): Promise<string[]> {
    const services = await getServices({ revalidate: false });
    return services ? services.map((s) => s.slug) : [];
}

// Static Pages
export async function getAbout(options?: FetchOptions): Promise<About | null> {
    return fetchCMS<About>("/about", { ...options, tags: ["about", ...(options?.tags || [])] });
}

export async function getContact(options?: FetchOptions): Promise<Contact | null> {
    return fetchCMS<Contact>("/contact", { ...options, tags: ["contact", ...(options?.tags || [])] });
}

export async function getFAQ(options?: FetchOptions): Promise<FAQ | null> {
    return fetchCMS<FAQ>("/faq", { ...options, tags: ["faq", ...(options?.tags || [])] });
}

export async function getMainServicePage(options?: FetchOptions): Promise<MainServicePage | null> {
    return fetchCMS<MainServicePage>("/main-service-page", { ...options, tags: ["main-service-page", ...(options?.tags || [])] });
}

export async function getProjectsPage(options?: FetchOptions): Promise<ProjectsPage | null> {
    return fetchCMS<ProjectsPage>("/projects-page", { ...options, tags: ["projects-page", ...(options?.tags || [])] });
}

export async function getGeneralSettings(options?: FetchOptions): Promise<GeneralSettings | null> {
    return fetchCMS<GeneralSettings>("/general-settings", { ...options, tags: ["general-settings", ...(options?.tags || [])] });
}

export async function checkCMSHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${CMS_API_URL}/api/health`, { method: "GET", cache: "no-store" });
        return response.ok;
    } catch { return false; }
}

export function getCMSApiUrl(): string { return CMS_API_URL; }
