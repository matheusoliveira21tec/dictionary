const mongoose = require('mongoose');

main().catch(err => console.log(err));
main().then(() => console.log("Conection Sucessful."));
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;
async function main() {
    await mongoose.connect(MONGO_URL);
}