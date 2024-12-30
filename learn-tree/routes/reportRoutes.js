import express from "express";
import { addReport } from "../controllers/reportController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/add-report", authMiddleware, addReport);

export default router;