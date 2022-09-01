//const mongoose = require('mongoose');


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:coodesh@cluster0.wprrwuv.mongodb.net";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


//main().catch(err => console.log(err));
//main().then(() => console.log("Conection Sucessful."));
//require('dotenv').config();

//async function main() {
 //   mongoose.connect('mongodb://localhost/dictionary');
//}