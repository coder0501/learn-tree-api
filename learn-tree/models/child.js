import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";

const Child = sequelize.define(
    'Child',
    {
        parentId:   {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        grade: {
            type: DataTypes.ENUM('A', 'B'),
            allowNull: false,
        },
    },
    {
        tableName: 'Child',
        timestamps: false,
    }
);

export default Child;