const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load models and auth middleware
const Buyer = require("../models/buyer.model");
const auth = require('../middleware/auth');

// Get a particular buyer
router.get("/details", auth, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user);
        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add a buyer to the database
router.post("/register", async (req, res) => {
    // TODO_BY_ARJUN: CHECK FOR ALL UNIQUENESS
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

        // Create and assign a token
        jwt.sign({
            id: new_buyer._id,
            type: "buyer",
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, async (err, token) => {
            if (err) {
                return res.status(500).json({
                    error: "Error signing token",
                });
            }

            // Return the token and the buyer data
            const saved_buyer = await new_buyer.save();
            return res.status(201).json({
                token: token,
                buyer: saved_buyer
            });
        });
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
            type: "buyer",
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
        // TODO_BY_ARJUN: CHECK IF EMAIL ALREADY EXISTS
        // TODO_BY_ARJUN: ENCRYPT PASSWORD ON UPDATION

        const buyer = await Buyer.findByIdAndUpdate(req.user, {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                number: req.body.number,
                age: req.body.age,
                batch: req.body.batch,
            }
        }, {
            new: true
        })

        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Update a buyer's wallet
router.patch("/update_wallet", auth, async (req, res) => {
    try {
        const buyer = await Buyer.findById(req.user);
        const new_wallet_amount = buyer.wallet + req.body.wallet;

        // Update the buyer's wallet
        const updated_buyer = await Buyer.findByIdAndUpdate(req.user, {
            $set: {
                wallet: new_wallet_amount,
            }
        }, {
            new: true
        })

        return res.status(200).json(updated_buyer);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});

// Add to a buyer's favourite list
router.patch("/add_favourite", auth, async (req, res) => {
    try {
        const buyer = await Buyer.findByIdAndUpdate(req.user, {
            $push: {
                favourite_items: req.body.item_id,
            }
        }, {
            new: true
        })

        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Delete a buyer
router.delete("/delete", auth, async (req, res) => {
    try {
        const buyer = await Buyer.findByIdAndDelete(req.user);
        return res.status(200).json(buyer);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;