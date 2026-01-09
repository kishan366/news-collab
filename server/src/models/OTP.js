import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OTP = sequelize.define("OTP", {
  email: DataTypes.STRING,
  otp: DataTypes.STRING,
  expiresAt: DataTypes.DATE,
});

export default OTP;
