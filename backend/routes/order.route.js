const express = require("express");

const router = express.Router();

// Load models and auth middleware
const Order = require("../models/order.model");
const Buyer = require("../models/buyer.model");
const Item = require("../models/item.model");
const auth = require("../middleware/auth");

// Get all the orders
router.get("/", auth, async (req, res) => {
    try {
        const orders = await Order.find({});
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Get all the orders for a specific vendor
router.get("/vendor", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            vendor_id: req.user
        });
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Get all the orders for a specific buyer
router.get("/buyer", auth, async (req, res) => {
    try {
        const orders = await Order.find({
            buyer_id: req.user
        });
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

// Add a order to the database
router.post("/add", auth, async (req, res) => {
    try {
        // Create a new order
        const new_order = new Order({
            buyer_id: req.user,
            vendor_id: req.body.vendor_id,
            item_id: req.body.item_id,
            quantity: req.body.quantity,
            addons: req.body.addons,
            cost: req.body.cost,
        });

        const item = await Item.findById(req.body.item_id);

        if (!item) {
            return res.status(404).json({
                error: "Item not found",
            });
        }
        
        // Deduct the amount from the buyer's wallet
        const buyer = await Buyer.findById(req.user);
        if (buyer.wallet < req.body.cost) {
            return res.status(403).json({
                error: "Insufficient funds in the buyer's wallet"
            });
        }
        const new_wallet_amount = buyer.wallet - req.body.cost;
        const new_number_sold = item.number_sold + req.body.quantity;

        // Save the order
        const saved_order = await new_order.save();

        // Save the buyer
        const updated_buyer = await Buyer.findByIdAndUpdate(req.user, {
            $set: {
                wallet: new_wallet_amount
            }
        }, {
            new: true
        });

        // Increase number of sales for the item
        const updated_item = await Item.findByIdAndUpdate(item._id, {
            $set: {
                number_sold: new_number_sold
            }
        }, {
            new: true
        });

        return res.status(201).json({
            order: saved_order,
            buyer: updated_buyer,
            item: updated_item
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});

// Reject an order
router.patch("/reject", auth, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.body.order_id, {
            $set: {
                state: "REJECTED"
            }
        }, {
            new: true
        });

        // Refund the buyer's wallet
        const buyer = await Buyer.findById(req.body.buyer_id);
        const new_wallet_amount = buyer.wallet + order.cost;
        const updated_buyer = await Buyer.findByIdAndUpdate(req.user, {
            $set: {
                wallet: new_wallet_amount
            }
        }, {
            new: true
        });

        // Decrement number of sales of the item
        const item = await Item.findById(order.item_id);
        const new_number_sold = item.number_sold - order.quantity;
        const updated_item = await Item.findByIdAndUpdate(item._id, {
            $set: {
                number_sold: new_number_sold
            }
        }, {
            new: true
        });

        return res.status(200).json({
            order: order,
            buyer: updated_buyer,
            item: updated_item
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
});

// Update order status
router.patch("/update_state", auth, async (req, res) => {
    try {
        const state_array = ["PLACED", "ACCEPTED", "COOKING", "READY FOR PICKUP", "COMPLETED", "REJECTED"];

        // Find the order
        const order = await Order.findById(req.body.order_id);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({
                error: "Order not found"
            });
        }

        // Check if the order has terminated
        if (order.state == "REJECTED" || order.state == "COMPLETED") {
            return res.status(403).json({
                error: "Order was rejected or completed"
            });
        }

        const all_orders = await Order.find({});
        const filtered_orders = all_orders.filter(order => {
            order.state == "ACCEPTED" || order.state == "COOKING"
        });

        // Reject if there are 10 orders in progress
        if (filtered_orders.length >= 10) {
            return res.status(403).json({
                error: "Other orders still in progress"
            });
        }

        // Update the order
        const new_state = state_array[state_array.indexOf(order.state) + 1];
        const updated_order = await Order.findByIdAndUpdate(req.body.order_id, {
            $set: {
                state: new_state
            }
        }, {
            new: true
        });

        return res.status(200).json({
            order: updated_order,
        });
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});

module.exports = router;