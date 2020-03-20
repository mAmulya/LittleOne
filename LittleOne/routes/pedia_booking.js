const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Doctors=require('../models/Doctors');
const Users=require('../models/Users');


var data;
var form_data;

router.post('/',urlencodedParser, function(req,res){

  data=req.body
  console.log(data);
  res.redirect('/pedia_booking')
});


router.get('/',function(req,res){
  if (data==undefined){
        res.render('pedia_form',{doctors:false});
   }
  else{
       value_form=data
       data=undefined


         Doctors.find({$and:[{"doc_type":'pedia'},{"city":value_form.location},{"availabledates.date":value_form.date},{"availabledates.slot":value_form.slot}]},function(err,doctors){
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
                 docs.push({'name':doctors[i].name,'time':time[0],'email':doctors[i].email});
                 time=undefined
               }
             }
             console.log(docs);
             res.render('pedia_form',{user:req.user,doctors:docs,value:value_form});

           }
         })



   }

});


router.post('/done',urlencodedParser, function(req,res){

  console.log(req.body);


        Doctors.findOne({email:req.body.email,doc_type:'pedia'},function(err,doc){
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

                var itemOne = {
                  user:req.user.email,
                  user_name:req.user.name,
                  date_n_time:{date:value_form.date,slot:value_form.slot,time:req.body.time},
                  place:value_form.location,
                  current:true,
                  };




                doc.bookings.push(itemOne)
                console.log(doc);
                doc.save()


                itemOne = {
                  doctor:doc.email,
                  doctor_name:doc.name,
                  type:doc.doc_type,
                  date_n_time:{date:value_form.date,slot:value_form.slot,time:req.body.time},
                  place:value_form.location,
                  current:true,
                  };

                 Users.updateOne({email:req.user.email},
                                 {$push:{bookings:itemOne}},function(){})



           }
         })


  res.redirect('/pedia_booking')
});



module.exports = router;
