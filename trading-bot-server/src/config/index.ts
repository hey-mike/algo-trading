// src/config/index.ts
import dotenv from "dotenv";
dotenv.config();

export const config = {
  dataAcquisitionServiceURL:
    process.env.DATA_ACQUISITION_SERVICE_URL || "http://localhost:5001",
};
