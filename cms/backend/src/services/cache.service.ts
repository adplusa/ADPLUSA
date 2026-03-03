import redisClient from "../config/redis";

/**
 * Cache Service
 * Handles all Redis cache operations for the CMS
 */
export const CacheService = {
    /**
     * Set a value in the cache
     * @param key Cache key
     * @param value data to cache (will be JSON stringified)
     * @param ttl Time to live in seconds (optional)
     */
    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const serializedValue = JSON.stringify(value);
            if (ttl) {
                await redisClient.set(key, serializedValue, "EX", ttl);
            } else {
                await redisClient.set(key, serializedValue);
            }
        } catch (error) {
            console.error(`Cache set error [${key}]:`, error);
        }
    },

    /**
     * Get a value from the cache
     * @param key Cache key
     * @returns Parsed data or null
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await redisClient.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (error) {
            console.error(`Cache get error [${key}]:`, error);
            return null;
        }
    },

    /**
     * Delete a value from the cache
     * @param key Cache key
     */
    async del(key: string): Promise<void> {
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error(`Cache del error [${key}]:`, error);
        }
    },

    /**
     * Delete multiple keys matching a pattern
     * @param pattern glob-style pattern (e.g. "cms:projects:*")
     */
    async clearPattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
                console.log(
                    `Cleared ${keys.length} keys matching pattern: ${pattern}`,
                );
            }
        } catch (error) {
            console.error(`Cache clearPattern error [${pattern}]:`, error);
        }
    },

    // =========================================================================
    // Invalidation Helpers
    // =========================================================================

    /**
     * Invalidate all project-related cache
     */
    async invalidateProjects(): Promise<void> {
        console.log("🔥 Invalidating Projects Cache (List + Page)");
        // Invalidate the main projects list
        await this.clearPattern("cache:/api/public/projects*");

        // Invalidate the projects page singleton
        await this.del("cache:/api/public/projects-page");
    },

    /**
     * Invalidate a specific project and the list
     * @param slug Project slug
     */
    async invalidateProject(slug: string): Promise<void> {
        console.log(`🔥 Invalidating Project Cache: ${slug}`);
        await this.invalidateProjects();
        if (slug) {
            await this.del(`cache:/api/public/projects/${slug}`);
        }
    },

    /**
     * Invalidate all service-related cache
     */
    async invalidateServices(): Promise<void> {
        console.log("🔥 Invalidating Services Cache (List + Page)");
        // Invalidate the main services list
        await this.clearPattern("cache:/api/public/services*");

        // Invalidate the main service page singleton
        await this.del("cache:/api/public/main-service-page");
    },

    /**
     * Invalidate a specific service and the list
     * @param slug Service slug
     */
    async invalidateService(slug: string): Promise<void> {
        console.log(`🔥 Invalidating Service Cache: ${slug}`);
        await this.invalidateServices();
        if (slug) {
            await this.del(`cache:/api/public/services/${slug}`);
        }
    },

    /**
     * Invalidate homepage cache
     */
    async invalidateHomepage(): Promise<void> {
        console.log("🔥 Invalidating Homepage Cache");
        await this.clearPattern("cache:/api/public/homepage*");
    },

    /**
     * Invalidate about page cache
     */
    async invalidateAbout(): Promise<void> {
        console.log("🔥 Invalidating About Page Cache");
        await this.del("cache:/api/public/about");
    },

    /**
     * Invalidate contact page cache
     */
    async invalidateContact(): Promise<void> {
        console.log("🔥 Invalidating Contact Page Cache");
        await this.del("cache:/api/public/contact");
    },

    /**
     * Invalidate FAQ cache
     */
    async invalidateFAQ(): Promise<void> {
        console.log("🔥 Invalidating FAQ Cache");
        await this.del("cache:/api/public/faq");
    },

    /**
     * Invalidate General Settings cache
     */
    async invalidateGeneralSettings(): Promise<void> {
        console.log("🔥 Invalidating General Settings Cache");
        await this.clearPattern("cache:/api/public/general-settings*");
    },
};
