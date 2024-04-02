// Import the Sauce model and the fs module for file system operations
const Sauce = require('../models/sauce');
const fs = require('fs');

// Controller function to create a new Sauce
exports.createSauce = (req, res, next) => {
    // Parse the request body
    req.body.sauce = JSON.parse(req.body.sauce);
    // Construct the image URL using the request protocol and host
    const url = req.protocol + '://' + req.get('host');
    // Create a new Sauce instance with data from the request
    const sauce = new Sauce({
        // TODO uPDATE
        title: req.body.sauce.title,
        description: req.body.sauce.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.sauce.price,
        userId: req.body.sauce.userId
    });
    // Save the Sauce to the database
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Post saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Controller function to get a single Sauce by its ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Controller function to modify a Sauce
exports.modifySauce = (req, res, next) => {
    // Initialize a new Sauce object with the provided ID
    let sauce = new Sauce({ _id: req.params._id });
    // If a file is uploaded, update the image URL
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.sauce = JSON.parse(req.body.sauce);
        sauce = {
            _id: req.params.id,
            title: req.body.sauce.title,
            description: req.body.sauce.description,
            imageUrl: url + '/images/' + req.file.filename,
            price: req.body.sauce.price,
            userId: req.body.sauce.userId
        };
    } else {
        // Otherwise, update the Sauce with data from the request body
        sauce = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            userId: req.body.userId
        };
    }
    // Update the Sauce in the database
    Sauce.updateOne({ _id: req.params.id }, sauce).then(
        () => {
            res.status(201).json({
                message: 'Sauce updated successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Controller function to delete a Sauce
exports.deleteSauce = (req, res, next) => {
    // Find the Sauce by its ID
    Sauce.findOne({ _id: req.params.id }).then(
        (sauce) => {
            // Extract the filename from the imageUrl
            const filename = sauce.imageUrl.split('/images/')[1];
            // Delete the file from the file system
            fs.unlink('images/' + filename, () => {
                // Delete the Sauce from the database
                Sauce.deleteOne({ _id: req.params.id }).then(
                    () => {
                        res.status(200).json({
                            message: 'Deleted!'
                        });
                    }
                ).catch(
                    (error) => {
                        res.status(400).json({
                            error: error
                        });
                    }
                );
            });
        }
    );
};

// Controller function to get all Sauces
exports.getAllSauces = (req, res, next) => {
    // Find all Sauces in the database
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};