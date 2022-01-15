const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Load Buyer model
const Buyer = require("../models/buyer.model");

// Get all the buyers
router.get("/", async (req, res) => {
    try {
        const buyers = await Buyer.find({});
        return res.status(200).json(buyers);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add a buyer to the database
router.post("/register", async (req, res) => {
    try {
        // Verify if the user doesn't already exist
        const buyer = await Buyer.findOne({ email: req.body.email })
        if (buyer) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        // Create a new user
        const new_buyer = new Buyer({
            name: req.body.name,
            email: req.body.email,
            number: req.body.number,
            age: req.body.age,
            batch: req.body.batch,
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        new_buyer.password = await bcrypt.hash(req.body.password, salt);

        // Save the user
        const saved_buyer = await new_buyer.save();
        return res.status(200).json(saved_buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Verify buyer credentials
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        const buyer = await Buyer.findOne({ email })
        if (!buyer) {
            return res.status(401).json({
                error: "Email not found",
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, buyer.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Incorrect password",
            });
        }

        // Return the buyer
        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;