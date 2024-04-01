/**
 * Middleware for handling file uploads using Multer
 */

const multer = require('multer');

// Define MIME types and corresponding file extensions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// Configure storage settings for Multer
const storage = multer.diskStorage({
    // Specify destination directory for storing files
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // Define filename format for uploaded files
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // Replace spaces with underscores
        const extension = MIME_TYPES[file.mimetype]; // Get file extension from MIME type
        callback(null, name + Date.now() + '.' + extension); // Set filename with unique timestamp
    }
});

// Export Multer middleware configured with storage settings for single file uploads
module.exports = multer({ storage: storage }).single('image');