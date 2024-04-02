// Import the Sauce model and the fs module for file system operations
const { error } = require('console');
const Sauce = require('../models/sauce');
const fs = require('fs');

// Controller function to create a new Sauce
exports.createSauce = (req, res, next) => {
    // Construct the image URL using the request protocol and host
    const imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    // Create a new Sauce instance with data from the request
    const sauce = new Sauce({
        ...req.body,
        imageUrl: imageUrl
    });
    // Save the Sauce to the database
    sauce.save().then(
        () => {
            res.status(201).json({
                message: 'Sauce saved successfully!'
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
    Sauce.findOne({ _id: req.params.id }).then(
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
    const sauce = req.file ? // If a file is uploaded
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
        } : { ...req.body }; // Otherwise, update with data from request body
    // Update the Sauce in the database
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id }).then(
        () => {
            res.status(200).json({
                message: "Sauce updated successfully!"
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