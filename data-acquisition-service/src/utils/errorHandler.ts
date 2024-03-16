// errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err.message === "Invalid symbol") {
    return res.status(400).json({ error: "Invalid symbol" });
  }

  if (err.response && err.response.status === 404) {
    return res.status(404).json({ error: "Symbol not found" });
  }

  res.status(500).json({ error: "Internal Server Error" });
};
