// src/controllers/dataController.ts
import { Request, Response } from "express";
import { fetchData } from "../services/dataService";

export const getData = async (req: Request, res: Response) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch data" });
  }
};
