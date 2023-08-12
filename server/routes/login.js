const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const secretKey = process.env.JWT_SECRET
router.post("/", async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        const user = await User.findOne({ email: loginEmail });
        console.log(user)

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

       const passwordMatch = await bcrypt.compare(loginPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token
        const token = jwt.sign({ userEmail: user.email }, secretKey, { expiresIn: 60 });

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
