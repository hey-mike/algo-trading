import WebSocket from 'ws';
import { config } from '../config';
import {processData} from '../utils/processData'

export const connectToMarketDataStream = (symbol: string): void => {
  const ws = new WebSocket(`${config.BINANCE_WS_URL}/${symbol}`);

  ws.on('open', () => {
    console.log('Connected to Binance WebSocket');
  });
  
  ws.on('message', (data) => {
    processData(data.toString()); // Implement your own logic to process the data
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};
