const mongoose = require("mongoose");

const favoritesSchema = mongoose.Schema({
    words: [{name:{type: String}, add_at:{type: Date}}],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
module.exports = mongoose.model("Favorites", favoritesSchema);