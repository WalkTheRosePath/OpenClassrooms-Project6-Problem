// Reusable middleware functions

exports.generateImageUrl = (req) => {
    return req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
}

const errorHandler = (res, error) => {
    console.error(error);
    res.status(500).json({ error: error.message });
};

module.exports = { errorHandler };