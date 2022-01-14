const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

// Create express app
const app = express();

// Loading enviroment variables
const port = process.env.PORT || 5000;
const db_name = process.env.DB_NAME;

// Set up middleware
app.use(cors());
app.use(express.json());

// // Connection to MongoDB
// mongoose.connect('mongodb://127.0.0.1:27017/' + db_name, { useNewUrlParser: true });
// const connection = mongoose.connection;
// connection.once('open', function () {
//     console.log("MongoDB database connection established successfully!");
// })

// Setup API endpoints
app.use("/user", require("./routes/users"));

app.listen(port, function () {
    console.log("Server is running on port " + port + "!");
});
