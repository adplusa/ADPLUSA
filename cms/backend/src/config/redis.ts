import Redis from "ioredis";

let redisClient: Redis;

// Support REDIS_URL (Upstash, etc.) or individual host/port config
if (process.env.REDIS_URL) {
    redisClient = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
    });
} else {
    redisClient = new Redis({
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        host: process.env.REDIS_HOST || "127.0.0.1",
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
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
