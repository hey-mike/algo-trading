import axios from 'axios';
import { config } from '../config';

export const fetchMarketData = async (symbol: string): Promise<any> => {
  try {
    const response = await axios.get(`${config.restApiUrl}/${symbol}`, {
      headers: { 'X-API-KEY': config.apiKey },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
};
