import Redis from "ioredis";
import { info, error } from "../utils/logger"; // Adjust based on your actual logger's path

// Configuration for Redis client connection
const redisConfig = {
  host: process.env.REDIS_HOST || "127.0.0.1", // Default to localhost if not specified
  port: parseInt(process.env.REDIS_PORT || "6379", 10), // Default Redis port
  password: process.env.REDIS_PASSWORD || undefined, // Include if your Redis server requires authentication
  db: parseInt(process.env.REDIS_DB || "0", 10), // Default DB index
};

const redis = new Redis(redisConfig);

redis.on("connect", () => {
  info("Connected to Redis");
});

redis.on("error", (err) => {
  error("Redis error:", err);
});

export default redis;
