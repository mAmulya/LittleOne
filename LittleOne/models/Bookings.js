const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;



const bookingsSchema = new mongoose.Schema({
  user:String,
  user_name:String,
  doctor:String,
  doc_name:String,
  doc_type:String,
  booking_type:String,
  date_n_time:{'date':String,'slot':String,'time':String},
  count:String,
  num_of_days:String,
  place:String,
  current:Boolean,
  rating:{
      type:Number,
      default:0,
  },
  messages:{type:[
    {
      text:{type:String},
      sentby:{type:String},
      time:{type:String}
    }
  ]}
})

const Bookings = mongoose.model('Bookings',bookingsSchema)

module.exports = Bookings
