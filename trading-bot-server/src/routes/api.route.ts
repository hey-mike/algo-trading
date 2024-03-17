// src/routes/apiRoutes.ts
import express from "express";
import * as dataController from "../controllers/data.controller";

const router = express.Router();

router.get("/data", dataController.getData);

export default router;
