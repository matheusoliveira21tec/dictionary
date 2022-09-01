var mongoose = require('mongoose');
const wordSchema = mongoose.Schema({
    name:  String
});
wordSchema.index({'name':'text'});
module.exports = mongoose.model("Word", wordSchema);