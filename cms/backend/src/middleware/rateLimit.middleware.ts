import { Request, Response, NextFunction } from 'express';

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 50000; // Limit per IP

interface RateLimitRecord {
    count: number;
    resetTime: number;
}

const requestCounts = new Map<string, RateLimitRecord>();

// Cleanup interval: Remove expired entries every minute to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    requestCounts.forEach((value, key) => {
        if (now > value.resetTime) {
            requestCounts.delete(key);
        }
    });
}, 60 * 1000);

export const contactLimiter = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    const record = requestCounts.get(ip);

    if (!record) {
        requestCounts.set(ip, { count: 1, resetTime: now + WINDOW_MS });
        return next();
    }

    if (now > record.resetTime) {
        record.count = 1;
        record.resetTime = now + WINDOW_MS;
        return next();
    }

    if (record.count >= MAX_REQUESTS) {
        console.warn(`[Rate Limit] Blocked request from IP: ${ip}`);
        return res.status(429).json({
            success: false,
            error: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'You have exceeded the request limit. Please try again later.'
            }
        });
    }

    record.count++;
    next();
};