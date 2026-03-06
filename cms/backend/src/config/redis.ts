import Redis from "ioredis";

let redisClient: Redis;

// Support REDIS_URL (Upstash, etc.) or individual host/port config
if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        connectTimeout: 10000, // 10 second timeout
        commandTimeout: 5000,  // 5 second command timeout
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;   
        },
        enableReadyCheck: false,
        enableOfflineQueue: false,
    });
} else {
    redisClient = new Redis({
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        host: process.env.REDIS_HOST || "127.0.0.1",
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
        connectTimeout: 10000,
        commandTimeout: 5000,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
        ...(process.env.REDIS_TLS === "true" && { tls: {} }),
    });
}

redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export default redisClient;
