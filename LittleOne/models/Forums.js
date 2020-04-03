const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

const AnswerSchema = new mongoose.Schema({
  name:String,
  email:String,
  type:String,
  answer:String,
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
});

const forumsSchema = new mongoose.Schema({
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
  question:{
    type:String,
    required:true
  },
  title:{
      type:String,
      required:true
    },
  topic:{
    type:String,
    required:true
  },
  answers:[AnswerSchema],
  img:
      { path: String,
       contentType: String },
})

const Forums = mongoose.model('Forums',forumsSchema)

module.exports = Forums
