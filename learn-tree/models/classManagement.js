import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";

const Class = sequelize.define(
    'Class',
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },    
        userRole: {
            type: DataTypes.STRING,
            allowNull: false
        },
        className: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('English', 'Science', 'Mathematics'),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive'),
            allowNull: true,
            defaultValue: 'inactive',
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        tableName: 'Class',
        timestamps: false,
    }
);

export default Class;
