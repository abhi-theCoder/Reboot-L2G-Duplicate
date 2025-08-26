// routes/customerAuth.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");

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
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    exists = await Customer.findOne({ email }) || await Agent.findOne({ email }) || await SuperAdmin.findOne({ email });
    if (exists) return res.status(405).json({ message: "Can't send OTP as email already exits" });

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
  delete otpStore[email]; // clear OTP after verification
  res.status(200).json({ message: "Email verified successfully" });
});

module.exports = router;