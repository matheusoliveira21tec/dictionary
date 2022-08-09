const mongoose = require("mongoose");
const bCrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name:String,
    email:{type: String, required: true, unique: true},
    password:{type: String, required: true},
    create_at:{type: Date, default: Date.now},
    update_at:{type: Date, default: Date.now},
});

userSchema.pre('save', function(next){
    if(this.isNew || this.isModifield('password')){
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

userSchema.methods.isCorrectPassword = function(password, callback){
    bCrypt.compare(password, this.password, function(err,same){
        if(err)
        callback(err);
        else
        callback(err,same);
    })
}

module.exports = mongoose.model("User", userSchema);