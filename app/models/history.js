const mongoose = require("mongoose");

const historySchema = mongoose.Schema({
    words: [{name:{type: String}, add_at:{type: Date}}],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});
module.exports = mongoose.model("History", historySchema);