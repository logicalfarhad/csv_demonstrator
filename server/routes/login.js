require("dotenv").config()
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
router.post("/", async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        const user = await User.findOne({ email: loginEmail });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatch = await bcrypt.compare(loginPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userEmail: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/check-token", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Not Authorized" });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token not provided." });
    }

    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ valid: true });
    } catch (error) {
        return res.status(401).json({ valid: false });
    }
})



module.exports = router;
