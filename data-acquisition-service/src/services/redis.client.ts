import Redis from "ioredis";
import { info, error } from "../utils/logger";
import { config } from "../config";

class RedisClient {
  private static client: Redis;

  public static getInstance(): Redis {
    if (!this.client) {
      this.initializeClient();
    }
    return this.client;
  }

  private static initializeClient(): void {
    this.client = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db: config.REDIS_DB,
    });

    this.client.on("connect", () => {
      info("Connected to Redis");
    });

    this.client.on("error", (err) => {
      error(`Redis connection error: ${err.message}`, err);
    });
  }
}

// Export the Redis client instance
export default RedisClient.getInstance();
