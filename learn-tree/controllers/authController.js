// Necessary imports 
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/jwtUtil.js';
import Otp from '../models/otpModel.js';
import { generateOTP, storeOTP, verifyOTP } from '../utils/otp.js';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();    

// Handling Signup, receving and sending user after creating account
const handleSignup = async (req, res) => {
    try {

        const {
            businessName,
            firstName,
            lastName,
            email,
            password,
            role
        } = req.body;

        // Check for existing user
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Creating new user 
        const newUser = await User.create({
            businessName,
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role
        });

        return res.status(200).json({ message: "User Registered Successfully", user: newUser });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// Handling Login, by checking for existing email and 
// sends message for successful login according to role. 
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password)
        // Check for existing email
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Method to genrate token with the required payload.
        const token = generateToken({ userId: user.id, role: user.role });

        // Identifies role with successfull login
        let loginMessage;
        if (user.role === 'admin') {
            loginMessage = 'admin login successful';
        } else if (user.role === 'provider') {
            loginMessage = 'provider login successful';
        } else if (user.role === 'teacher') {
            loginMessage = 'teacher login successful';
        } else if (user.role === 'parent') {
            loginMessage = 'parent login successful';
        }

        return res.status(200).json({ message: loginMessage, userId: user.id, role: user.role, token });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: "Login Failed", error: error.message });
    }
};

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        });
        console.log('OTP sent to email:', email);
    } catch (error) {
        throw new Error(`Failed to send OTP: ${error.message}`);
    }
};

// Request for OTP after user enters the email
const requestOTP = async (req, res) => {
    const { email } = req.body;
    try {

        // Find whether user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log(user)
            return res.status(404).json({ message: "User not found" });
        }

        // Generates OTP
        const otp = generateOTP();

        // Store OTP associated with that email
        await storeOTP(email, otp);

        // Attempt to send the email, handling errors specifically
        try {
            await sendOTPEmail(email, otp);

            res.status(200).json({ message: "OTP sent to your email" });
        } catch (emailError) {
            console.error('Error sending OTP email:', emailError);
            res.status(500).json({ message: "Failed to send OTP email" });
        }

    } catch (error) {
        console.error('Error processing OTP request:', error);
        res.status(500).json({ message: "Failed to process OTP request" });
    }
};

// Check OTP is correct with the one user enters
const checkOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        // checks OTP and return success/fail message
        const otpVerification = await verifyOTP(email, otp);
        if (!otpVerification.success) {
            return res.status(400).json({ message: otpVerification.message });
        }

        return res.status(200).json({ message: "OTP verfication successfull" })
    } catch (error) {
        console.error('Error checking otp:', error);
        res.status(500).json({ message: 'Otp Verification failed' });
    }

};

// Checks for OTP not expired and then only allows to 
// set new password associated with that email
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Checks for OTP not expired to reset password
        const otpVerification = await verifyOTP(email, otp);
        if (!otpVerification.success) {
            return res.status(400).json({ message: otpVerification.message });
        }

        // Checks for user already exists with that email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hashing password for security
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

export { requestOTP, resetPassword, checkOTP, handleSignup, handleLogin };




// res.cookie('token', token, { httpOnly: true, secure: false, path: '/', sameSite: 'Lax', maxAge: 3600000 });
