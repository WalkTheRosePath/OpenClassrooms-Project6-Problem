const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Define the schema for the User model
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Use plugin to enforce uniqueness of email field
userSchema.plugin(uniqueValidator);

// Export the User model with the defined schema
module.exports = mongoose.model('User', userSchema);