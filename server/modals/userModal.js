const mongoose = require('mongoose');

var UserModel = mongoose.model('user',{
    email : {
        type:String, 
        required:true, 
        minlength:1, 
        trim:true
    }
});

module.exports = {UserModel}