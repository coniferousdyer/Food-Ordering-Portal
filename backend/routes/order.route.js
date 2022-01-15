const express = require("express");

const router = express.Router();

// Load Order model
const Order = require("../models/order.model");

// Get all the orders
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add a order to the database
router.post("/add", async (req, res) => {
    try {
        // Create a new order
        const new_order = new Order({
            buyer_id: req.body.buyer_id,
            vendor_id: req.body.seller_id,
            placed_time: req.body.placed_time,
            status: req.body.status,
            item_name: req.body.item_name,
            cost: req.body.cost,
            quantity: req.body.quantity,

            // TODO_BY_ARJUN: Modify this
            rating: req.body.rating,
        });

        // Save the order
        const saved_order = await new_order.save();
        return res.status(200).json(saved_order);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;