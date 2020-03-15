const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var nodemailer = require('nodemailer');


const Admin = require('../models/Admins');
const Doctor = require('../models/Doctors');
const Counselor = require('../models/Counselors');

const bcrypt = require("bcryptjs");

var passport = require('passport');


router.post('/login',function(req,res,next){

    passport.authenticate('local3',{
        successRedirect:'/admin/home',
        failureRedirect:'/admin/login',
        failureFlash:true
        })(req,res,next);

});


router.get('/login',function(req,res){
    res.render('admin_login');
});

router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})



router.get('/home',function(req,res){
    console.log(req.user);
    Doctor.find({is_verified:0},function(err,docs){
      Counselor.find({is_verified:0},function(err,cos){


          res.render('admin_home',{docs:docs,cos:cos})
      })

    })
});

router.post('/verify',function(req,res){
    console.log(req.body.email)
    console.log(req.body.accept)
    console.log(req.body.reject)
    if(req.body.accept){
        Doctor.findOneAndUpdate({email:req.body.email},{$set:{is_verified:1}},function(err,doc){
            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
            var mailOptions = { from: 'wandermate.help@gmail.com', to: req.body.email, subject: 'Account Accepted',
            html : `Hello,<br> You are Doctor Details are verified and accepted by the Admin.<br>`,}

           transporter.sendMail(mailOptions, function (err) {
               if (err) {
                   console.log("b");
                    console.log(err);
                   }
                else{
                    console.log('mail sent');
                }

                });
            console.log(doc);
            res.redirect('/admin/home')
        })
    }
    if(req.body.reject){
        Doctor.findOneAndUpdate({email:req.body.email},{$set:{is_verified:-1}},function(err,doc){
            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
            var mailOptions = { from: 'wandermate.help@gmail.com', to: req.body.email, subject: 'Account Rejected',
            html : `Hello,<br> Your Doctor Details are verified and rejected by the Admin.Due to few invalid Details.Try Again with different Email Id<br>`,}

           transporter.sendMail(mailOptions, function (err) {
               if (err) {
                   console.log("b");
                    console.log(err);
                   }
                else{
                    console.log('mail sent');
                }

                });
            console.log(doc);
            res.redirect('/admin/home')
        })

    }
})


router.post('/verify_co',function(req,res){
    console.log(req.body.email)
    console.log(req.body.accept)
    console.log(req.body.reject)
    if(req.body.accept){
        Counselor.findOneAndUpdate({email:req.body.email},{$set:{is_verified:1}},function(err,co){
            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
            var mailOptions = { from: 'wandermate.help@gmail.com', to: req.body.email, subject: 'Account Accepted',
            html : `Hello,<br> You are Counselor Details are verified and accepted by the Admin.<br>`,}

           transporter.sendMail(mailOptions, function (err) {
               if (err) {
                   console.log("b");
                    console.log(err);
                   }
                else{
                    console.log('mail sent');
                }

                });
            console.log(co);
            res.redirect('/admin/home')
        })
    }
    if(req.body.reject){
        Counselor.findOneAndUpdate({email:req.body.email},{$set:{is_verified:-1}},function(err,co){
            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
            var mailOptions = { from: 'wandermate.help@gmail.com', to: req.body.email, subject: 'Account Rejected',
            html : `Hello,<br> Your Counselor Details are verified and rejected by the Admin.Due to few invalid Details.Try Again with different Email Id<br>`,}

           transporter.sendMail(mailOptions, function (err) {
               if (err) {
                   console.log("b");
                    console.log(err);
                   }
                else{
                    console.log('mail sent');
                }

                });
            console.log(co);
            res.redirect('/admin/home')
        })

    }
})




module.exports=router
