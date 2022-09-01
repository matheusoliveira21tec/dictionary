var express = require('express');
var router = express.Router();
const User = require('../models/user');
const History = require('../models/history');
const Favorites = require('../models/favorites');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const secret = process.env.JWT_TOKEN;

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  try {
    await user.save();
    const history = new History({user : user._id});
    await history.save({user:user._id});
    const favorites = new Favorites({user : user._id});
    await favorites.save({user:user._id});
    const token = jwt.sign({ email }, secret, { expiresIn: '10d' });
    res.status(200).json({ id: user._id, name: user.name, token: token });
  } catch (error) {
    res.status(400).json({ error: 'Error registering new user.' });
  }
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user)
      res.status(400).json({ error: 'Incorrect email or password.' });
    else {
      user.isCorrectPassword(password, function (err, same) {
        if (!same)
          res.status(400).json({ error: 'Incorrect email or password.' });
        else {
          const token = jwt.sign({ email }, secret, { expiresIn: '10d' });
          res.status(200).json({ id: user._id, name: user.name, token: token });
        }
      })
    }
  } catch (error) {
    res.status(400).json({ error: 'Internal error, please try again.' });
  }
})

module.exports = router;
