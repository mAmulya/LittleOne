const express=require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs');

var ts=require("time-slots-generator");

const nodemailer = require('nodemailer');
const Counselors=require('../models/Counselors');
const Articles=require('../models/Articles');


router.get('/home',function(req,res){
  console.log(req.user);
      dates=[]
      s_dates=[]
      all=[]
      for(var i=0;i<req.user.availabledates.length;i++){
        dates.push(req.user.availabledates[i].date)
      }
      for(var j=0;j<req.user.sessions.length;j++){
        for(var k=0;k< req.user.sessions[j].dates.length;k++){
            s_dates.push(req.user.sessions[j].dates[k])
        }
      }
      all=dates.concat(s_dates)
      console.log(dates);
      res.render('co_home',{counselor:req.user,dates:dates,s_dates:s_dates,all:all,bool:false});
});

router.get('/myarticles',function(req,res){
  console.log(req.user);
    Articles.find({'email':req.user.email},function(err,articles){
      console.log(articles);
      res.render('co_my',{counselor:req.user,articles:articles});
    })
});

router.get('/one/:id',function(req,res){
  console.log(req.user);
    Articles.findOne({'_id':req.params.id},function(err,article){
      res.render('co_one',{counselor:req.user,article:article});
    })
});

router.post('/', urlencodedParser, function(req, res){
  var img='uploads/places/Hyderabad/imgs/bg0.jpg';
  console.log('here')
  console.log(req.body);
  if(req.files){
    var k = fs.readFileSync(req.files[0].path)
    img = '/uploads/'+req.files[0].filename
  }


  var articlepost = new Articles({
    name: req.user.name,
    email:req.user.email,
    type: req.user.type,
    title: req.body.title,
    text: req.body.text,
    images: img,
    likes:0
  })
  articlepost.save()
  res.redirect('/co/home');
})


router.get('/form',function(req,res){
  console.log(req.user);
  res.render('co_form')
});



router.post('/cos/dates',urlencodedParser,async function(req,res){
  console.log('------------------');
  console.log(req.body);
  var dates=req.body.finaldays;
  dates=dates.split('-');
  console.log(dates);

if(req.body.type=='person'){
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

      await Counselors.updateOne({email:req.user.email},
                      {$set:{availabledates:availabledates}},function(){})

}
else{
  if(req.body.type=='group'){
    var sessions={
      dates:dates,
      num_of_days:req.body.num_of_days,
      limit:req.body.limit,
      topic:req.body.topic,
      bookings:'0'}
    await Counselors.updateOne({email:req.user.email},
                    {$push:{sessions:sessions}},function(){})
  }
}



console.log('redirecting you stupi thing--------------------')

  res.redirect('/co/home')
});
module.exports = router;
