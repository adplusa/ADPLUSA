import Redis from "ioredis";

// Local Redis configuration
// In a real app, these should be env vars
const redisConfig = {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "127.0.0.1",
    maxRetriesPerRequest: null,
    // Add retry strategy to prevent crashing on connection failures
    retryStrategy: (times: number) => {
        // Retry a few times, then stop if it's persistent
        if (times > 3) {
            return null;
        }
        return Math.min(times * 50, 2000);
    },
};

// Global augmentation for development to prevent multiple instances
const globalForRedis = global as unknown as { redis: Redis | undefined };

let redisInstance: Redis | undefined;

try {
    redisInstance = globalForRedis.redis || new Redis(redisConfig);

    // Suppress unhandled error events from ioredis to prevent crashing
    redisInstance.on("error", (err) => {
        // Just log the error, don't crash
        // Use a less verbose log if it's just a connection refused during build/dev
        if ((err as any).code === "ECONNREFUSED") {
            // minimal logging for expected errors when redis is off
        } else {
            console.warn("[Redis] Connection error:", err.message);
        }
    });
} catch (error) {
    console.warn("Failed to initialize Redis client:", error);
}

export const redis = redisInstance;

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
