const mongoose = require("mongoose");
const bCrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name:String,
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    create_at:{type: Date, default: Date.now},
    update_at:{type: Date, default: Date.now},
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
});

userSchema.pre('save', function(next){
    if(this.isNew || this.isModifiel('password')){
        bCrypt.hash(this.password, 10,
            (err, hashedPassword)=>{
                if(err){
                    next(err);
                }
                else{
                    this.password = hashedPassword;
                    next();
                }
            })
    }
});

module.exports = mongoose.model("User", userSchema);