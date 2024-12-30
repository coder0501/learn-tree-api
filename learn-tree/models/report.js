import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";

const Report = sequelize.define(
    'Report',
    {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userRole: {
            type: DataTypes.STRING,
            allowNull: false
        },
        assessmentCriteria: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalScore: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        commentTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        commentDescription: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        file: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        visibility: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'Report',
        timestamps: false,
    }
);

export default Report;