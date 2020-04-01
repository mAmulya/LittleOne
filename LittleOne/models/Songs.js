const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;



const songsSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    lowercase:true,
  },
  email:{
    type:String,
    required:true,
  },
  type:{
    type:String,
    required:true
  },
  song:{
    type:String,
    required:true
  },
  likes:{
    type:String,
    default:'0'
  },
  img:
      { path: String,
       contentType: String },
  userlikes:[String],
  doclikes:[String],
  colikes:[String],
})

const Songs = mongoose.model('Songs',songsSchema)

module.exports = Songs
