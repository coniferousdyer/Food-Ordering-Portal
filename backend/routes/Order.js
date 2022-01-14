const express = require("express");

const router = express.Router();

// Load Order model
const Order = require("../models/Order");

// Get all the orders
router.get("/", (req, res) => {
    Order.find((err, orders) => {
        if (err) {
            console.log(err);
        } else {
            res.json(orders);
        }
    })
});

// Add a order to the database
router.post("/add", (req, res) => {
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
    new_order.save()
        .then(order => {
            res.status(200).json(order);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

module.exports = router;