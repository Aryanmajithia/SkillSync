import Redis from "ioredis";

const redisClient = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

export const redis = redisClient;
