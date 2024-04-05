// Functions that can be used in multiple files

exports.generateImageUrl = (req) => {
    return req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
}