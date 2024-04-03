// Import the required modules
const Sauce = require('../models/sauce');
const fs = require('fs');

// Controller function to get all Sauces and return them as JSON response
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to get a single Sauce by its ID and return it as JSON response
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('Sauce not found!').message });
            } else {
                res.status(200).json(sauce);
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
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
            res.status(201).json({ message: 'Sauce saved successfully!' });
        }
        ).catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to modify a Sauce based on the ID provided in the request parameters
exports.modifySauce = (req, res, next) => {
    // Check if an image is uploaded
    let sauceData = req.body;

    // If an image is uploaded, update imageUrl
    if (req.file) {
        if (req.body.sauce) {
            try {
                sauceData = JSON.parse(req.body.sauce);
            } catch (error) {
                // Handle parsing error
                res.status(400).json({ error: new Error("Invalid sauce data format").message });
                return;
            }
        }
        sauceData.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + req.file.filename
    }

    // Update the Sauce in the database
    Sauce.updateOne({ _id: req.params.id }, sauceData)
        .then(() => {
            res.status(200).json({ message: "Sauce updated successfully!" });
        })
        .catch((error) => {
            res.status(400).json({ error: error.message });
        });
};

// Controller function to delete a Sauce by its ID from the database and deletes its image file from the file system
exports.deleteSauce = (req, res, next) => {
    // Find the Sauce by its ID
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('Sauce not found!').message });
            } else {
                // Extract the filename from the imageUrl
                const filename = sauce.imageUrl.split('/images/')[1];
                // Delete the file from the file system
                fs.unlink('images/' + filename, () => {
                    // Delete the Sauce from the database
                    Sauce.deleteOne({ _id: req.params.id })
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
            res.status(500).json({ error: error.message });
        });
};

// Controller function to like or dislike a Sauce by updating likes and dislikes count and maintains arrays of user IDs who liked or disliked
exports.likeOrDislikeSauce = (req, res, next) => {
    const { userId, like } = req.body;
    const sauceId = req.params.id;

    Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
            if (!sauce) {
                res.status(404).json({ error: new Error('Sauce not found!').message });
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
            Sauce.updateOne({ _id: sauceId }, sauce)
                .then(() => {
                    res.status(200).json({ message: 'Like or dislike updated successfully!' });
                })
                .catch((error) => {
                    res.status(400).json({ error: error.message });
                });
        })
        .catch((error) => {
            // Handle sauce not found error
            res.status(404).json({ error: new Error('Sauce not found!').message });
        });
};