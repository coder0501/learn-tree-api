
import express from "express";
import { createUser, getUser, getAllUser, updateUser, deleteUser } from "../controllers/userManagementController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

// userManagement Routes
router.post("/create-user", authMiddleware, createUser);

router.get("/:id", authMiddleware, getUser);

router.get("/", authMiddleware, getAllUser);

router.put("/update-user/:id", authMiddleware, updateUser);

router.delete("/delete-user/:id", authMiddleware, deleteUser);

export default router;