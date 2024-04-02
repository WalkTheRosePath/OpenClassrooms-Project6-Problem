/**
 * Define a Mongoose schema for representing 'Sauce' objects in the MongoDB database
 */

const mongoose = require('mongoose');

// Define the schema for 'Sauce' objects
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true, min: 1, max: 10 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String], default: [] },
    usersDisliked: { type: [String], default: [] }
});

// Create a Mongoose model based on the 'sauceSchema' schema, named 'Sauce'
module.exports = mongoose.model('Sauce', sauceSchema);