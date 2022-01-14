const express = require("express");

const router = express.Router();

// Load Vendor model
const Vendor = require("../models/Vendor");

// Get all the vendors
router.get("/", (req, res) => {
    Vendor.find((err, vendors) => {
        if (err) {
            console.log(err);
        } else {
            res.json(vendors);
        }
    })
});

// Add a vendor to the database
router.post("/register", (req, res) => {
    // Verify if the vendor doesn't already exist
    Vendor.findOne({ email: req.body.email }).then(vendor => {
        if (vendor) {
            return res.status(400).json({
                error: "Email already exists",
            });
        }
    });

    // Create a new vendor
    const new_vendor = new Vendor({
        shop_name: req.body.shop_name,
        manager_name: req.body.manager_name,
        email: req.body.email,
        password: req.body.password,
        number: req.body.number,
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time,
    });

    // Save the vendor
    new_vendor.save()
        .then(vendor => {
            res.status(200).json(vendor);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Verify vendor credentials
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    Vendor.findOne({ email }).then(vendor => {
        if (!vendor) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            // Verify password
            if (vendor.password !== password) {
                return res.status(401).json({
                    error: "Password incorrect",
                });
            }
            else {
                res.status(200).json({
                    message: "Login successful",
                    vendor: vendor
                });
            }
        }
    });
});

module.exports = router;