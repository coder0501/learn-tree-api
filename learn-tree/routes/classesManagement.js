import express from "express";
import { createClass } from "../controllers/classesManagementController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// classesManagement Routes
router.post("/create-class", authMiddleware, createClass);

// router.get();

export default router;
