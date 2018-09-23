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
        completedAt:{type:Number,default:null},
        creator:{
            type:mongoose.Schema.Types.ObjectId,
            required:true
        }
    });

module.exports = {TodoModel};