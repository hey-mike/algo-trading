import express, { Request, Response } from "express";
import axios from "axios";
import { config } from "../config";

const router = express.Router();

router.get("/real-time/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `${config.dataAcquisitionServiceUrl}/real-time/${symbol}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching real-time data" });
  }
});

router.get("/historical/:symbol", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(
      `${config.dataAcquisitionServiceUrl}/historical/${symbol}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching historical data" });
  }
});

export const dataProxyRouter = router;
