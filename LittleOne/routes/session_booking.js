const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Counselors=require('../models/Counselors');
const Users=require('../models/Users');
const Bookings=require('../models/Bookings');



router.post('/',urlencodedParser, function(req,res){
  console.log('-------------------------------------123456789067----------------------');

  console.log(req.body);

  Counselors.findOne({email:req.body.email,type:'counselor'},function(err,doc){
     if(err){
         console.log(err);
     }else{
       console.log(doc);
         var check
         var j;
         for(j=0;j < doc.sessions.length;j++){
                if (doc.sessions[j]._id==req.body.id && parseInt(doc.sessions[j].limit)-parseInt(doc.sessions[j].bookings)>= req.body.count){
                  doc.sessions[j].bookings=parseInt(doc.sessions[j].bookings)+parseInt(req.body.count)



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

                        itemOne.save()

                    if((parseInt(doc.sessions[j].limit)-parseInt(doc.sessions[j].bookings))==0){
                      doc.sessions.splice(j,1)
                    }
                       break



             }
          }

          console.log(doc);
          doc.save()





     }
   })


  res.redirect('/user/home')
});





module.exports = router;
