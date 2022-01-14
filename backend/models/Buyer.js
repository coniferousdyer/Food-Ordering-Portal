const mongoose = require("mongoose");

// Create schema
const BuyerSchema = new mongoose.Schema({
	name: {
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
	age: {
		type: Number,
		required: true
	},
	batch: {
		type: String,
		required: true
	},
	wallet: {
		type: Number,
		default: 0
	}
});

const Buyer = mongoose.model("Buyer", BuyerSchema);

module.exports = Buyer;
