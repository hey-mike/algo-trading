import WebSocket from 'ws';
import { config } from '../config';

export const connectToMarketDataStream = (symbol: string): void => {
  const ws = new WebSocket(`${config.wsUrl}/${symbol}`);

  ws.on('open', () => {
    console.log('Connected to WebSocket');
  });

  ws.on('message', (data) => {
    console.log('Received data:', data);
    // Process WebSocket data here
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};
