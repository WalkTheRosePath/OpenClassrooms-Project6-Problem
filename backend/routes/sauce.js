/**
 * Define Express routes for handling 'sauces' endpoints
 * Utilize middleware functions for authentication and file upload
 * Attach corresponding controller functions to handle the logic of each endpoint
 */

const express = require('express');
const router = express.Router();

// Import middleware functions for authentication and file upload
const authMiddleware = require('../middleware/auth');
const multerMiddleware = require('../middleware/multer-config');

// Import controller functions for 'sauces' endpoints
const saucesController = require('../controllers/sauces');

// Define routes for 'sauces' endpoints
router.get('/', authMiddleware, saucesController.getAllSauces); // GET request to fetch all 'sauces' items
router.get('/:id', authMiddleware, saucesController.getOneSauce); // GET request to fetch a single 'sauce' item by ID
router.post('/', authMiddleware, multerMiddleware, saucesController.createSauce); // POST request to create a new 'sauce' item
router.put('/:id', authMiddleware, multerMiddleware, saucesController.modifySauce); // PUT request to update a 'sauce' item by ID
router.delete('/:id', authMiddleware, saucesController.deleteSauce); // DELETE request to delete a 'sauce' item by ID
router.post('/:id/like', authMiddleware, saucesController.likeOrDislikeSauce); // POST request to like or dislike a 'sauce'

module.exports = router;