import { log, info, warn, error } from "./logger";
import { MarketData } from "../types/MarketData";

// Function to process and normalize trade data received from Binance WebSocket
export const processData = (data: string): MarketData => {
  const rawData = JSON.parse(data);

  const normalizedData: MarketData = {
    eventType: rawData.e,
    eventTime: rawData.E,
    symbol: rawData.s,
    price: rawData.p,
    quantity: rawData.q,
    tradeId: rawData.t,
    isBuyerMaker: rawData.m,
    tradeTime: rawData.T,
  };

  // Example: Log the normalized data
  // info(
  //   `Trade for ${normalizedData.symbol}: ${normalizedData.quantity} @ ${normalizedData.price}`
  // );

  return normalizedData;
};
