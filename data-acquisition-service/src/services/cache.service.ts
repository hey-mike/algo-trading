import redis from "./redis.client";
import { info, error } from "../utils/logger";

// Function to cache data using Redis
export const cacheData = async (
  data: any,
  key: string,
  expirationTime: number = 3600
): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(data), "EX", expirationTime);
    // info(`Data cached successfully with key: ${key}`);
  } catch (err) {
    error("Error caching data:", err);
    throw err;
  }
};

// Function to retrieve cached data from Redis
export const getCachedData = async (key: string): Promise<any> => {
  try {
    const data = await redis.get(key);
    if (data) {
      info(`Retrieved cached data for key: ${key}`);
      return JSON.parse(data);
    }
    info(`No cached data found for key: ${key}`);
    return null;
  } catch (err) {
    error("Error retrieving cached data:", err);
    throw err;
  }
};

// Function to remove cached data from Redis
export const removeCachedData = async (key: string): Promise<void> => {
  try {
    await redis.del(key);
    info(`Removed cached data for key: ${key}`);
  } catch (err) {
    error("Error removing cached data:", err);
    throw err;
  }
};
