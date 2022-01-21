const mongoose = require("mongoose");

// Create schema
const VendorSchema = new mongoose.Schema({
    shop_name: {
        type: String,
        required: true,
        unique: true
    },
    manager_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    opening_time: {
        type: String,
        required: true
    },
    closing_time: {
        type: String,
        required: true
    }
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
