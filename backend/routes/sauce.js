/**
 * Define Express routes for handling 'sauces' endpoints
 * Utilize middleware functions for authentication and file upload
 * Attach corresponding controller functions to handle the logic of each endpoint
 */

const express = require('express');
const router = express.Router();

// Import middleware functions for authentication and file upload
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import controller functions for 'sauces' endpoints
const saucesController = require('../controllers/sauces');

// Define routes for 'sauces' endpoints
router.get('/', auth, saucesController.getAllSauces); // GET request to fetch all 'sauces' items
router.get('/:id', auth, saucesController.getOneSauce); // GET request to fetch a single 'sauce' item by ID
router.post('/', auth, multer, saucesController.createSauce); // POST request to create a new 'sauce' item
router.put('/:id', auth, multer, saucesController.modifySauce); // PUT request to update a 'sauce' item by ID
router.delete('/:id', auth, saucesController.deleteSauce); // DELETE request to delete a 'sauce' item by ID
// router.post('/:id/like', auth, saucesController.likeOrDislikeSauce); // POST request to like or dislike a 'sauce'

module.exports = router;