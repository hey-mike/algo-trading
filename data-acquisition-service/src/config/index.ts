import dotenv from 'dotenv';
dotenv.config();

export const config = {
  apiKey: process.env.API_KEY,
  wsUrl: process.env.WS_URL,
  restApiUrl: process.env.REST_API_URL,
};