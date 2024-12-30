import { where } from "sequelize";
import Report from "../models/report.js";
import { singleImageUpload } from "../services/fileUpload.js";

// Report Fields:
// assesmentCriteria,
// totalScore,
// commentTitle,
// commentDescription,
// visibility
export const addReport = (req, res) => {
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

                    console.log("role->", role)
                    if (role !== "admin") {
                        return res.status(403).json({
                            message: "Access denied. Only admins are allowed to create providers",
                        })
                    }

                    const {
                        assessmentCriteria,
                        totalScore,
                        commentTitle,
                        commentDescription,
                        visibility
                    } = req.body

                    // console.log(data);

                    const newReport = await Report.create({
                        userId: loggedInUserId,
                        userRole: role,
                        assesmentCriteria: assessmentCriteria,
                        totalScore: totalScore,
                        commentTitle: commentTitle,
                        commentDescription: commentDescription,
                        visibility: visibility
                    });

                    return res.status(200).json({ newReport, message: `New Report Created Successfully` })
                } catch (error) {
                    console.error('Report Creation Failed:', error);
                    return res.status(500).json({ message: "Server Error", error })
                }
            }
        }
    });
};

export const getAllReport = async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to view users"
            })
        }

        const allReports = await Report.findAll();
        res.status(200).json({
            message: `Reports retrieved successfully`,
            allReports,
        });
    } catch (error) {
        console.log("Error retrieving Reports:", error)
        return res.status(500).json({ message: "Error retrieving users:", error })
    }
}

export const getReport = async (req, res) => {
    try {
        console.log("req.params.id:", req.params.id);
        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to view users",
            })
        }

        // Fetch user along with their children if the userRole is "parent"
        const reportData = await Report.findOne({
            where: {
                id: req.params.id,
                userRole: role
            },
        });

        console.log("reportData->", reportData);

        if (!reportData) {
            return res.status(404).json({ message: "Report Not Found." });
        }

        return res.status(200).json({ message: "Report Retrieved Successfully", reportData });
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving user:", error })
    }
}

export const updateReport = async (req, res) => {
    singleImageUpload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(400).json({ message: err });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ message: 'No file selected' });
            } else {

                try {
                    // const { userRole } = req.query;
                    const loggedInUserId = req.user?.userId;
                    const role = req.user?.role;

                    console.log("loggedInUserId->", loggedInUserId, role)
                    if (role !== "admin") {
                        return res.status(403).json({
                            message: "Access denied. Only admins are allowed to update users",
                        })
                    }

                    const updatedReport = await Report.update(req.body, {
                        where: {
                            id: req.params.id,
                        }
                    })

                    if (!updatedReport) {
                        return res.status(404).json({ message: "Report Not Found" })
                    }

                    return res.status(200).json({
                        message: "Report Updated Sucessfully",
                        updatedReport,
                    });
                } catch (error) {
                    return res.status(500).json({ message: "Error updating user:", error })
                }
            };
        }
    });
}

export const deleteReport = async (req, res) => {
    try {
        const loggedInUserId = req.user?.userId;
        const role = req.user?.role;

        console.log("loggedInUserId->", loggedInUserId, role)
        if (role !== "admin") {
            return res.status(403).json({
                message: "Access denied. Only admins are allowed to delete users",
            })
        }

        const deletedReport = await Report.destroy({
            where: {
                id: req.params.id
            }
        });

        if (!deletedReport)
            return res.status(404).json({ message: 'Report not found' });

        res.status(200).json({ message: `Report deleted successfully`, deletedReport });
    } catch (error) {
        return res.status(500).json({ message: "Error Deleting Report:", error })
    }
}