const Favorites = require('../models/favorites');

const alreadyExists = (req, res) => {
    let word = req.params.word;
    Favorites.find({ user: req.user._id })
        .then(favorites => {
            for (let i = 0; i < favorites[0].words.length; i++) {
                if (favorites[0].words[i].name == word) {
                    res.status(400).json({ error: 'This word already exists in the favorites list.' });
                    i = favorites[0].words.length;
                }
            }
        });
}

module.exports = alreadyExists;