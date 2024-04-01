/**
 * Define user authentication routes for signup and login
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Route for user signup: POST /signup
router.post('/signup', userController.signup);

// Route for user login: POST /login
router.post('/login', userController.login);

// Export the router
module.exports = router;