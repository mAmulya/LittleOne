const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;



const ariclesSchema = new mongoose.Schema({
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
  pic:{
    type:String,
    required:false
  },
  title:{
    type:String,
    required:true
  },
  topic:{
    type:String,
    required:true
  },
  text:{
    type:String,
    required:true
  },
  likes:{
    type:String,
    default:'0'
  },
  images:{
    type:String,
    required:false
  },
  userlikes:[String],
  doclikes:[String],
  colikes:[String],
})

const Articles = mongoose.model('Articles',ariclesSchema)

module.exports = Articles
