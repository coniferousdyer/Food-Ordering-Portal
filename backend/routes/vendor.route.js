const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Load Vendor model
const Vendor = require("../models/vendor.model");

// Get all the vendors
router.get("/", async (req, res) => {
    try {
        const vendors = await Vendor.find({});
        return res.status(200).json(vendors);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

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

        // Return the vendor
        return res.status(200).json(vendor);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;