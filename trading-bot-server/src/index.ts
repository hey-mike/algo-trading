// trading-bot-server/src/index.ts
import http from "http";
import app from "./app";
import { info, error } from "./utils/logger";
import { config } from "./config";
import { setupWebSocketServer } from "./services/socket.server";
import {
  connectToRabbitMQ,
  closeRabbitMQConnection,
} from "./services/mq.service";

const startServer = async () => {
  try {
    const httpServer = http.createServer(app);
    const io = setupWebSocketServer(httpServer);

    connectToRabbitMQ()
      .then(() => {
        // Start the server
        const server = app.listen(config.PORT, () => {
          console.log(`Trading Bot Server is running on port ${config.PORT}`);
        });
        setupWebSocketServer(server);
      })
      .catch((error) => {
        console.error("Failed to start the server:", error);
        process.exit(1);
      });
  } catch (err) {
    error("Failed to connect to Redis:", err);
    process.exit(1); // Exit if cannot connect to Redis
  }
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down the server...");
  await closeRabbitMQConnection();
  process.exit(0);
});
