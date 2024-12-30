// models/Otp.js
import { DataTypes } from 'sequelize';
import sequelize from "../config/config.js";

// Schema to store otp with associated email.
const Otp = sequelize.define('Otp', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'OTP',
  timestamps: false,
});

export default Otp;