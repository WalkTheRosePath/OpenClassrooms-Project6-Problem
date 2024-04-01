/**
 * Main application file for setting up the Express server and defining routes
 * Handles connections to MongoDB Atlas and mounts API routes for stuff and user endpoints
 */

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const stuffRoutes = require('./routes/stuff'); // Import stuff routes
const userRoutes = require('./routes/user'); // Import user routes

const app = express();

// Middleware to parse JSON-encoded bodies
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vnvkk29.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas');
        console.error(error);
    });

// Middleware for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Serve static images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Mount stuff and user routes
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;