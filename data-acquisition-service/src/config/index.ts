import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export const config = {
  // Server configuration
  PORT: process.env.PORT || 3000,

  // Redis configuration
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379", 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  REDIS_DB: parseInt(process.env.REDIS_DB || "0", 10),

  // API configuration
  API_KEY: process.env.API_KEY,

  // Binance WebSocket configuration
  BINANCE_WS_URL: process.env.BINANCE_WS_URL,
  WEB_SOCKET_URL: `${process.env.BINANCE_WS_URL}/${process.env.BINANCE_SYMBOL}`,

  // REST API configuration
  REST_API_URL: process.env.REST_API_URL,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || "amqp://localhost",
};
