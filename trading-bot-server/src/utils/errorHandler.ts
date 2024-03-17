// errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { AxiosError } from "axios";

function isAxiosError(err: any): err is AxiosError {
  return err.isAxiosError === true;
}

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

  if (isAxiosError(err) && err.response && err.response.status === 404) {
    return res.status(404).json({ error: "Symbol not found" });
  }

  res.status(500).json({ error: "Internal Server Error" });
};
