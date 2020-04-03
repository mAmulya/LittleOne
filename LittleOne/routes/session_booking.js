const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Counselors=require('../models/Counselors');
const Users=require('../models/Users');



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

                  var itemOne = {
                    user:req.user.email,
                    user_name:req.user.name,
                    date_n_time:{date:doc.sessions[j].dates[0],slot:req.body.count,time:doc.sessions[j].num_of_days},
                    place:doc.city,
                    current:true,
                    };

                    itemOne1 = {
                      doctor:doc.email,
                      doctor_name:doc.name,
                      type:doc.type,
                      date_n_time:{date:doc.sessions[j].dates[0],slot:req.body.count,time:doc.sessions[j].num_of_days},
                      place:doc.city,
                      current:true,
                      };

                    if((parseInt(doc.sessions[j].limit)-parseInt(doc.sessions[j].bookings))==0){
                      doc.sessions.splice(j,1)
                    }
                       break



             }
          }

          doc.bookings.push(itemOne)
          console.log(doc);
          doc.save()




           Users.updateOne({email:req.user.email},
                           {$push:{bookings:itemOne1}},function(){})



     }
   })


  res.redirect('/user/home')
});





module.exports = router;
