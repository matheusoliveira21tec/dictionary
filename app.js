var express = require('express');
var path = require('path');
var logger = require('morgan');
require ('./config/database');
var cors = require('cors');
var bodyParser = require("body-parser");
var authRouter = require('./app/routes/auth');
var entriesRouter = require('./app/routes/entries');
var dictionaryRouter = require('./app/routes/dictionary');
var userRouter = require ('./app/routes/user')
var app = express();

app.use(logger('dev'));
app.listen(3001);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRouter);
app.use('/entries/en', entriesRouter);
app.use('/user/me', userRouter);
app.use('/', dictionaryRouter);

module.exports = app;
