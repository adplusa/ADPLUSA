import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const TTL = 3600; // 1 hour
const PREFIX = "cache:";

// Map of resource names to their corresponding Next.js cache tags
const FRONTEND_TAGS_MAP: Record<string, string[]> = {
    projects: ["projects", "featured-projects"],
    services: ["services", "main-service-page"],
    homepage: ["homepage"],
    about: ["about"],
    contact: ["contact"],
    faq: ["faq"],
    "general-settings": ["general-settings"],
    "main-service-page": ["main-service-page", "services"],
    "projects-page": ["projects-page", "projects"],
    tags: ["projects", "services"],
    media: ["projects", "services"],
};

/**
 * Trigger frontend revalidation for the given tags.
 * This calls the Next.js revalidation endpoint on the main frontend.
 */
async function triggerFrontendRevalidation(tags: string[]): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "https://adpl.vercel.app";
    const revalidationSecret = process.env.REVALIDATION_SECRET;

    if (!revalidationSecret) {
        console.warn("[Frontend Revalidation] REVALIDATION_SECRET not set, skipping frontend revalidation");
        return;
    }

    for (const tag of tags) {
        try {
            const response = await fetch(`${frontendUrl}/api/revalidate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tag }),
            });

            if (response.ok) {
                console.log(`[Frontend Revalidation] ✅ Revalidated tag: ${tag}`);
            } else {
                console.error(`[Frontend Revalidation] ❌ Failed to revalidate tag ${tag}: ${response.status}`);
            }
        } catch (err) {
            console.error(`[Frontend Revalidation] Error revalidating tag ${tag}:`, err);
        }
    }
}

/**
 * Auto-cache middleware (Django-style).
 *
 * - GET requests: serve from Redis if cached, otherwise let the handler run,
 *   capture the JSON response, and store it in Redis with a TTL.
 * - POST/PUT/DELETE requests: after the handler runs, invalidate related cache keys.
 */
export function cacheMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Only cache API routes
    if (!req.path.startsWith("/api/")) {
        next();
        return;
    }

    // Skip auth routes — never cache login/token responses
    if (req.path.startsWith("/api/auth")) {
        next();
        return;
    }

    if (req.method === "GET") {
        // Skip admin GET routes — admin data must always be fresh, never serve stale cache
        if (req.path.startsWith("/api/admin")) {
            next();
            return;
        }
        handleGet(req, res, next);
    } else if (["POST", "PUT", "DELETE"].includes(req.method)) {
        // All writes (including admin writes) must trigger cache invalidation
        handleWrite(req, res, next);
    } else {
        next();
    }
}

/**
 * Handle GET: try cache first, fall through to handler, then cache the response.
 * Admin endpoints (/api/admin/*) are never cached to ensure fresh data in CMS.
 */
async function handleGet(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Skip caching for admin endpoints — always serve fresh data in CMS
    if (req.path.startsWith("/api/admin/")) {
        console.log(`[Cache] SKIP (admin endpoint): ${req.originalUrl}`);
        res.setHeader("X-Cache", "SKIP");
        next();
        return;
    }

    const cacheKey = PREFIX + req.originalUrl;

    try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log(`[Cache] HIT: ${cacheKey}`);
            res.setHeader("X-Cache", "HIT");
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(cached);
            return;
        }
    } catch (err) {
        console.error(`[Cache] Redis GET error (continuing without cache):`, err);
        // Don't block the request if Redis fails
    }

    // Cache MISS — intercept res.json() to capture the response body
    console.log(`[Cache] MISS: ${cacheKey}`);
    res.setHeader("X-Cache", "MISS");

    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const serialized = JSON.stringify(body);
            redisClient.set(cacheKey, serialized, "EX", TTL).catch((err) => {
                console.error(`[Cache] Redis SET error (continuing without cache):`, err);
                // Don't block the response if Redis fails
            });
        }
        return originalJson(body);
    };

    next();
}

/**
 * Handle POST/PUT/DELETE: let the handler run, then clear ALL cache.
 */
function handleWrite(req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
        // Only invalidate on successful writes
        if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`[Cache] Clearing all cache after ${req.method} ${req.path}`);

            // Clear all cache keys
            redisClient.keys('cache:*').then(keys => {
                if (keys.length > 0) {
                    return redisClient.del(...keys);
                }
            }).then(() => {
                console.log(`[Cache] All cache cleared successfully`);
            }).catch((err) => {
                console.error(`[Cache] Error clearing cache:`, err);
            });

            // Trigger frontend revalidation for all tags
            const allTags = Array.from(new Set(Object.values(FRONTEND_TAGS_MAP).flat()));
            triggerFrontendRevalidation(allTags).catch((err) => {
                console.error(`[Frontend Revalidation] Error:`, err);
            });
        }
        return originalJson(body);
    } as any;

    next();
}
