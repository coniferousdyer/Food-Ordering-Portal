const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load Buyer model and auth middleware
const Buyer = require("../models/buyer.model");
const auth = require('../middleware/auth');

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
        const salt = await bcrypt.genSalt();
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

        // Create and assign a token
        jwt.sign({
            id: buyer._id,
            name: buyer.name,
            email: buyer.email,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    error: "Error signing token",
                });
            }

            // Return the token and the buyer data
            return res.status(200).json({
                token,
                buyer: {
                    name: buyer.name,
                    email: buyer.email,
                    number: buyer.number,
                    age: buyer.age,
                    batch: buyer.batch,
                }
            });
        });
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Edit a buyer's information
router.patch("/edit", auth, async (req, res) => {
    try {
        const buyer = await Buyer.findOneAndUpdate(req.user, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                number: req.body.number,
                age: req.body.age,
                batch: req.body.batch,
            }
        })

        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;