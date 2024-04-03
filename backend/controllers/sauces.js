// Import the Sauce model and the fs module for file system operations
const Sauce = require('../models/sauce');
const fs = require('fs');

// Controller function to get all Sauces and return them as JSON response
exports.getAllSauces = (req, res, next) => {
    // Find all Sauces in the database
    Sauce.find()
        .then((sauces) => {
            // If the sauces are found, return them
            res.status(200).json(sauces);
        })
        .catch((error) => {
            // If the sauces are not found, return a "Bad Request" error
            res.status(400).json({
                error: error
            });
        });
};

// Controller function to get a single Sauce and return it as JSON response
exports.getOneSauce = (req, res, next) => {
    // Find the Sauce by its ID
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // If the sauce is found, return it
            res.status(200).json(sauce);
        })
        .catch((error) => {
            // If the sauce is not found, return a "Bad Request" error
            res.status(404).json({
                error: error
            });
        });
};

// Controller function to create a new Sauce based on the data received in the request body
exports.createSauce = (req, res, next) => {
    // Construct the image URL using the request protocol and host
    const imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename;
    
    // Parse the sauce data from the request body
    const sauceData = JSON.parse(req.body.sauce);
    
    // Create a new Sauce instance with data from the request
    const sauce = new Sauce({
        ...sauceData,
        imageUrl: imageUrl,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
  
    // Save the Sauce to the database
    sauce.save()
        .then(() => {
            // If saved successfully, return a message
            res.status(201).json({
                message: 'Sauce saved successfully!'
            });
        }
        ).catch((error) => {
            // If the sauce is not saved, return a "Bad Request" error
            res.status(400).json({
                error: error
            });
        });
};

// Controller function to modify a Sauce based on the ID provided in the request parameters
exports.modifySauce = (req, res, next) => {
    // Check if an image is uploaded
    let sauceData = req.body;
    if (req.file) {
        if (req.body.sauce) {
            try {
                sauceData = JSON.parse(req.body.sauce);
            } catch (error) {
                // Handle parsing error
                return res.status(400).json({
                    error: "Invalid sauce data format"
                });
            }
        }
        // If an image is uploaded, update imageUrl
        sauceData.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
    } 
    
    // Update the Sauce in the database
    Sauce.updateOne({ _id: req.params.id }, sauceData)
        .then(() => {
            // If the sauce is updated, return a message
            res.status(200).json({
                message: "Sauce updated successfully!"
            });
        })
        .catch((error) => {
            // If the sauce is not updated, return a "Bad Request" error
            res.status(400).json({
                error: error
            });
        });
};

// Controller function to delete a Sauce by its ID from the database and deletes its image file from the file system
exports.deleteSauce = (req, res, next) => {
    // Find the Sauce by its ID
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Extract the filename from the imageUrl
            const filename = sauce.imageUrl.split('/images/')[1];
            // Delete the file from the file system
            fs.unlink('images/' + filename, () => {
                // Delete the Sauce from the database
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        // If the sauce is deleted, return a message
                        res.status(200).json({
                            message: 'Sauce deleted successfully!'
                        });
                    })
                    .catch((error) => {
                        // If the sauce is not deleted, return a "Bad Request" error
                        res.status(400).json({
                            error: error
                        });
                    });
            });
        })
        .catch((error) => {
            // Handle unexpected errors or server-side issues
            res.status(500).json({
                error: error
            });
        });
};

// Controller function to like or dislike a Sauce by updating likes and dislikes count and maintains arrays of user IDs who liked or disliked
exports.likeOrDislikeSauce = (req, res, next) => {
    const { userId, like } = req.body;
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            // Check if the user has already liked or disliked the sauce
            const alreadyLiked = sauce.usersLiked.includes(userId);
            const alreadyDisliked = sauce.usersDisliked.includes(userId);

            // Update likes and dislikes accordingly
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
            } else if (like === -1 && !alreadyLiked && !alreadyDisliked) {
                // Dislike the sauce
                sauce.dislikes++;
                sauce.usersDisliked.push(userId);

                // Remove user from usersLiked array if already present
                const index = sauce.usersLiked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersLiked.splice(index, 1);
                    sauce.likes--;
                }
            } else if (like === 0 && alreadyLiked) {
                // Cancel like
                sauce.likes--;
                const index = sauce.usersLiked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersLiked.splice(index, 1);
                }
            } else if (like === 0 && alreadyDisliked) {
                // Cancel dislike
                sauce.dislikes--;
                const index = sauce.usersDisliked.indexOf(userId);
                if (index !== -1) {
                    sauce.usersDisliked.splice(index, 1);
                }
            }

            // Update the sauce in the database
            Sauce.updateOne({ _id: sauceId }, sauce)
                .then(() => {
                    // Return success message
                    res.status(200).json({
                        message: 'Like or dislike updated successfully!'
                    });
                })
                .catch((error) => {
                    // Handle database update error
                    res.status(400).json({
                        error: error
                    });
                });
        })
        .catch((error) => {
            // Handle sauce not found error
            res.status(404).json({
                error: 'Sauce not found!'
            });
        });
};