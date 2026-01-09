import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, OTP } from "../models/index.js";
import generateOTP from "../utils/generateOTP.js";
import transporter from "../config/mail.js";

// REGISTER
export const register = async (req, res) => {
  console.log("REGISTER API HIT");
  console.log(req.body);
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ fullName, email, password: hashedPassword });

    const otp = generateOTP();
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await transporter.sendMail({
      to: email,
      subject: "Your OTP Verification Code",
      html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// VERIFY OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await OTP.findOne({ where: { email, otp } });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await User.update({ isVerified: true }, { where: { email } });
    await OTP.destroy({ where: { email } });

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || !user.isVerified) {
      return res.status(400).json({ message: "Invalid credentials or unverified account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
