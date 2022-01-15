const mongoose = require("mongoose");

// Create schema
const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    vegetarian: {
        type: Boolean,
        required: true
    },
    addons: {
        type: Array,
        default: []
    },
    tags: {
        type: Array,
        default: []
    }
});

const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;