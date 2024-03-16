import express from 'express';
import { fetchMarketData } from './services/ApiService';
import { connectToMarketDataStream } from './services/WebSocketService';

const app = express();

// Example route using ApiService
app.get('/market-data/:symbol', async (req, res) => {
  try {
    const data = await fetchMarketData(req.params.symbol);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Example WebSocket connection
connectToMarketDataStream('btcusdt@trade');

export default app;
