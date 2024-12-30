import crypto from "crypto";
import { checkOTP } from '../controllers/authController.js';
import Otp from '../models/otpModel.js';

// method to generate otp
const generateOTP = () => {
    return crypto.randomInt(100000, 999999);
};

// store opt to database using upsert
const storeOTP = async (email, otp) => {
    try {

        await Otp.upsert({
            email,
            otp,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error storing OTP:', error);
        throw new Error('Error storing OTP');
    }
};

// method to verify otp associated with that email 
const verifyOTP = async (email, otp) => {
    try {

        // check for otp with that email 
        const storedOTP = await Otp.findOne({ where: { email } });
        // console.log(storedOTP);

        if (storedOTP) {
            // checks for otp expired
            if (Date.now() - new Date(storedOTP.timestamp).getTime() > 600000) {
                await storedOTP.destroy();
                return { success: false, message: "OTP has expired" };
            }

            // returns response
            if (storedOTP.otp === otp) {
                return { success: true };
            } else {
                return { success: false, message: "Invalid OTP" };
            }
        } else {
            return { success: false, message: "No OTP found for this email" };
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Error verifying OTP");
    }
};

export { generateOTP, storeOTP, verifyOTP };
