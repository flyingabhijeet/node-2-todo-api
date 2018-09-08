const mongoose = require('mongoose');

var TodoModel = mongoose.model('todo',{
        text:{
            type:String,
            required:true,
            minlength:true,
            trim:true
        },
        completed:{
            type:Boolean,
            default:false
        },
        completedAt:{type:Number,default:null}
    });

module.exports = {TodoModel};