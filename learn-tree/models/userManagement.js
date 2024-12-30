import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";
import Child from './child.js';

const UserManagement = sequelize.define("UserManagement", {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive'),
        allowNull: true,
        defaultValue: 'inactive',
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    WWCC: {
        type: DataTypes.STRING,
        allowNull: true
    },
    desc: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    userRole: {
        type: DataTypes.ENUM('provider', 'teacher', 'parent'),
        allowNull: false
    },
},
    {
        tableName: "UserManagement",
        timestamps: false,
        hooks: {
            beforeValidate(user) {
                if (user.userRole === "provider") {
                    if (user.dob || user.WWCC || user.desc) {
                        throw new Error(
                            "Fields 'dob', 'WWCC', and 'desc' must be null for providers."
                        );
                    }
                }
                if (user.userRole === "parent") {
                    if (user.WWCC || user.dob) {
                        throw new Error(
                            "Fields 'WWCC' and 'dob' must be null for parents."
                        );
                    }
                }
            },
        },
        validate: {
            teacherParentFieldsRequired() {
                if (this.userRole === "teacher") {
                    if (!this.dob) {
                        throw new Error("Date of Birth (dob) is required for teachers.");
                    }
                    if (!this.WWCC) {
                        throw new Error("WWCC is required for teachers.");
                    }
                    if (!this.desc) {
                        throw new Error("Description (desc) is required for teachers.");
                    }
                }
            },
            parentFieldsRequired() {
                if (this.userRole === "parent") {
                    if (!this.desc) {
                        throw new Error("Description (desc) is required for parents.");
                    }
                }
            },
        },
    }
);

export default UserManagement;
