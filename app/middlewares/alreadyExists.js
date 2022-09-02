const Favorites = require('../models/favorites');

const alreadyExists = (req, res,next) => {
    let word = req.params.word;
    Favorites.find({ user: req.user._id })
        .then(favorites => {
            let exists = false;
            for (let i = 0; i < favorites[0].words.length; i++) {
                if (favorites[0].words[i].name == word) {
                    i = favorites[0].words.length;
                    res.status(400).json({ error: 'This word already exists in the favorites list.' });
                    exists = true;
                }
            }
            if(!exists){
                next();
            }
        })
        .catch(err => {
            res.status(400).json({ error: err });
        })
}

module.exports = alreadyExists;