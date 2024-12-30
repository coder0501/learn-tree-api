// utils/jwtUtil.js
import jwt from 'jsonwebtoken';

// Method to generate token based on payload provided.
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export { generateToken };

