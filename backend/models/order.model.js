const mongoose = require("mongoose");

// Create schema
const OrderSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Buyer",
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor",
        required: true
    },
    placed_time: {
        type: Date,
        default: Date.now
    },
    state: {
        type: String,
        default: "PLACED"
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    addons: [{
        addon_name: {
            type: String,
            required: true
        },
        addon_price: {
            type: Number,
            required: true
        }
    }],
    quantity: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;