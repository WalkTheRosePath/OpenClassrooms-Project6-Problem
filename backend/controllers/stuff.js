// Import the Thing model and the fs module for file system operations
const Thing = require('../models/thing');
const fs = require('fs');

// Controller function to create a new Thing
exports.createThing = (req, res, next) => {
    // Parse the request body
    req.body.thing = JSON.parse(req.body.thing);
    // Construct the image URL using the request protocol and host
    const url = req.protocol + '://' + req.get('host');
    // Create a new Thing instance with data from the request
    const thing = new Thing({
        title: req.body.thing.title,
        description: req.body.thing.description,
        imageUrl: url + '/images/' + req.file.filename,
        price: req.body.thing.price,
        userId: req.body.thing.userId
    });
    // Save the Thing to the database
    thing.save().then(
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

// Controller function to get a single Thing by its ID
exports.getOneThing = (req, res, next) => {
    Thing.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

// Controller function to modify a Thing
exports.modifyThing = (req, res, next) => {
    // Initialize a new Thing object with the provided ID
    let thing = new Thing({ _id: req.params._id });
    // If a file is uploaded, update the image URL
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.thing = JSON.parse(req.body.thing);
        thing = {
            _id: req.params.id,
            title: req.body.thing.title,
            description: req.body.thing.description,
            imageUrl: url + '/images/' + req.file.filename,
            price: req.body.thing.price,
            userId: req.body.thing.userId
        };
    } else {
        // Otherwise, update the Thing with data from the request body
        thing = {
            _id: req.params.id,
            title: req.body.title,
            description: req.body.description,
            imageUrl: req.body.imageUrl,
            price: req.body.price,
            userId: req.body.userId
        };
    }
    // Update the Thing in the database
    Thing.updateOne({ _id: req.params.id }, thing).then(
        () => {
            res.status(201).json({
                message: 'Thing updated successfully!'
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

// Controller function to delete a Thing
exports.deleteThing = (req, res, next) => {
    // Find the Thing by its ID
    Thing.findOne({ _id: req.params.id }).then(
        (thing) => {
            // Extract the filename from the imageUrl
            const filename = thing.imageUrl.split('/images/')[1];
            // Delete the file from the file system
            fs.unlink('images/' + filename, () => {
                // Delete the Thing from the database
                Thing.deleteOne({ _id: req.params.id }).then(
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

// Controller function to get all Things
exports.getAllStuff = (req, res, next) => {
    // Find all Things in the database
    Thing.find().then(
        (things) => {
            res.status(200).json(things);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};