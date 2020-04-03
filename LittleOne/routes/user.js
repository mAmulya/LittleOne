const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const fs = require('fs');

const nodemailer = require('nodemailer');

const Users=require('../models/Users');
const Songs=require('../models/Songs');
const Articles=require('../models/Articles');
const Counselors=require('../models/Counselors');


const Counselors=require('../models/Counselors');

router.get('/home',function(req,res){
console.log(req.user);
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
  res.render('user_home',{user:req.user,sessions:sessions});

})

});

router.get('/pregnancy_home',function(req,res){
  console.log(req.user);
    res.render('pregnancy_home',{user:req.user});
  });


  router.get('/babycare_home',function(req,res){
    res.render('babycare_home');
  });

router.post('/song', urlencodedParser, function(req, res){
      console.log(req.body);
      if(req.files){
        var k = fs.readFileSync(req.files[0].path)
        song = '/uploads/'+req.files[0].filename
      }


      var songpost = new Songs({
        name: req.user.name,
        email:req.user.email,
        type: req.user.type,
        img:req.user.img,
        song: song,
        likes:0
      })
      songpost.save()
      res.redirect('/user/babycare_home');
    })



  router.get('/counselors',function(req,res){
    console.log(req.user);
    Counselors.find({},function(err,counselors){
      if(err){
        console.log(err);
      }else{
        console.log('------------------------\n\n------------------------');
        console.log(counselors);
        res.render('counselors',{counselors:counselors,user:req.user});
      }
    })
  });



router.get('/counselors/articles',function(req,res){
    Articles.find({},function(err,articles){


      res.render('counsellors1',{articles:articles});


    })

  });





  router.get('/single_article/:id',function(req,res){
    Articles.find({_id:req.params.id},function(err,details){
      console.log(details[0].name)
      var text = details[0].text
      someText = text.replace(/\n/g, "");
      console.log(someText)
      res.render('single_article',{details:details});

    })

  });

router.post('/song', urlencodedParser, function(req, res){
      console.log(req.body);
      if(req.files){
        var k = fs.readFileSync(req.files[0].path)
        song = '/uploads/'+req.files[0].filename
      }


      var songpost = new Songs({
        name: req.user.name,
        email:req.user.email,
        type: req.user.type,
        img:req.user.img,
        song: song,
        likes:0
      })
      songpost.save()
      res.redirect('/user/home');
    })

module.exports = router;
