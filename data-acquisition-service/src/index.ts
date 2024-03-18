import app from "./app";
import { info, error } from "./utils/logger";
import redisClient from "./services/redis.client";
import { config } from "./config";
import { initializeWebSocketConnection } from "./services/webSocket.service";
import { rabbitMQPublisher } from "./services/rabbitMQ.publisher";

const port = config.PORT;

const startServer = async () => {
  try {
    // Attempt to connect to Redis
    await redisClient.ping();
    info("Connected to Redis successfully");

    await rabbitMQPublisher.ensureConnection();

    // Initialize WebSocket connection after successful Redis connection
    initializeWebSocketConnection();

    // Start listening for requests after successful Redis connection
    app.listen(port, () => {
      info(`Data Acquisition Service running on http://localhost:${port}`);
    });
  } catch (err) {
    error("Failed to connect to Redis:", err);
    process.exit(1); // Exit if cannot connect to Redis
  }
};

startServer();
