import dotenv from 'dotenv';
dotenv.config();

export const config = {
  apiKey: process.env.API_KEY,
  BINANCE_WS_URL: process.env.BINANCE_WS_URL,
  restApiUrl: process.env.REST_API_URL,
};