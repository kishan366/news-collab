const express = require("express");
const router = express.Router();
const pool = require("../db/db");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: OTP based authentication APIs
 */

/**
 * @swagger
 * /api/auth/send-otp:
 *   post:
 *     summary: Send OTP to email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Email is required
 *       500:
 *         description: Failed to send OTP
 */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query("DELETE FROM auth WHERE email=$1", [email]);
  await pool.query(
    "INSERT INTO auth (email, otp, expires_at) VALUES ($1,$2,$3)",
    [email, otp, expiresAt]
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });

  res.json({ message: "OTP sent successfully" });
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, otp]
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: OTP verification failed
 */
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const result = await pool.query(
    `SELECT * FROM auth
     WHERE email=$1 AND otp=$2 AND expires_at > NOW()`,
    [email, otp]
  );

  if (result.rowCount === 0) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  const userResult = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (userResult.rowCount === 0) {
    return res.json({ exists: false });
  }

  const user = userResult.rows[0];

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    exists: true,
    token,
    user: {
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      gender: user.gender,
    },
  });
});

module.exports = router;
