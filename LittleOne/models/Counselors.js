const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


// const BookingSchema = new mongoose.Schema({
//   user:String,
//   user_name:String,
//   date_n_time:{'date':String,'slot':String,'time':String},
//   place:String,
//   current:Boolean,
// });

const counselorsSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    email:{
      type:String,
      required:true
  },
  city:{
      type:String,
      required:true
  },
  phonenumber:{
      type:Number,
      required:true
  },
  password:{
      type:String,
      required:true
  },

  img:
  { path: String, contentType: String },
  reg_no:{
      type:String,
      required:true
  },
  year:{
      type:String,
      required:true
  },
  council:{
      type:String,
      required:true
  },
  is_verified:{
      type:Number,
      default:0,

  },
  sessions:{
    type:[{
      dates:[String],
      num_of_days:String,
      limit:String,
      topic:String,
      bookings:String
    }],default:undefined},


    availabledates:{
      type:[{
        date:{type:String},
        slot:String,
        timeslots:[String],
        }],default:undefined},
    // bookings:[BookingSchema],
    rating:{
        type:Number,
        default:0,

    },

    testimonials:{type:[{useremail:{type:String,lowercase:true,},text:{type:String}}]},
    notifications:{type:[{senderid:{type:String},typeid:{type:String},img:{type:String},username:{type:String},unread:{type:Boolean,default:false}}],default:void 0},



})

const Counselors = mongoose.model('Counselors',counselorsSchema)

module.exports = Counselors
