const express = require("express");

const router = express.Router();

// Load Buyer model
const Buyer = require("../models/Buyer");

// Get all the users
router.get("/", (req, res) => {
    Buyer.find((err, buyers) => {
        if (err) {
            console.log(err);
        } else {
            res.json(buyers);
        }
    })
});

// Add a user to the database
router.post("/register", (req, res) => {
    const email = req.body.email;

    // Verify if the user doesn't already exist
    Buyer.findOne({ email: req.body.email }).then(user => {
        if (user) {
            return res.status(400).json({
                error: "Email already exists",
            });
        }
    });

    // Create a new user
    const new_buyer = new Buyer({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        number: req.body.number,
        age: req.body.age,
        batch: req.body.batch,
    });

    // Save the user
    new_buyer.save()
        .then(buyer => {
            res.status(200).json(buyer);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Verify user credentials
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    Buyer.findOne({ email }).then(buyer => {
        if (!buyer) {
            return res.status(404).json({
                error: "Email not found",
            });
        }
        else {
            // Check if password is correct
            if (buyer.password !== password) {
                return res.status(401).json({
                    error: "Password incorrect",
                });
            }
            else {
                res.status(200).json({
                    message: "Login successful",
                    buyer: buyer
                });
            }
        }
    });
});

module.exports = router;