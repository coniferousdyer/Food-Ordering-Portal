const express = require("express");
const fs = require("fs");
const path = require("path");

// Load models and auth middleware
const Item = require("../models/item.model");
const auth = require("../middleware/auth");
const upload = require("../middleware/multer");

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
            vendor_id: req.query.vendor_id
        });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add an item to the database
router.post("/add", auth, upload.single('image'), async (req, res, next) => {
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
            image: {
                data: fs.readFile(path.join(__dirname + '/uploads/' + req.file.filename), () => {}),
                contentType: "image/png"
            },
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
        const item = await Item.findOneAndUpdate({
            vendor_id: req.user,
            name: req.body.name
        }, {
            $set: {
                name: req.body.name,
                image: req.body.image,
                vendor_id: req.user,
                price: req.body.price,
                category: req.body.category,
                addons: req.body.addons,
                tags: req.body.tags,
                rating: { ratings: [], count: 0 },
                number_sold: 0
            }
        }, {
            new: true
        });

        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Remove an item from the database
router.delete("/delete", auth, async (req, res) => {
    try {
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
        const item = await Item.findByIdAndDelete(req.body.item_id);

        item.rating.ratings.push(req.body.rating);
        item.rating.count++;

        const updated_item = await findByIdAndUpdate(req.body.item_id, {
            $set: {
                rating: item.rating
            }
        }, {
            new: true
        });

        return res.status(200).json(saved_item);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;