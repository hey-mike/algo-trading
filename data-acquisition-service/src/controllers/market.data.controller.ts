// marketDataController.ts
import { Request, Response, NextFunction } from "express";
import { fetchMarketData } from "../services/api.service";

const validSymbols = ["BTCUSDT", "ETHUSDT", "BNBUSDT"];

function isValidSymbol(symbol: string): boolean {
  return validSymbols.includes(symbol);
}

export const getMarketData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { symbol } = req.params;
    // Validate the symbol parameter
    if (!isValidSymbol(symbol)) {
      throw new Error("Invalid symbol");
    }

    const data = await fetchMarketData(symbol);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
