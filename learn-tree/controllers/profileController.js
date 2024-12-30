import User from "../models/User.js";
import bcrypt from "bcrypt";
import { singleImageUpload } from "../services/fileUpload.js";

// Personal Info
export const handlePersonalInfo = (req, res) => {
    singleImageUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected' });
            } else {
                try {
                    console.log("Inside handle personal info");

                    const {
                        firstName,
                        lastName,
                        phoneNumber,
                        email,
                        password,
                        role
                    } = req.body;

                    // console.log("img->", req.form-data)
                    const userId = req.user.userId;
                    console.log("userId", userId);

                    const user = await User.findByPk(userId);
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    console.log(firstName,
                        lastName,
                        phoneNumber,
                        email,
                        password,
                        role);

                    user.firstName = firstName;
                    user.lastName = lastName;
                    user.email = email;
                    user.image = req.file.path.replace(/\\/g, '/');
                    user.role = role || user.role;
                    user.phoneNumber = phoneNumber || user.phoneNumber;

                    if (password) {
                        const salt = await bcrypt.genSalt(10);  // Generate salt
                        user.password = await bcrypt.hash(password, salt);  // Hash the password
                    }

                    console.log("user", user)
                    await user.save();
                    res.status(200).json({ user, message: 'Profile updated successfully' });
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Server error' });
                }
            }
        }
    });
};

export const getProfileInfo = async (req, res) => {
    try {

        const userId = req.user.userId;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }

        res.status(200).json({ user: userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

