const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const Agent = require('../models/Agent');
const SuperAdmin = require('../models/Superadmin');
const Tour = require('../models/Tour');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error Occured while authenticating:",error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Customer Login
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: "Please provide email/phone and password" });
    }

    // Find user by email or phone
    const customer = await Customer.findOne({
      $or: [{ email: identifier.trim() }, { phone: identifier.trim() }]
    });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: customer._id, role: "customer", email: customer.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: "customer",
      customerID: customer._id,
      name: customer.name
    });
  } catch (error) {
    console.error("Customer Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register Customer
router.post("/register", async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    console.log(req.body)
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    // Check existing email or phone
    const existingSuperAgentByPhone = await SuperAdmin.findOne({ phone_calling: trimmedPhone });
    const existingSuperAgentByEmail = await SuperAdmin.findOne({ email: trimmedEmail });
    const existingAgentByPhone = await Agent.findOne({ phone_calling: trimmedPhone });
    const existingAgentByEmail = await Agent.findOne({ email: trimmedEmail });
    const existingCustomerByPhone = await Customer.findOne({ phone: trimmedPhone });
    const existingCustomerByEmail = await Customer.findOne({ email: trimmedEmail });

    if (existingSuperAgentByEmail || existingAgentByEmail || existingCustomerByEmail) {
    return res.status(400).json({ message: "Email already registered" });
    }

    if (existingSuperAgentByPhone || existingAgentByPhone || existingCustomerByPhone) {
        return res.status(400).json({ message: "Phone number already registered" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = new Customer({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    await newCustomer.save();

    res.status(201).json({ message: "Customer registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get('/tours', authenticate, async (req, res) => {
  try {
    const customer = await Customer.findById(req.user.id).lean();
    if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
    }
  
    const tourDocs = await Tour.find();

    const formattedTours = tourDocs.flatMap((tourDoc) =>
      tourDoc.packages.map((pkg) => ({
        tourID: tourDoc._id,
        name: pkg.name,
        country: pkg.country,
        pricePerHead: pkg.pricePerHead,
        duration: pkg.duration,
        startDate: pkg.startDate,
        description: pkg.description,
        remainingOccupancy: pkg.remainingOccupancy,
        occupancy: pkg.occupancy,
        tourType: pkg.tourType,
        image: pkg.image ? `data:image/jpeg;base64,${pkg.image}` : null,
        categoryType: tourDoc.categoryType,
      }))
    );

    res.json({ tours: formattedTours });
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ message: 'Server error while fetching tours', error });
  }
});

module.exports = router;