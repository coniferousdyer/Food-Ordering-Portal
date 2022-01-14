const express = require("express");

const router = express.Router();

// Load Item model
const Item = require("../models/Item");

// Get all the items
router.get("/", (req, res) => {
    Item.find((err, items) => {
        if (err) {
            console.log(err);
        } else {
            res.json(items);
        }
    })
});

// Add an item to the database
router.post("/add", (req, res) => {
    // Verify if the item doesn't already exist
    Item.findOne({ name: req.body.name }).then(item => {
        if (item) {
            return res.status(400).json({
                error: "Item already exists",
            });
        }
    });

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
    new_item.save()
        .then(item => {
            res.status(200).json(item);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

// Remove an item from the database
router.post("/remove", (req, res) => {
    Item.findOneAndDelete({ name: req.body.name }).then(item => {
        if (!item) {
            return res.status(404).json({
                error: "Item not found",
            });
        }

        res.status(200).json(item);
    });
});

module.exports = router;