const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Users=require('../models/Users');

router.get('/home',function(req,res){
console.log(req.user);
  res.render('user_home',{user:req.user});
});

router.get('/pregnancy_home',function(req,res){
    res.render('pregnancy_home');
  });


router.get('/counselors',function(req,res){
    res.render('counselors');
  });


module.exports = router;
