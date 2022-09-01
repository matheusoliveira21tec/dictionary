const mongoose = require('mongoose');

main().catch(err => console.log(err));
main().then(() => console.log("Conection Sucessful."));
require('dotenv').config();

async function main() {
    mongoose.connect('mongodb://localhost/dictionary');
}