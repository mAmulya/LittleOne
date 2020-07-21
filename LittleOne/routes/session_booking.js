const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');
const flash = require('connect-flash');

const Counselors=require('../models/Counselors');
const Users=require('../models/Users');
const Bookings=require('../models/Bookings');

const { check, validationResult } = require('express-validator');

var present=0
router.post('/',urlencodedParser, function(req,res){
  console.log('-------------------------------------123456789067----------------------');

  console.log(req.body);
  var present=0
  Counselors.findOne({email:req.body.email,type:'counselor'},async function(err,doc){
     if(err){
         console.log(err);
     }else{
       console.log('-------------------------------------found the doc');
       console.log(doc);
         var check
         var j;
         for(j=0;j < doc.sessions.length;j++){
                if (doc.sessions[j]._id==req.body.id && parseInt(doc.sessions[j].limit)-parseInt(doc.sessions[j].bookings)>= req.body.count){
                  doc.sessions[j].bookings=parseInt(doc.sessions[j].bookings)+parseInt(req.body.count)

                  console.log('=============================adding to bookings ans setting present=1');


                      var itemOne = new Bookings({
                        user:req.user.email,
                        user_name:req.user.name,
                        doctor:doc.email,
                        doc_name:doc.name,
                        doc_type:doc.type,
                        booking_type:'session_booking',
                        date_n_time:{date:doc.sessions[j].dates[0]},
                        count:req.body.count,
                        num_of_days:doc.sessions[j].num_of_days,
                        place:doc.city,
                        current:true,
                      });

                      console.log('-----------------------');
                      console.log(itemOne);

                        await itemOne.save()

                        present=1


                    if((parseInt(doc.sessions[j].limit)-parseInt(doc.sessions[j].bookings))==0){
                      doc.sessions.splice(j,1)
                    }
                       break



             }

          }

          console.log(doc);
          await doc.save()




     }

     test=[]
     test.push({senderid:req.user.email,sender_type:'user',img:req.user.img.path,username:req.user.name,typeid:'appointmnet',unread:true,msg:'you have a new appointment'})
     await Counselors.updateOne({"email":req.body.email},{
         $push:{
           notifications:{
             $each:test
           },

         }
       })
     Counselors.find({})
     .catch(err=>{console.log(err)})
     .then( counselors=>{
       sessions=[]
       for(var i=0;i<counselors.length;i++){
         console.log(counselors[i].email);
         for(var j=0;j<counselors[i].sessions.length;j++){
           console.log('-----------------');
         sessions.push({session:counselors[i].sessions[j],name:counselors[i].name,email:counselors[i].email})}
       }
       console.log(sessions);
       if(present==1){
         req.flash('error', 'Your session is booked !! check profile for more info')
       }
       else{
         req.flash('error', 'please check the limit of the booking')
       }
       res.render('counselors',{user:req.user,sessions:sessions,error:req.flash("error")});

     })

   })






});





module.exports = router;
