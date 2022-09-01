var express = require('express');
var router = express.Router();
const Word = require('../models/word');
const History = require('../models/history');
const Favorites = require('../models/favorites');
const axios = require('axios');
const setupCache = require('axios-cache-adapter');
const withAuth = require('../middlewares/auth');
const alreadyExists = require('../middlewares/alreadyExists');
const cache = setupCache.setupCache({
    maxAge: 15 * 60 * 1000 //15 minutos
})

// Create `axios` instance passing the newly created `cache.adapter`
const api = axios.create({
    adapter: cache.adapter
})
api.interceptors.request.use((config) => {
    config.headers['request-startTime'] = new Date().getTime();
    return config;
})
api.interceptors.response.use((response) => {
    const currentTime = new Date().getTime();
    const startTime = response.config.headers['request-startTime'];
    response.headers['request-duration'] = currentTime - startTime;
    return response;
})


router.get('/', withAuth, async (req, res) => {
    const { search, page = 1, limit = 10 } = req.query;
    try {
        const words = await Word.find({ $text: { $search: search } })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Word.count({ $text: { $search: search } });
        const totalPages = Math.ceil(count / limit);
        const results = [];
        words.map((word) => results.push(word.name));

        res.status(200).json({
            results: results,
            totalDocs: count,
            page: page,
            totalPages: totalPages,
            hasNext: page >= totalPages ? false : true,
            hasPrev: page > 1 ? true : false
        });
    } catch (err) {
        console.error(err.message);
    }
}),
    router.get('/:word', withAuth, async (req, res) => {
        const urlDictionaryApi = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        try {
            let word = req.params.word;
            let response = await api.get(`${urlDictionaryApi}${word}`);
            let cache = '';
            if (response.request.fromCache !== true) {
                cache = 'MISS';
            }
            else {
                cache = 'HIT';
            }
            History.updateOne({ user: req.user._id }, { $push: { words: { name: word, add_at: Date.now() } } });
            if (response.request.fromCache !== true) {
            }
            res.set('x-cache', cache);
            res.set('x-response-time',`${response.headers['request-duration']}ms`);
            res.status(200).json(response.data);
        }
        catch (error) {
            res.status(400).json({ error: error });
        }
    });
router.post('/:word/favorite', withAuth, alreadyExists, async (req, res) => {
    try {
        let word = req.params.word;
        await Favorites.updateOne({ user: req.user._id }, { $push: { words: { name: word, add_at: Date.now() } } })
        res.status(200).json({ message: 'Word added to favorites list.' });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});
router.delete('/:word/unfavorite', withAuth, async (req, res) => {
    try {
        let word = req.params.word;
        await Favorites.updateOne({ user: req.user._id }, { $pull: { words: { name: word } } });
        res.status(200).json({ message: 'Word removed to favorites list.' });
    } catch (error) {
        res.status(400).json({ error: error });
    }
});

module.exports = router;