
import authRoutes from './authRoutes.js';
import profileRoutes from './profile.js';
import userManagementRoutes from './userManagement.js';
import classManagementRoutes from './classesManagement.js';
import classReportRoutes from './reportRoutes.js';

export default (app) => {

    // auth Routes
    app.use('/auth', authRoutes);
    app.use("/profile", profileRoutes);

    // For User Management
    app.use("/user-management", userManagementRoutes);

    // For Class Management
    app.use("/class-management", classManagementRoutes)
    app.use("/class-report", classReportRoutes);

};