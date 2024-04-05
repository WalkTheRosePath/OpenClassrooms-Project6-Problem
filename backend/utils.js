exports.createImageUrl = (req) => {
    return req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
}