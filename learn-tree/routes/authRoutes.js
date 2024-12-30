

import express from "express";
import { handleSignup, handleLogin, requestOTP, resetPassword, checkOTP } from "../controllers/authController.js";

const router = express.Router();
                                        
// auth routes
router.post("/signup", handleSignup);

router.post("/login", handleLogin);

//Forgot Routes
router.post('/forgot-password', requestOTP);

router.post('/check-OTP', checkOTP);

router.post('/reset-password', resetPassword);

router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
});

export default router;