const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
    email : {
        type:String, 
        required:true, 
        minlength:1, 
        trim:true,
        unique:true,
        validate:{
            validator:validator.isEmail,
            message:`{Value} is not a valid email`
        },
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

userSchema.methods.toJSON = function(){
    var user = this;
    // var userObject = user.toObject();

    // return _.pick(userObject,['email','_id']);
    return _.pick(user,['email','_id']);
}

userSchema.methods.generateAuthToken = function (){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    user.tokens.push({access,token});

    return user.save().then(()=>{
        // console.log(token);
        return token;
    });
    // return token;
};

userSchema.statics.findByToken = function(token){
    var UserModel = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
        console.log('decoded----->',decoded);
    }
    catch(e){
        // return new Promise((resolve,reject)=>{
        //     return reject();
        // });
        console.log('Error Occured!');
        return Promise.reject();
    }
    return UserModel.findOne({
        _id:decoded._id,
        'tokens.token': token,
         'tokens.access':'auth'       
    });
};

var UserModel = mongoose.model('user',userSchema);

module.exports = {UserModel}