// webSocket.service.ts
import WebSocket from "ws";
import { processData } from "../utils/processData";
import { config } from "../config";
import { cacheData } from "./cache.service";
import * as logger from "../utils/logger";
import { rabbitMQPublisher } from "./rabbitMQ.publisher";

export function initializeWebSocketConnection(): void {
  const ws = new WebSocket(config.WEB_SOCKET_URL);

  ws.on("open", () => {
    logger.info("WebSocket connection established");
  });

  ws.on("message", async (data) => {
    const marketData = processData(data.toString());
    const cacheKey = `processed_data_${marketData.symbol}_${marketData.tradeId}`;
    await cacheData(marketData, cacheKey);
    // Perform other actions with the processed data
    try {
      await rabbitMQPublisher.publish(marketData);
    } catch (error) {
      logger.error("Failed to publish market data", error);
    }
  });

  ws.on("error", (err) => {
    logger.error("WebSocket error:", err);
    // Handle WebSocket errors
  });

  ws.on("close", () => {
    logger.info("WebSocket connection closed");
    // Handle WebSocket connection closure
  });
}
