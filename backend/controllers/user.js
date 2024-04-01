const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Define a controller function for handling user signup
// This function will receive the request object, extract user data from the request body, perform necessary validation, and then save the user to the database
exports.signup = (req, res, next) => {
    //Extract user data from request body
    bcrypt.hash(req.body.password, 10).then( 
        (hash) => {
            // Create new user instance
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Save user to database
            user.save().then(
                () => {
                    res.status(201).json({
                        message: 'User added successfully!'
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    );
};

// Define a controller function for handling user login
// This function will receive the request object, attempt to find the user by email in the database, compare the password, and generate a JWT token if authentication succeeds
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }).then(
        (user) => {
            if (!user) {
                return res.status(401).json({
                    error: new Error('User not found!')
                });
            }
            bcrypt.compare(req.body.password, user.password).then(
                (valid) => {
                    if (!valid) {
                        return res.status(401).json({
                            error: new Error('Incorrect password!')
                        });
                    }
                    const token = jwt.sign(
                        { userId: user._id },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' });
                    res.status(200).json({
                        userId: user._id,
                        token: token
                    });
                }
            ).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        }
    ).catch(
        (error) => {
            res.status(500).json({
                error: error
            });
        }
    );
}