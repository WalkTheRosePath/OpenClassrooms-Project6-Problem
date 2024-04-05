/**
 * Middleware for user authentication using JWT tokens
 * This middleware verifies the JWT token in the authorization header of incoming requests
 */

// Import the required modules
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Extract the JWT token from the authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the JWT token using the secret key
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');

    // Extract the user ID from the decoded token
    const userId = decodedToken.userId;

    // Check if the user ID in the request body matches the decoded user ID
    if (req.body.userId && req.body.userId !== userId) {
        // Throw an error if the user ID is invalid
        res.status(401).json({
            error: 'Invalid user ID'
        });
    } else {
        // Proceed to the next middleware if authentication is successful
        next();
    }
};