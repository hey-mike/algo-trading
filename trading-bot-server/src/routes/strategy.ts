// routes/strategy.ts
import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { strategy } = req.body;
    const response = await axios.post(
      `${config.tradingStrategyServiceUrl}/strategies`,
      { strategy }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error creating strategy" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { strategy } = req.body;
    const response = await axios.put(
      `${config.tradingStrategyServiceUrl}/strategies/${id}`,
      { strategy }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error updating strategy" });
  }
});

export const strategyRouter = router;
