// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  dataAcquisitionServiceURL:
    process.env.DATA_ACQUISITION_SERVICE_URL || "http://localhost:5001",
  port: process.env.PORT || 5003,
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  rateLimiter: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};
