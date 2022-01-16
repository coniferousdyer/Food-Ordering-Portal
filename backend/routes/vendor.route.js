const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

const router = express.Router();

// Load Vendor model and auth middleware
const Vendor = require("../models/vendor.model");
const auth = require("../middleware/auth");

// Add a vendor to the database
router.post("/register", async (req, res) => {
    try {
        // Verify if the vendor doesn't already exist
        const vendor = await Vendor.findOne({ email: req.body.email });
        if (vendor) {
            return res.status(409).json({
                error: "Email already exists",
            });
        }

        // Create a new vendor
        const new_vendor = new Vendor({
            shop_name: req.body.shop_name,
            manager_name: req.body.manager_name,
            email: req.body.email,
            number: req.body.number,
            opening_time: req.body.opening_time,
            closing_time: req.body.closing_time,
        });

        // Hash the password
        const salt = await bcrypt.genSalt();
        new_buyer.password = await bcrypt.hash(req.body.password, salt);

        // Save the vendor
        const saved_vendor = await new_vendor.save();
        return res.status(200).json(saved_vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Verify vendor credentials
router.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // Find user by email
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            return res.status(401).json({
                error: "Email not found",
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, vendor.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Incorrect password",
            });
        }

        // Create and assign a token
        jwt.sign({
            id: vendor._id,
            shop_name: vendor.shop_name,
            manager_name: vendor.manager_name,
            email: vendor.email,
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if (err) {
                return res.status(500).json({
                    error: "Error signing token",
                });
            }

            // Return the token and the vendor data
            return res.status(200).json({
                token,
                vendor: {
                    shop_name: vendor.shop_name,
                    manager_name: vendor.manager_name,
                    email: vendor.email,
                    number: vendor.number,
                    opening_time: vendor.opening_time,
                    closing_time: vendor.closing_time,
                }
            });
        });
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Edit a vendor's information
router.patch("/edit", auth, async (req, res) => {
    try {
        const vendor = await Vendor.findOneAndUpdate(req.user, {
            $set: {
                shop_name: req.body.shop_name,
                manager_name: req.body.manager_name,
                email: req.body.email,
                number: req.body.number,
                opening_time: req.body.opening_time,
                closing_time: req.body.closing_time,
            }
        })

        return res.status(200).json(vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;