import axios from "axios";
import { config } from "../config";

export const fetchMarketData = async (symbol: string): Promise<any> => {
  try {
    const response = await axios.get(`${config.REST_API_URL}/${symbol}`, {
      headers: { "X-API-KEY": config.API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching market data:", error);
    throw error;
  }
};
