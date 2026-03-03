import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const TTL = 3600; // 1 hour
const PREFIX = "cache:";

/**
 * Map of resource paths to their related cache key patterns.
 * When a write hits /api/admin/projects, we clear all project-related cache.
 */
const INVALIDATION_MAP: Record<string, string[]> = {
    projects: ["cache:/api/public/projects*", "cache:/api/projects*"],
    services: ["cache:/api/public/services*", "cache:/api/services*", "cache:/api/public/main-service-page*"],
    homepage: ["cache:/api/public/homepage*"],
    about: ["cache:/api/public/about*", "cache:/api/about*"],
    contact: ["cache:/api/public/contact*", "cache:/api/contact*"],
    faq: ["cache:/api/public/faq*", "cache:/api/faq*"],
    "general-settings": ["cache:/api/public/general-settings*"],
    "main-service-page": ["cache:/api/public/main-service-page*", "cache:/api/public/services*"],
    "projects-page": ["cache:/api/public/projects-page*", "cache:/api/public/projects*"],
    tags: ["cache:/api/public/*"],
    media: ["cache:/api/public/*"],
};

/**
 * Extract the resource name from a URL path.
 * e.g. /api/admin/projects/123 -> "projects"
 *      /api/public/homepage -> "homepage"
 */
function getResource(path: string): string | null {
    // Match /api/admin/<resource> or /api/public/<resource> or /api/<resource>
    const match = path.match(/^\/api\/(?:admin\/|public\/)?([a-z-]+)/);
    return match ? match[1] : null;
}

/**
 * Clear all cache keys matching the given patterns.
 */
async function invalidatePatterns(patterns: string[]): Promise<void> {
    for (const pattern of patterns) {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(...keys);
                console.log(`[Cache] Invalidated ${keys.length} keys for pattern: ${pattern}`);
            }
        } catch (err) {
            console.error(`[Cache] Error invalidating pattern ${pattern}:`, err);
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
        handleGet(req, res, next);
    } else if (["POST", "PUT", "DELETE"].includes(req.method)) {
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
 * Handle POST/PUT/DELETE: let the handler run, then invalidate related cache.
 */
function handleWrite(req: Request, res: Response, next: NextFunction): void {
    const originalJson = res.json.bind(res);
    res.json = function (body: any) {
        // Only invalidate on successful writes
        if (res.statusCode >= 200 && res.statusCode < 300) {
            const resource = getResource(req.path);
            if (resource && INVALIDATION_MAP[resource]) {
                console.log(`[Cache] Invalidating cache for resource: ${resource}`);
                console.log(`[Cache] Patterns to invalidate:`, INVALIDATION_MAP[resource]);
                invalidatePatterns(INVALIDATION_MAP[resource]).catch((err) => {
                    console.error(`[Cache] Invalidation error:`, err);
                });
            } else if (resource) {
                // Fallback: if resource not in map, invalidate all cache for that resource
                const fallbackPatterns = [`cache:/api/public/${resource}*`, `cache:/api/${resource}*`];
                console.log(`[Cache] Resource ${resource} not in invalidation map, using fallback patterns:`, fallbackPatterns);
                invalidatePatterns(fallbackPatterns).catch((err) => {
                    console.error(`[Cache] Invalidation error:`, err);
                });
            } else {
                console.log(`[Cache] Could not extract resource from path: ${req.path}`);
            }
        }
        return originalJson(body);
    };

    next();
}
