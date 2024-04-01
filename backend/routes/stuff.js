/**
 * Define Express routes for handling 'stuff' endpoints
 * Utilize middleware functions for authentication and file upload
 * Attach corresponding controller functions to handle the logic of each endpoint
 */

const express = require('express');
const router = express.Router();

// Import middleware functions for authentication and file upload
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Import controller functions for 'stuff' endpoints
const stuffController = require('../controllers/stuff');

// Define routes for 'stuff' endpoints
router.get('/', auth, stuffController.getAllStuff); // GET request to fetch all 'stuff' items
router.post('/', auth, multer, stuffController.createThing); // POST request to create a new 'stuff' item
router.get('/:id', auth, stuffController.getOneThing); // GET request to fetch a single 'stuff' item by ID
router.put('/:id', auth, multer, stuffController.modifyThing); // PUT request to update a 'stuff' item by ID
router.delete('/:id', auth, stuffController.deleteThing); // DELETE request to delete a 'stuff' item by ID

module.exports = router;