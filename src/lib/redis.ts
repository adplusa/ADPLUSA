import Redis from "ioredis";

// Local Redis configuration
// In a real app, these should be env vars
const redisConfig = {
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    host: process.env.REDIS_HOST || "127.0.0.1",
    maxRetriesPerRequest: null,
};

// Global augmentation for development to prevent multiple instances
const globalForRedis = global as unknown as { redis: Redis | undefined };

export const redis = globalForRedis.redis || new Redis(redisConfig);

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
