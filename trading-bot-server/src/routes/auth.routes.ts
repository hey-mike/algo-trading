// routes/auth.ts
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config";

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Perform user authentication logic here
    // ...
    const token = jwt.sign({ username }, config.jwtSecret);
    res.json({ token });
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    // Perform user registration logic here
    // ...
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

export const authRouter = router;
