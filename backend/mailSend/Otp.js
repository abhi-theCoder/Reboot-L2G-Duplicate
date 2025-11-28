// routes/customerAuth.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Customer = require("../models/Customer");
const Agent = require("../models/Agent");
const SuperAdmin = require("../models/Superadmin");

// In-memory OTP store (for demo; better: use DB or Redis)
let otpStore = {};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========== 1. Send OTP ==========
router.post("/send-otp", async (req, res) => {
  try {
    const { email, forgot_password } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    exists = await Customer.findOne({ email }) || await Agent.findOne({ email }) || await SuperAdmin.findOne({ email });
    if (exists && !forgot_password) return res.status(405).json({ message: "Can't send OTP as email already exits" });
    else if (!exists && forgot_password) return res.status(404).json({ message: "Email not found. Please check and try again." });

    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code for Email Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <b>${otp}</b></p>
        <p>Valid for 10 minutes.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ========== 2. Verify OTP ==========
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

  const record = otpStore[email];
  if (!record) return res.status(400).json({ message: "OTP already used or expired. Kindly, resend OTP and verify." });

  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired" });
  }

  if (otp !== record.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Mark as verified
  otpStore[email].verified = true;

  res.status(200).json({ message: "Email verified successfully" });
});

// ========== 3. Reset Password ==========
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ message: "Email & new password required" });

    const record = otpStore[email];
    if (!record || !record.verified) {
      return res.status(400).json({ message: "Email not verified. Cannot reset password. Please send OTP again and Verify you email !!" });
    }

    let user = await Customer.findOne({ email }) || await Agent.findOne({ email }) || await SuperAdmin.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    delete otpStore[email]; // clear OTP record after password reset
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

module.exports = router;