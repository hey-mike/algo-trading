import express from "express";
import { fetchMarketData } from "./services/api.service";
import { initializeWebSocketConnection } from "./services/webSocket.service";
import { errorHandler } from "./utils/errorHandler";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/market-data/:symbol", fetchMarketData);

initializeWebSocketConnection();

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
