// Reusable middleware functions

// Generate an image URL
exports.generateImageUrl = (req) => {
    return req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
}

// Handle status 500 errors
const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({ error: error.message });
};
module.exports = { errorHandler };