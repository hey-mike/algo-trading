import Redis from "ioredis";
import { info, error } from "../utils/logger";
import { config } from "../config";

// Create a new Redis client instance
const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  db: config.REDIS_DB,
});

// Event listener for successful connection
redis.on("connect", () => {
  info("Connected to Redis");
});

// Event listener for connection errors
redis.on("error", (err) => {
  error("Redis connection error:", err);
});

export default redis;
