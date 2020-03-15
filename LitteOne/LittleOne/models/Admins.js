const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const adminsSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true
    },
    type:{
      type:String,
      required:true
    },

    password:{
        type:String,
        required:true
    },



})


module.exports=mongoose.model('admin',adminsSchema);
