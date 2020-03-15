const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const usersSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
      type:String,
      required:true
    },
    method:{
      type:String,
    },
    email:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:false
    },
    phonenumber:{
        type:String,
        required:false
    },
    password:{
        type:String,
        required:false
    },
    img:
        { path: String,
         contentType: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date


})


module.exports=mongoose.model('user',usersSchema);
