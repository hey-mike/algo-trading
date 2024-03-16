import WebSocket from "ws";
import { config } from "../config";
import { processData } from "../utils/processData";
import { log, info, warn, error } from "../utils/logger";
import { cacheData } from "./cache.service";

export const connectToMarketDataStream = (symbol: string): void => {
  const ws = new WebSocket(`${config.BINANCE_WS_URL}/${symbol}`);

  ws.on("open", () => {
    info("Connected to Binance WebSocket");
  });

  ws.on("message", async (data) => {
    const processedData = processData(data.toString());
    await cacheData(processedData); // Cache the processed data
  });

  ws.on("error", (err) => {
    error("WebSocket error:", err);
  });
};
