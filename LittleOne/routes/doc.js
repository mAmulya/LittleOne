const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

var ts=require("time-slots-generator");

const nodemailer = require('nodemailer');

const Doctors=require('../models/Doctors');


router.get('/home',function(req,res){
  console.log(req.user);
      dates=[]
      b_dates=[]
      for(var i=0;i<req.user.availabledates.length;i++){
        dates.push(req.user.availabledates[i].date)
      }

      for(var c=0;c<req.user.bookings;c++){
        b_dates.push(req.user.bookings[c].date_n_time.date)
      }
      console.log(dates);
      res.render('doc_home',{doctor:req.user,dates:dates,b_dates:b_dates});
});


router.get('/form',function(req,res){
  console.log(req.user);
  res.render('doc_form')
});



router.post('/docs/dates',urlencodedParser,async function(req,res){
  console.log('------------------');
  console.log(req.body);
  var dates=req.body.finaldays;
  dates=dates.split('-');
  console.log(dates);

  time1=req.body.time1
  time2=req.body.time2

      mrng=[]
      noon=[]
      evng=[]
      console.log(time1.split(':')[0]);
      console.log(time2.split(':')[0]);
      var i;
      for(i=parseInt(time1.split(':')[0]);i<parseInt(time2.split(':')[0]);i++){
        console.log(i);
        if(i<12){
          mrng.push(i+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
        }
        else{
          if(i<15){
            noon.push(i+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
          }
          else{
            evng.push(i+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
          }
        }
      }
      if(time1.split(':')[1]!='00'){
        mrng.pop(time2.split(':')[0]+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
        evng.pop(time2.split(':')[0]+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
        noon.pop(time2.split(':')[0]+':'+time1.split(':')[1]+'-'+(i+1)+':'+time1.split(':')[1])
      }
      console.log('----mrng');
      console.log(mrng);
      console.log('------noon');
      console.log(noon);
      console.log('----evng');
      console.log(evng);
      availabledates=[]

      for (var d=0;d<dates.length;d++){
        if(dates[d].length!=0){
          if(mrng.length!=0){
            availabledates.push({date:dates[d],slot:'mrng',timeslots:mrng})
          }
          if(noon.length!=0){
            availabledates.push({date:dates[d],slot:'noon',timeslots:noon})
          }
          if(evng.length!=0){
            availabledates.push({date:dates[d],slot:'evng',timeslots:evng})
          }
        }



      }
      console.log('---------------');
      console.log(availabledates);

      await Doctors.updateOne({email:req.user.email},
                      {$addToSet:{availabledates:availabledates}},function(){})





console.log('redirecting you stupi thing--------------------')

  res.redirect('/doc/home')
});
module.exports = router;
