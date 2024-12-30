import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";

const ClassTerm = sequelize.define(
    'ClassTerm',
    {
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        termDuration: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        batch: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startTime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        endTime: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        classFees: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

export default ClassTerm;