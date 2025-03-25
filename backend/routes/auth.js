 // Import User Model

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();
const User = require("../models/User");

const SECRET_KEY = process.env.JWT_SECRET;

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: "your-email@gmail.com", pass: "your-password" },
});

router.post("/register", async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    res.json({ message: "User Registered" });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid Credentials" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    await transporter.sendMail({ to: email, subject: "OTP Code", text: `Your OTP is ${otp}` });

    res.json({ otp, userId: user._id });
});

router.post("/verify-otp", async (req, res) => {
    const { otp, userId } = req.body;
    if (otp !== "123456") return res.status(400).json({ message: "Invalid OTP" });

    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

module.exports = router;
