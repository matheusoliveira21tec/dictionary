const mongoose = require('mongoose');

main().catch(err => console.log(err));
main().then(() => console.log("Conection Sucessful."));

async function main() {
    await mongoose.connect('mongodb://localhost/javascriptNote',
    );
}