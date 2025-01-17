// Import the required modules
const fs = require('fs');

const SauceModel = require('../models/sauce');
const utils = require('../utils');
const { error } = require('console'); // TODO Check if this line can be deleted
const { errorHandler } = require('../utils');


// Controller function to get all Sauces and return them as JSON response
exports.getAllSauces = (req, res) => {
    SauceModel.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to get a single Sauce by its ID and return it as JSON response
exports.getOneSauce = (req, res) => {
    SauceModel.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: 'Failed to find the sauce with the given ID!' });
            } else {
                res.status(200).json(sauce);
            }
        })
        .catch((error) => {
            errorHandler(res, error);
        });
};

// Controller function to create a new Sauce based on the data received in the request body
exports.createSauce = (req, res) => {
    // Create a new Sauce instance with data from the request
    const sauceDocument = new SauceModel({
        ...JSON.parse(req.body.sauce),
        imageUrl: utils.generateImageUrl(req),
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    // Save the Sauce to the database
    sauceDocument.save()
        .then((doc) => {
            res.status(201).json({ _id: doc.id, message: 'Sauce saved successfully!' });
        }
        ).catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to modify a Sauce based on the ID provided in the request parameters
exports.modifySauce = (req, res) => {
    // Check if an image is uploaded
    let sauceData = req.body;

    if (req.is("multipart/form-data")) {
        // If an image is uploaded, update imageUrl
        if (req.file) {
            if (req.body.sauce) {
                try {
                    sauceData = JSON.parse(req.body.sauce);
                } catch (error) {
                    // Handle parsing error
                    res.status(400).json({ error: 'Invalid sauce data format!' });
                    return;
                }
            }
            sauceData.imageUrl = utils.generateImageUrl(req)
        }
    }

    // Update the Sauce in the database
    SauceModel.updateOne({ _id: req.params.id }, sauceData)
        .then(() => {
            res.status(200).json({ message: "Sauce updated successfully!" });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to delete a Sauce by its ID from the database and deletes its image file from the file system
exports.deleteSauce = (req, res) => {
    // Find the Sauce by its ID
    SauceModel.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: 'Failed to find the sauce with the given ID!' });
            } else {
                // Extract the filename from the imageUrl
                const filename = sauce.imageUrl.split('/images/')[1];
                console.log(filename)
                // Delete the file from the file system
                fs.unlink('images/' + filename, () => {
                    // res.status(200).json({ message: 'Sauce not deleted!' });
                    // Delete the Sauce from the database
                    SauceModel.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Sauce deleted successfully!' });
                        })
                        .catch((error) => {
                            res.status(400).json({ error: error.message });
                        });
                });
            }
        })
        .catch((error) => {
            errorHandler(res, error);
        });
};

// Controller function to like or dislike a Sauce by updating likes and dislikes count and maintains arrays of user IDs who liked or disliked
exports.likeOrDislikeSauce = (req, res) => {
    const { userId, like } = req.body;
    const sauceId = req.params.id;

    // Validate the 'like' parameter to only accept specific values
    if (![1, 0, -1].includes(like)) {
        return res.status(400).json({ error: 'Invalid value for "like" parameter.' });
    }

    SauceModel.findOne({ _id: sauceId })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: 'Failed to find the sauce with the given ID!' });
                return;
            }

            // Check if the user has already liked or disliked the sauce
            const alreadyLiked = sauce.usersLiked.includes(userId);
            const alreadyDisliked = sauce.usersDisliked.includes(userId);

            // If user likes (and did not previously like or dislike)
            if (like === 1 && !alreadyLiked && !alreadyDisliked) {
                // Like the sauce
                sauce.likes++;
                sauce.usersLiked.push(userId);

                // Remove user from usersDisliked array if already present
                const index = sauce.usersDisliked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersDisliked.splice(index, 1);
                    sauce.dislikes--;
                }
            }
            // If user dislikes (and did not previously like or dislike)
            else if (like === -1 && !alreadyLiked && !alreadyDisliked) {
                // Dislike the sauce
                sauce.dislikes++;
                sauce.usersDisliked.push(userId);

                // Remove user from usersLiked array if already present
                const index = sauce.usersLiked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersLiked.splice(index, 1);
                    sauce.likes--;
                }
            }
            // If user likes (but already previously liked)
            else if (like === 0 && alreadyLiked) {
                // Cancel like
                sauce.likes--;
                const index = sauce.usersLiked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersLiked.splice(index, 1);
                }
            }
            // If user dislikes (but already previously disliked)
            else if (like === 0 && alreadyDisliked) {
                // Cancel dislike
                sauce.dislikes--;
                const index = sauce.usersDisliked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersDisliked.splice(index, 1);
                }
            }

            // Update the sauce in the database
            SauceModel.updateOne({ _id: sauceId }, sauce)
                .then(() => {
                    res.status(200).json({ message: 'Like or dislike updated successfully!' });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            // Handle sauce not found error
            res.status(404).json({ error: 'Failed to find the sauce with the given ID!' });
        });
};