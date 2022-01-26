const express = require("express");
const fs = require("fs");
const path = require("path");

// Load models and auth middleware
const Item = require("../models/item.model");
const Order = require("../models/order.model");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all items
router.get("/", auth, async (req, res) => {
    try {
        const items = await Item.find({});
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Get all the items for a specific vendor
router.get("/vendor", auth, async (req, res) => {
    try {
        const items = await Item.find({
            vendor_id: req.user
        });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add an item to the database
router.post("/add", auth, async (req, res, next) => {
    try {
        // Verify that the vendor hasn't already added an item with the same name
        const item = await Item.findOne({
            vendor_id: req.user,
            name: req.body.name
        });

        if (item) {
            return res.status(409).json({
                error: "Item has already been added by this vendor",
            });
        }

        // Create a new item
        const new_item = new Item({
            name: req.body.name,
            vendor_id: req.user,
            price: req.body.price,
            category: req.body.category,
            addons: req.body.addons,
            tags: req.body.tags,
        });

        // Save the item
        const saved_item = await new_item.save();
        return res.status(201).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

router.patch("/edit", auth, async (req, res) => {
    try {
        // CHECK IF ADDING DUPLICATES
        const item = await Item.findOne({
            vendor_id: req.user,
            name: req.body.original_name
        });

        if (!item) {
            return res.status(404).json({
                error: "Item not found",
            });
        }

        item.name = req.body.name;
        item.price = req.body.price;
        item.category = req.body.category;
        item.addons = req.body.addons;
        item.tags = req.body.tags;

        const saved_item = await Item.findByIdAndUpdate(item._id, item, {
            new: true
        });

        return res.status(200).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Remove an item from the database
router.delete("/delete", auth, async (req, res) => {
    try {
        // TODO_BY_ARJUN: DELETE FROM FAVOURITES AS WELL AND ORDERS
        const item = await Item.findByIdAndDelete(req.body.item_id);
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Updating the rating of the item
router.patch("/update_rating", auth, async (req, res) => {
    try {
        const item = await Item.findById(req.body.item_id);

        item.rating.ratings.push(req.body.rating);
        item.rating.count++;

        const updated_item = await Item.findByIdAndUpdate(req.body.item_id, {
            $set: {
                rating: item.rating
            }
        }, {
            new: true
        });

        const updated_order = await Order.findByIdAndUpdate(req.body.order_id, {
            $set: {
                rating: req.body.rating
            }
        }, {
            new: true
        });
        
        return res.status(200).json({ 
            item: updated_item,
            order: updated_order
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;