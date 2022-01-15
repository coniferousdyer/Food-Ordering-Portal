const express = require("express");

const router = express.Router();

// Load Item model
const Item = require("../models/item.model");

// Get all the items
router.get("/", async (req, res) => {
    try {
        const items = await Item.find({});
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add an item to the database
router.post("/add", async (req, res) => {
    try {
        // Verify if the item doesn't already exist
        const item = await Item.findOne({ name: req.body.name });
        if (item) {
            return res.status(409).json({
                error: "Item already exists",
            });
        }

        // Create a new item
        const new_item = new Item({
            name: req.body.name,
            image: req.body.image,
            price: req.body.price,
            description: req.body.description,
            category: req.body.category,

            // TODO_BY_ARJUN: Modify this
            rating: req.body.rating,
            vegetarian: req.body.vegetarian,
            addons: req.body.addons,
            tags: req.body.tags,
        });

        // Save the item
        const saved_item = await new_item.save();
        return res.status(200).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Remove an item from the database
router.post("/remove", async (req, res) => {
    try {
        const deleted_item = await Item.findOneAndDelete({ name: req.body.name });
        return res.status(200).json(deleted_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;