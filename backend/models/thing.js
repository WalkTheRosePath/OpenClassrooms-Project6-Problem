/**
 * Define a Mongoose schema for representing 'Thing' objects in the MongoDB database
 */

const mongoose = require('mongoose');

// Define the schema for 'Thing' objects
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    userId: { type: String, required: true },
    price: { type: Number, required: true },
});

// Create a Mongoose model based on the 'thingSchema' schema, named 'Thing'
module.exports = mongoose.model('Thing', thingSchema);