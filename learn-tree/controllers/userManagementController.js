import UserManagement from "../models/userManagement.js";
import Child from "../models/child.js";
import multer from "multer";
import path from "path";
import { SequelizeScopeError } from "sequelize";
import { singleImageUpload } from "../services/fileUpload.js";

const createUser = async (req, res) => {
    singleImageUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected' });
            } else {
                try {
                    const loggedInUserId = req.user?.userId;
                    const role = req.user?.role;

                    if (role !== "admin") {
                        return res.status(403).json({
                            message: "Access denied. Only admins are allowed to create providers",
                        })
                    }

                    const {
                        firstName,
                        lastName,
                        phoneNumber,
                        email,
                        status,
                        dob,
                        WWCC,
                        desc,
                        userRole,
                        children // Expecting children array from the request body
                    } = req.body;

                    // Parse children if it's a string
                    const parsedChildren = typeof children === "string" ? JSON.parse(children) : children;
                    if (userRole === "parent" && (children && !Array.isArray(parsedChildren))) {
                        return res.status(400).json({
                            message: "Invalid data for children. It must be an array.",
                        });
                    }

                    const existingUser = await UserManagement.findOne({ where: { email } });

                    if (existingUser) {
                        return res.status(400).json({
                            message: "User with this email already exists"
                        });
                    }

                    const newUser = await UserManagement.create({
                        userId: loggedInUserId,
                        firstName,
                        lastName,
                        phoneNumber,
                        email,
                        status,
                        image: req.file.path.replace(/\\/g, '/'),
                        userRole,
                        dob,
                        WWCC,
                        desc
                    });

                    // Array.isArray(children)
                    console.log("Childrens Array->", Array.isArray(parsedChildren))

                    // Create child records if userRole is parent
                    if (userRole === "parent" && parsedChildren?.length > 0) {
                        for (const child of parsedChildren) {
                            await Child.create({
                                ...child,
                                parentId: newUser.id,
                            });
                        }
                    }

                    // Add children if userRole is parent
                    // if (userRole === 'parent' && Array.isArray(children)) {
                    //     console.log("inside parent")
                    //     const childRecords = children.map(child => ({
                    //         parentId: newUser.id, // Link to the parent user
                    //         firstName: child.firstName,
                    //         lastName: child.lastName,
                    //         dob: child.dob,
                    //         grade: child.grade
                    //     }));

                    //     console.log("childRecords->", childRecords)
                    //     const createdChildren = await Child.bulkCreate(childRecords);

                    //     console.log("Created Children->", createdChildren);
                    //     return res.status(200).json({
                    //         newUser,
                    //         children: createdChildren,
                    //         message: `New parent and associated children created successfully`
                    //     });
                    // }

                    return res.status(200).json({ newUser, message: `New ${userRole} Created Successfully` })
                } catch (error) {
                    console.error('Creation Failed:', error);
                    return res.status(500).json({ message: "Server Error", error })
                }
            }
        }
    });
}

export const getAllUser = async (req, res) => {
    try {
        const { userRole } = req.query;

        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to view users"
            })
        }

        console.log("userRole", userRole)
        if (!userRole) {
            return res.status(400).json({ message: "User Role is Required" })
        }
        // Fetch users with optional children for parents
        const queryOptions = {
            where: { userRole },
        }

        if (userRole === "parent") {
            queryOptions.include = [
                {
                    model: Child,
                    as: "children", // Alias defined in the association
                    attributes: ["id", "firstName", "lastName", "dob", "grade"], // Fields to include from Child
                }
            ];
        }

        const allUsers = await UserManagement.findAll(queryOptions);

        res.status(200).json({
            message: `${userRole} retrieved successfully`,
            allUsers,
        });
    } catch (error) {
        console.log("Error retrieving users:", error)
        return res.status(500).json({ message: "Error retrieving users:", error })
    }
};

export const getUser = async (req, res) => {
    try {
        console.log("req.params.id:", req.params.id);
        const { userRole } = req.query;
        console.log("userrole->", userRole)

        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to view users",
            })
        }

        if (!userRole) {
            return res.status(400).json({ message: "User Role is Required", userRole })
        }

        // Fetch user along with their children if the userRole is "parent"
        const userData = await UserManagement.findOne({
            where: { id: req.params.id, userRole },
            include: userRole === "parent" ? [
                {
                    model: Child, // Replace `Child` with your child model name
                    as: "children", // Alias defined in the relationship
                },
            ] : [],
        });

        console.log("userData", userData);

        if (!userData) {
            return res.status(404).json({ message: "User Not Found." });
        }

        return res.status(200).json({ message: "User Retrieved Successfully", userData });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving user:", error })
    }
};

const updateUser = async (req, res) => {
    singleImageUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected' });
            } else {

                try {
                    const { userRole } = req.query;
                    console.log("role->", userRole)
                    const loggedInUserId = req.user?.userId;
                    const role = req.user?.role;

                    console.log("loggedInUserId->", loggedInUserId, role)
                    if (role !== "admin") {
                        return res.status(403).json({
                            message: "Access denied. Only admins are allowed to update users",
                        })
                    }

                    if (!userRole) {
                        return res.status(400).json({ message: "User Role is Required" })
                    }

                    const { data } = req.body
                    console.log("req.body", data, req.body)

                    // Parse `children` from the request body
                    const children = JSON.parse(req.body.children || '[]'); // Ensure `children` is an array
                    console.log(children)

                    console.log(await UserManagement.findOne({ where: { id: req.params.id, userRole } }))
                    const updatedUserData = await UserManagement.update(req.body, { where: { id: req.params.id, userRole } });
                    console.log("updatedUserData->", updatedUserData[0])
                    if (!updatedUserData[0])
                        return res.status(404).json({ message: 'User not found' });

                    // If the user role is parent, update associated children
                    if (userRole === "parent" && children && Array.isArray(children)) {
                        for (const child of children) {
                            if (child.id) {
                                // Update existing child record
                                await Child.update(child, { where: { id: child.id, parentId: req.params.id } });
                            } else {
                                // Add new child record
                                await Child.create({ ...child, parentId: req.params.id });
                            }
                        }
                    }

                    res.status(200).json({
                        message: `${userRole} updated successfully, including children if applicable`,
                        updatedUserData,
                    });
                } catch (error) {
                    return res.status(500).json({ message: "Error updating user:", error })
                }
            }
        }
    });
};

const deleteUser = async (req, res) => {
    try {
        const { userRole } = req.query;
        console.log("role->", userRole)
        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to delete users",
            })
        }

        if (!userRole) {
            return res.status(400).json({ message: "User Role is Required" })
        }

        const deletedUser = await UserManagement.destroy({ where: { id: req.params.id, userRole } });
        if (!deletedUser)
            return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: `${userRole} deleted successfully`, deletedUser });
    } catch (error) {
        return res.status(500).json({ message: "Error Deleting user:", error })
    }
};

export { createUser, updateUser, deleteUser };

