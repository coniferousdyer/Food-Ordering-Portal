const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Create express app
const app = express();

// Loading enviroment variables
const port = process.env.PORT || 5000;
// const uri = process.env.MONGO_URI;
const uri = "mongodb://127.0.0.1:27017/food_ordering_db";

// Set up middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Setup API endpoints
app.use("/api/buyers", require("./routes/Buyer"));
app.use("/api/vendors", require("./routes/Vendor"));
app.use("/api/items", require("./routes/Item"));
app.use("/api/orders", require("./routes/Order"));

// Connection to MongoDB
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.log(err);
    } else {
        console.log("MongoDB database connection established successfully!");
    }
});

// Start the server
app.listen(port, function () {
    console.log(`Server is running on port ${port}!`);
});
