// src/app.ts
import express from "express";
import apiRoutes from "./routes/api.route";

const app = express();

app.use(express.json());
app.use("/api", apiRoutes);

export default app;
