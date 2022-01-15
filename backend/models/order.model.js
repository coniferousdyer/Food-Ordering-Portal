const mongoose = require("mongoose");

// Create schema
const OrderSchema = new mongoose.Schema({
    buyer_id: {
        type: String,
        required: true
    },
    vendor_id: {
        type: String,
        required: true
    },
    placed_time: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "PLACED"
    },
    item_name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;