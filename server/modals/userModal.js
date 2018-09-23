const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

userSchema.methods.removeToken = function(token){
    var user = this;

   return user.update({
        $pull:{tokens:{token}}
    });
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

userSchema.statics.findByCredentials = function(email,password){
    var User = this;
    
   return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(error,result)=>{
                if(result){
                    resolve(user);
                }else{
                    reject();
                }
            });
        });
    });
}

userSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        var password = user.password;
        bcrypt.genSalt(10,(error,salt)=>{
            bcrypt.hash(password,salt,(error,hash)=>{
                user.password = hash; 
                next();
            })
        })
    }else{
        next();
    }
});

var UserModel = mongoose.model('user',userSchema);

module.exports = {UserModel}