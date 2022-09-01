var express = require('express');
var router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
})

module.exports = router;
