// backend/middleware/authMiddleware.js
import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes middleware
const authMiddleware = async (req, res, next) => {
    // Receive token from header
    const token = req.header('Authorization')?.split(' ')[1];
    console.log("token", token);
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        //Method to Verify the token with secret key and get the user details
        console.log("verify", token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        console.log("decoded", decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin role authorization middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

// Provider role authorization middleware
const provider = (req, res, next) => {
    if (req.user && req.user.role === 'provider') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as provider' });
    }
};


export default authMiddleware;
