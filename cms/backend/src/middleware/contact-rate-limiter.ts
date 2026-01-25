import { Request, Response, NextFunction } from 'express';

/**
 * In-memory store for rate limiting.
 * Note: For distributed systems (multiple server instances), use Redis instead.
 */
const requestCounts = new Map<string, { count: number; windowStart: number; blockedUntil: number }>();

/**
 * Rate Limiter Middleware for Contact Form
 * 
 * Limits the number of requests a single IP can make within a specific time window.
 * Rule: Max 5 requests per 15 seconds.
 * Penalty: Block for 1 hour if limit exceeded.
 */
export const contactRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  // Configuration
  const WINDOW_MS = 15 * 1000; // 15 seconds window
  const BLOCK_DURATION_MS = 60 * 60 * 1000; // 1 hour block
  const MAX_REQUESTS = 5; // Max requests per window

  // Get IP address (handle proxies if configured in express app)
  const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
  const now = Date.now();

  const record = requestCounts.get(ip as string);

  // New IP record
  if (!record) {
    requestCounts.set(ip as string, { count: 1, windowStart: now, blockedUntil: 0 });
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS - 1).toString());
    return next();
  }

  // Check if currently blocked
  if (now < record.blockedUntil) {
    const retryAfterSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    res.setHeader('Retry-After', retryAfterSeconds.toString());
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    return res.status(429).json({
      success: false,
      message: `Too many attempts. Please try again in ${Math.ceil(retryAfterSeconds / 60)} minutes.`
    });
  }

  // Check if window has expired (reset count)
  if (now - record.windowStart > WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
    record.blockedUntil = 0;
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS - 1).toString());
    return next();
  }

  // Increment count
  record.count++;

  // Check limit
  if (record.count > MAX_REQUESTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    const retryAfterSeconds = Math.ceil(BLOCK_DURATION_MS / 1000);
    res.setHeader('Retry-After', retryAfterSeconds.toString());
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', '0');
    return res.status(429).json({
      success: false,
      message: 'Too many attempts. You are blocked for 1 hour.'
    });
  }

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
  res.setHeader('X-RateLimit-Remaining', (MAX_REQUESTS - record.count).toString());
  return next();
};

// Cleanup interval to prevent memory leaks (runs every 10 minutes)
setInterval(() => {
  const now = Date.now();
  requestCounts.forEach((value, key) => {
    // Remove if not blocked AND window expired long ago (e.g. 1 min)
    if (now > value.blockedUntil && (now - value.windowStart > 60000)) {
      requestCounts.delete(key);
    }
  });
}, 10 * 60 * 1000);