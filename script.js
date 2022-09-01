const db = require('./config/database');
const wordModel = require('./app/models/word');

const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('./words.csv')
    .pipe(csv())
    .on('data', (row) => {
        wordModel.create(row);
       // console.log(row);
    })
    .on('end', () => {
        console.log('CSV file successfully processed')
    });