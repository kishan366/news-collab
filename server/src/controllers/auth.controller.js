const pool = require("../db/db");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    await pool.query(
      `INSERT INTO email_otp_verifications (email, otp, expires_at)
       VALUES ($1,$2,$3)`,
      [email, otp, expiresAt]
    );

    await sendEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const otpResult = await pool.query(
    `SELECT * FROM email_otp_verifications
     WHERE email=$1 AND otp=$2 AND expires_at > NOW()
     ORDER BY id DESC LIMIT 1`,
    [email, otp]
  );

  if (otpResult.rowCount === 0) {
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

  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

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
};

exports.registerUser = async (req, res) => {
  const { email, firstName, lastName, phone, gender } = req.body;

  if (!email || !firstName || !lastName || !phone || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (email, first_name, last_name, phone, gender)
       VALUES ($1,$2,$3,$4,$5) RETURNING id`,
      [email, firstName, lastName, phone, gender]
    );

    const token = jwt.sign(
      { id: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "User registration failed" });
  }
};
