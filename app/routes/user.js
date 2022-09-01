var express = require('express');
var router = express.Router();
const User = require('../models/user');
const History = require('../models/history');
const Favorites = require('../models/favorites');
const Axios = require('axios');
const withAuth = require('../middlewares/auth');

router.get('/', withAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/history', withAuth, async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    try {
        const history = await History.find({ user: req.user._id });
        const results = [];
        history[0].words.map((words) => results.push({ word: words.name, added: words.add_at }));
        const resultsEdited = paginate(results, page, limit);
        const totalDocs = results.length;
        const totalPages = Math.ceil(totalDocs / limit);
        res.status(200).json({
            results: resultsEdited,
            totalDocs: totalDocs,
            page: page,
            totalPages: totalPages,
            hasNext: page >= totalPages ? false : true,
            hasPrev: page > 1 ? true : false
        });
    } catch (err) {
        console.error(err.message);
    }
});

router.get('/favorites', withAuth, async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    try {
        const favorite = await Favorites.find({ user: req.user._id });
        const results = [];
        favorite[0].words.map((words) => results.push({ word: words.name, added: words.add_at }));
        const resultsEdited = paginate(results, page, limit);
        const totalDocs = results.length;
        const totalPages = Math.ceil(totalDocs / limit);

        res.status(200).json({
            results: resultsEdited,
            totalDocs: totalDocs,
            page: page,
            totalPages: totalPages,
            hasNext: page >= totalPages ? false : true,
            hasPrev: page > 1 ? true : false
        });
    } catch (err) {
        console.error(err.message);
    }
});
const paginate = (results, page, limit) => {
    const resultsEdited = [];
    const totalDocs = results.length;
    const totalPages = Math.ceil(totalDocs / limit);
    let count = (page * limit) - limit;
    let delimiter = count + limit;
    if (page <= totalPages) {
        for (let i = count; i < delimiter; i++) {
            if (results[i] != null) { resultsEdited.push(results[i]); count++; }
        }
    }
    return resultsEdited;
}
module.exports = router;