
import express from "express";
import { handlePersonalInfo, getProfileInfo } from "../controllers/profileController.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/personal-info", authMiddleware, handlePersonalInfo);
router.get("/", authMiddleware, getProfileInfo);

export default router;
