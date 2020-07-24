const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Counselors=require('../models/Counselors');
const Users=require('../models/Users');
const Bookings=require('../models/Bookings');

var error=undefined;

var data;
var form_data;

router.post('/',urlencodedParser, function(req,res){

  data=req.body
  console.log(data);
  res.redirect('/co_booking')
});


router.get('/',function(req,res){
  if (data==undefined){
        res.render('cob_form',{doctors:false});
   }
  else{
       value_form=data
       data=undefined


         Counselors.find({$and:[{"type":'counselor'},{"city":value_form.location},{"availabledates.date":value_form.date},{"availabledates.slot":value_form.slot}]},function(err,doctors){
           if(err){
             console.log(err);
           }else{
             console.log('----------------------------');
             console.log(doctors);
             var docs=[]
             var time=undefined
             var i,j,k;
             for(i=0;i<doctors.length;i++){
               for (j=0;j<doctors[i].availabledates.length;j++){
                 if(doctors[i].availabledates[j].date==value_form.date && doctors[i].availabledates[j].slot==value_form.slot){
                       if (time==undefined){
                         time=[]
                         time.push(doctors[i].availabledates[j].timeslots)
                       }
                       else{
                         time.push(doctors[i].availabledates[j].timeslots)
                       }
                 }
               }

               if(time){
                 docs.push({'name':doctors[i].name,'time':time[0],'email':doctors[i].email,doctor:doctors[i]});
                 time=undefined
               }
             }
             console.log(docs);
             res.render('cob_form',{user:req.user,doctors:docs,value:value_form});

           }
         })



   }

});


router.post('/done',urlencodedParser, function(req,res){

  console.log(req.body);


        Counselors.findOne({email:req.body.email,type:'counselor'},async (err,doc)=>{
           if(err){
               console.log(err);
           }else{
             console.log(doc);
               var check
               var j;
               for(j=0;j < doc.availabledates.length;j++){
                      if (doc.availabledates[j].date==value_form.date && doc.availabledates[j].slot==value_form.slot){
                      var slots=doc.availabledates[j].timeslots;
                      var i;
                      for(i=0;i<slots.length;i++){
                        if(slots[i]==req.body.time){
                              console.log('yes');
                              slots.splice(i,1)
                              check=1
                              i=i-1;
                              break;
                            }
                      }
                      if(slots.length==0){
                        doc.availabledates.splice(j,1)
                      }
                      if (check==1){
                        break  }
                   }
                }




                var itemOne = new Bookings({
                  user:req.user.email,
                  user_name:req.user.name,
                  doctor:doc.email,
                  doc_name:doc.name,
                  doc_type:doc.doc_type,
                  booking_type:'co_booking',
                  date_n_time:{date:value_form.date,slot:value_form.slot,time:req.body.time},
                  count:'1',
                  num_of_days:'1',
                  place:value_form.location,
                  current:true,
                });

                console.log('-----------------------');
                console.log(itemOne);

                itemOne.save()
                console.log(doc);
                doc.save()

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
         })
         error = 'Your appoitment is confirmed !! check the current Bookings'


         if(error==undefined){
           res.render('user_home',{user:req.user});
         }
         else{
           res.render('user_home',{user:req.user,error:error});
           error=undefined;
         }


       });



module.exports = router;
