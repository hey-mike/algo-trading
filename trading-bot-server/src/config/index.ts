// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5003,
  dataAcquisitionServiceURL:
    process.env.DATA_ACQUISITION_SERVICE_URL || "http://localhost:5001",
  tradingStrategyServiceUrl:
    process.env.TRADING_STRATEGY_SVERICE_URL || "http://localhost:5002",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  rateLimiter: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || "localhost",
  RABBITMQ_URL: `amqp://${process.env.RABBITMQ_HOST}`,
  RABBITMQ_MARKET_EXCHANGE: "market_data",
  RABBITMQ_ORDER_EXCHANGE: "order_status",
  RABBITMQ_EXCHANGE_TYPE: "topic",
  RABBITMQ_ORDER_STATUS_ROUTING_KEY: "order.status.*",
};
