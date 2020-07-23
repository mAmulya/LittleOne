const mongoose = require('mongoose')
const MongoClient = require('mongodb').MongoClient;


// const BookingSchema = new mongoose.Schema({
//   user:String,
//   user_name:String,
//   date_n_time:{'date':String,'slot':String,'time':String},
//   place:String,
//   current:Boolean,
// });

const guidesSchema = new mongoose.Schema({

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
        is_verified:{
            type:Number,
            default:0,
        },
        img:
            { path: String,
             contentType: String },
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
        doc_type:{
            type:String,
            required:true
        },
        availabledates:{
            type:[{
            date:{type:String},
            slot:String,
            timeslots:[String],
        }],default:undefined},
        // bookings:[BookingSchema],
        resetPasswordToken: String,
        resetPasswordExpires: Date,

        rating:{
            type:Number,
            default:0,

        },
        testimonials:{type:[{useremail:{type:String,lowercase:true,},text:{type:String}}]},
        notifications:{type:
          [{senderid:{type:String},
            typeid:{type:String},
            username:{type:String},
            img:{type:String},
            msg:{type:String},
            sender_type:{type:String},
            unread:{type:Boolean,default:false}}],default:void 0},

})

const Doctors = mongoose.model('Doctors',guidesSchema)

module.exports = Doctors
