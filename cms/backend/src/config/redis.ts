import Redis from "ioredis";

// Local Redis configuration
const redisConfig = {
    port: 6379,
    host: "127.0.0.1",
    // username: undefined,
    // password: undefined,
    // tls: undefined,
    maxRetriesPerRequest: null,
};

// Create a Redis client instance
const redisClient = new Redis(redisConfig);

redisClient.on("connect", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

export default redisClient;
