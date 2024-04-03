/**
 * Define a Mongoose schema for representing 'User' objects in the MongoDB database
 * Enforce uniqueness of email field using the 'mongoose-unique-validator' plugin
 */

// Import the required modules
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the schema for the User model
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Use plugin to enforce uniqueness of email field
userSchema.plugin(uniqueValidator);

// Create a Mongoose model based on the 'userSchema' schema, named 'User'
module.exports = mongoose.model('User', userSchema);