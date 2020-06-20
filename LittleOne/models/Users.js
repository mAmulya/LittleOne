const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;

// const BookingSchema = new mongoose.Schema({
//   doctor:String,
//   doc_name:String,
//   type:String,
//   date_n_time:{'date':String,'slot':String,'time':String},
//   place:String,
//   current:Boolean,
// });
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
    // bookings:[BookingSchema],
    img:
        { path: String,
         contentType: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    notifications:{type:
      [{senderid:{type:String},
        typeid:{type:String},
        username:{type:String},
        img:{type:String},
        unread:{type:Boolean,default:false}}],default:void 0},


})


module.exports=mongoose.model('user',usersSchema);
