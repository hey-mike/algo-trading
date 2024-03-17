// app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import { config } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { dataProxyRouter } from "./routes/dataProxy";
import { strategyRouter } from "./routes/strategy";
import { authRouter } from "./routes/api.route";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit(config.rateLimiter));

// Authentication Middleware
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// Routes
app.use("/api/data", authenticateToken, dataProxyRouter);
app.use("/api/strategies", authenticateToken, strategyRouter);
app.use("/api/auth", authRouter);

// Error Handling Middleware
app.use(errorHandler);

export default app;
