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
        // Replace spaces with underscores in the filename
        const name = file.originalname.split(' ').join('_');
        // Get file extension from MIME type
        const extension = MIME_TYPES[file.mimetype];
        // Set filename with unique timestamp to avoid overwriting existing files
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Export Multer middleware configured with storage settings for single file uploads
module.exports = multer({ storage: storage }).single('image');