const mongoose = require('mongoose');
const crypto = require('crypto'); //salt and hash password

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String, 
        required: true,
         unique: true,
        match:  /[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9][a-z0-9-]*[a-z0-9]/
        },
        hash : String,
        salt : String,        
    //password: {type: String, required: true}       
    wallets: [
     {
       wallet: {
         id: { type:String},
         address:{ type:String},
         name:{ type:String},
       }
     }
   ]  
});
userSchema.methods.setPassword = function(password) {
    
    // creating a unique salt for a particular user
       this.salt = crypto.randomBytes(16).toString('hex');
    
       // hashing user's salt and password with 1000 iterations, 64 length and sha512 digest
       this.hash = crypto.pbkdf2Sync(password, this.salt, 
       1000, 64, `sha512`).toString(`hex`);
   };
/**
 *  method to check entered password is correct or not
 validPassword method checks whether the user  password is correct or not
 It takes the user password from the request and salt from user database entry
 It then hashes user password and salt,then checks if this generated hash is equal 
 to user's hash in the database or not
 */
userSchema.methods.validPassword = function(password) {
    var loginHash = crypto.pbkdf2Sync(password, 
    this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === loginHash;
};
module.exports = mongoose.model('User', userSchema);