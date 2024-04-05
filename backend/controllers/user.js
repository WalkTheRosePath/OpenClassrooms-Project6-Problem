/**
 * Controller functions for user authentication (signup and login)
 * These functions handle user signup and login requests, interact with the database, 
 * and generate JWT tokens for authentication
 */

// Import the required modules
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');
const { errorHandler } = require('../utils');

// Controller function for user signup
exports.signup = (req, res, next) => {
    // Hash the password using bcrypt
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            // Create a new user instance with hashed password
            const user = new UserModel({
                email: req.body.email,
                password: hash
            });
            // Save the user to the database
            user.save()
                .then(() => {
                    res.status(201).json({
                        message: 'User added successfully!'
                    });
                })
                .catch((error) => {
                    errorHandler(res, error);
                });
        })
        .catch((error) => {
            errorHandler(res, error);
        });
};

// Controller function for user login
exports.login = (req, res, next) => {
    // Find user by email in the database
    UserModel.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                // If user is not found, return an error message
                return res.status(401).json({
                    error: new Error('Incorrect username or password!').message
                });
            }
            // Compare passwords using bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then((valid) => {
                    // If password is incorrect, return an error message
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect username or password!').message
                        });
                    }
                    // Generate JWT token for user authentication
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );
                    // Send successful login response with token
                    res.status(200).json({ userId: user._id, token });
                })
                .catch((error) => {
                    errorHandler(res, error);
                });
        })
        .catch((error) => {
            errorHandler(res, error);
        });
};