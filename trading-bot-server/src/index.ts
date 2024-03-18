// app.ts
import express, { Application } from "express";
import http from "http";
import { WebSocketService } from "./services/websocket.service";
import { RabbitMQConsumer } from "./services/rabbitMQ.consumer";
import { config } from "./config";
import logger from "./utils/logger";

const app: Application = express();

// Middleware and route setup
// ...

const server = http.createServer(app);
const webSocketService = new WebSocketService(server);
const rabbitMQConsumer = new RabbitMQConsumer(webSocketService);

// Connect to RabbitMQ
rabbitMQConsumer
  .connect()
  .then(() => {
    // Start the server
    server.listen(config.PORT, () => {
      logger.info(`Trading Bot Server is running on port ${config.PORT}`);
    });
  })
  .catch((error) => {
    logger.error("Failed to start the server:", error);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down the server...");
  await rabbitMQConsumer.disconnect();
  process.exit(0);
});
