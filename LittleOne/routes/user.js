const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const fs = require('fs');

const nodemailer = require('nodemailer');

const Users=require('../models/Users');
const Articles=require('../models/Articles');

router.get('/home',function(req,res){
console.log(req.user);
  res.render('user_home',{user:req.user});
});

router.get('/pregnancy_home',function(req,res){
  console.log(req.user);
    res.render('pregnancy_home',{user:req.user});
  });


  router.get('/babycare_home',function(req,res){
    res.render('babycare_home');
  });




  router.get('/counselors',function(req,res){
    console.log(req.user);
    res.render('counselors',{user:req.user});
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
