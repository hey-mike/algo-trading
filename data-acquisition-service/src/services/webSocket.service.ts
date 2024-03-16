// webSocket.service.ts
import WebSocket from "ws";
import { processData } from "../utils/processData";
import { config } from "../config";
import { cacheData } from "./cache.service";

export function initializeWebSocketConnection(): void {
  const ws = new WebSocket(config.WEB_SOCKET_URL);

  ws.on("open", () => {
    console.log("WebSocket connection established");
  });

  ws.on("message", async (data) => {
    const parsedData = JSON.parse(data.toString());
    const processedData = processData(parsedData);
    const cacheKey = `processed_data_${processedData.symbol}_${processedData.tradeId}`;
    await cacheData(processedData, cacheKey);
    // Perform other actions with the processed data
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    // Handle WebSocket errors
  });

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    // Handle WebSocket connection closure
  });
}
