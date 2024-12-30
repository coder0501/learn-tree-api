import Class from "../models/classManagement.js";
import ClassTerm from "../models/classTerm.js";
import { singleImageUpload } from "../services/fileUpload.js";

export const createClass = async (req, res) => {
    singleImageUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected' });
            } else {
                try {

                    console.log("Inside Class creation")
                    const loggedInUserId = req.user?.userId;
                    const role = req.user?.role;

                    if (role !== "admin") {
                        return res.status(403).json({
                            message: "Access denied. Only admins are allowed to create providers",
                        })
                    }

                    const {
                        className,
                        category,
                        phoneNumber,
                        email,
                        location,
                        desc,
                        status,
                        children // Expecting children array from the request body
                    } = req.body;

                    // Parse children if it's a string
                    const parsedChildren = typeof children === "string" ? JSON.parse(children) : children;

                    // Array.isArray(children)
                    console.log("Childrens Array->", Array.isArray(parsedChildren))
                    if (children && !Array.isArray(parsedChildren)) {
                        return res.status(400).json({
                            message: "Invalid data for children. It must be an array.",
                        });
                    }

                    const existingClass = await Class.findOne({ where: { email } });
                    if (existingClass) {
                        return res.status(400).json({
                            message: "Class with this email already exists"
                        });
                    }

                    const newClass = await Class.create({
                        userId: loggedInUserId,
                        userRole: role,
                        className,
                        category,
                        phoneNumber,
                        email,
                        location,
                        desc,
                        status,
                        image: req.file.path.replace(/\\/g, '/')
                    });

                    // Create child records if userRole is parent
                    if (parsedChildren?.length > 0) {
                        for (const child of parsedChildren) {
                            await ClassTerm.create({
                                ...child,
                                classId: newClass.id,
                            });
                        }
                    }

                    return res.status(200).json({ newClass, message: "New Class Created Successfully" })
                } catch (error) {
                    console.error('Creation Failed:', error);
                    return res.status(500).json({ message: "Error Creating Class", error })
                }
            }
        }
    })
};