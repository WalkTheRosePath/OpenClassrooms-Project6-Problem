/**
 * Define a route for handling user signup by importing Express and creating a router instance
 * Define a POST route for '/signup'
 * Define a POST route for '/login'
 * Attach the corresponding controller function to handle the logic
 */ 

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;