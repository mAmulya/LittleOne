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
  for(var i=0;i<req.user.availabledates.length;i++){
    dates.push(req.user.availabledates[i].date)
  }
  console.log(dates);
  res.render('doc_home',{doctor:req.user,dates:dates});
});

router.post('/docs/dates',urlencodedParser,function(req,res){
  console.log('kjbvc');
  var dates=req.body.dates;
  dates=dates.split('-');
  console.log(dates);

  time1='9:00';
  time2='18:00';


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

      if(mrng!=[]){
        availabledates.push({date:dates[d],slot:'mrng',timeslots:mrng})
      }
      if(noon!=[]){
        availabledates.push({date:dates[d],slot:'noon',timeslots:noon})
      }
      if(evng!=[]){
        availabledates.push({date:dates[d],slot:'evng',timeslots:evng})
      }

    }
    console.log('---------------');
    console.log(availabledates);

    console.log(req.user)

    Doctors.updateOne({email:req.user.email},
                    {$push:{availabledates:availabledates}},function(){})

    // Doctors.find({'email':req.user.email},function(err,doctor){
    //   if(err){
    //     console.log(err);
    //   }else{
    //       doctor.availabledates=availabledates
    //   }
    // })


  // res.redirect('doc/home');
});

module.exports = router;
