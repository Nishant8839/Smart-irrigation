// server.js

const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Simple route to test server
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Set port from .env or default to 3000
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server started on http://mongodb://localhost:27017/:${PORT}`);
});
