const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const Users=require('../models/Users');

var otpGenerator = require('otp-generator');
var nodemailer = require('nodemailer');
const BodyParser = require("body-parser");
const Mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var fs = require('fs');
var passport = require('passport');
var multer =require('multer');
const flash = require('connect-flash');
var async = require('async');
var crypto = require('crypto');

const { check, validationResult } = require('express-validator');

const validatePhoneNumber = require('validate-phone-number-node-js');


var user;

router.post('/signup',                   [check('name').not().isEmpty().withMessage('Name is required'),
                                          check('password').not().isEmpty().withMessage('password is required'),
                                          check('password').isLength({min:6}).withMessage('Please enter a password at least 6 character.'),
                                          check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,).withMessage('Passwordmust contain one uppercase letter one lower case letter and one special character  '),
                                          check('confirm_password').not().equals('password').withMessage('Passwords do not match'),
                                          check('phonenumber').not().isEmpty().withMessage('phone number is required'),
                                          check('city').not().isEmpty().withMessage('city is required'),
                                          check("email").not().isEmpty().withMessage('Email is required'),
                                          check('email').isEmail().withMessage('Enter valid email'),
],function(req,res,next){



  const result = validatePhoneNumber.validate(req.body.phonenumber);

  let errors =validationResult(req);
  if(result===false){
    error={
      param:'phone number',
      msg:'enter a valid phone number',
      value:req.body.phonenumber
    }
    errors.errors.push(error)
  }

  if(req.body.password!=req.body.confirm_password){
    error={
      param:'password',
      msg:'passwords didnt match',
      value:req.body.confirm_password
    }
    errors.errors.push(error)
  }

  Users.findOne({email:req.body.email}).then(function(user_i){
            if(user_i!=null){
                  error = {
                    param:'email',
                    msg:'email already exist',
                    value:req.body.email

                  }
                  errors.errors.push(error)

                  return res.render('user_signup.ejs',{errors:errors,code:false});


            }else{

                if (errors.errors.length>0){
                        return res.render('user_signup.ejs',{errors:errors,code:false});
                }
                else{
                        bcrypt.hash(req.body.password,10,(err,hash)=>{
                            if(err){
                                console.log(err);
                            }else{

                                 user=new Users({
                                    name:req.body.name,
                                    type:'user',
                                    phonenumber:req.body.phonenumber,
                                    email:req.body.email,
                                    password:hash,
                                    city:req.body.city,
                            });

                            if(req.files[0]){

                                  var k = fs.readFileSync(req.files[0].path)
                                  user.img.path = '/uploads/'+req.files[0].filename
                                  user.img.contentType = 'image/png';
                            }
                            else{
                              user.img.path = '/uploads/suriya1.jpg1573825247106.jpeg'
                              user.img.contentType = 'image/png';

                            }

                            console.log(user);

                            // user.save()


                            verification_code=otpGenerator.generate(6, { upperCase: false, specialChars: false });
                            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'wandermate.help@gmail.com', pass: 'wandermate123' } });
                            var mailOptions = { from: 'wandermate.help@gmail.com', to: user.email, subject: 'Account Verification Token',
                            html : `Hello,<br> Your Verification Code for email verification.<br><b>${verification_code}</b>`,}

                           transporter.sendMail(mailOptions, function (err) {
                                     if (err) {
                                          console.log(err);
                                         }
                                      else{
                                          console.log('mail sent');
                                      }
                            });

                            }
                          console.log(verification_code);
                              });

                          return res.render('user_signup',{code:true});

}
}
});

  });

var code=undefined;
var verification_code;

router.post('/signup/code',function(req,res){
    console.log(req.body);
    code=req.body.verfication_code

    if(req.body.verfication_code==verification_code){


      console.log(user);


          user.save()
          .then(result =>{
              console.log("usercreated");

          })
          .catch(err=>{
              console.log(err);

          });
          req.flash('error', 'your account is registered')
         return res.redirect('/users/login')
    }
    else{
      let errors =validationResult(req);

        console.log('code unmatch')
        error={
          param:'verfication_code',
          msg:'Incorrect code',
          value:req.body.verfication_code
        }
        errors.errors.push(error)
        return res.render('user_signup',{errors:errors,code:true});
    }

  });


router.get('/signup',function(req,res){
    return res.render('user_signup',{code:false});

  });


  router.post('/login',function(req,res){
      Users.findOne({email:req.body.email},(err,user)=>{
        console.log(user);
          if(user){
            if(user.method=='google'){
              let errors =validationResult(req);

                error={
                  param:'email',
                  msg:'email id is registered with google',
                  value:req.body.email
                }
                errors.errors.push(error)
              return res.render('user_login',{email:undefined,errors:errors})
            }
            else{
              console.log('entered password')
              console.log(req.body.email)
              return res.render('user_login',{email:req.body.email});
            }
          }
          else{



                    console.log('email id not registered');
                    let errors =validationResult(req);

                      error={
                        param:'email',
                        msg:'email id not registered',
                        value:req.body.email
                      }
                      errors.errors.push(error)

                      if(error1==undefined){
                        return res.render('user_login',{email:undefined,errors:errors})
                      }
                      else{
                        return res.render('user_login',{email:undefined,errors:errors,error:error1});
                        error1=undefined;
                      }

                    return res.render('user_login',{email:undefined,errors:errors})

          }
      })
  });



  router.get('/login',function(req,res){


    if(captcha_true){
      console.log('33333333333333333333333333333333');
      var email=captcha_true
      captcha_true=undefined
      let errors =validationResult(req);

        console.log('code unmatch')
        error={
          param:'code',
          msg:'captcha didnt match',
          value:req.body.c
        }
        errors.errors.push(error)
      return res.render('user_login',{email:email,errors:errors});

    }
    else{

        console.log('12345678901234567890123456789');
        if(error1==undefined){
          return res.render('user_login',{email:undefined});
        }
        else{
          return res.render('user_login',{email:undefined,error:error1});
          error1=undefined;
        }


    }
  })

var captcha_true;
var pw_true;

router.post('/login/pw',function(req,res,next){
  if(req.body.c=='true'){
    console.log('222222222222222222222222222');
    captcha_true=undefined

      passport.authenticate('local1',{
      successRedirect:'/user/home',
      failureRedirect:'/users/login',
      failureFlash:true
      })(req,res,next);

  }else{
    console.log('111111111111111111111111111');

      captcha_true=req.body.email
      return res.redirect('/users/login')
    // return res.render('user_login',{email:undefined,errors:errors})
  }

})



router.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})



router.get('/google',passport.authenticate('google',{
  scope:['profile','email']
}));

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
  console.log('im here');
  return res.redirect('/user/home')
})




var error1=undefined;





router.get('/forgot', function(req, res) {


  if(error1==undefined){
    res.render('forgot');
  }
  else{
    res.render('forgot',{error:error});
    error1=undefined;
  }

});
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      console.log(req.body);
      Users.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          error1='No account with that email address exists.'
          return res.redirect('./forgot');
        }
console.log('sfa');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          console.log('saved');
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'bookrest.com@gmail.com',
        pass: 'ead@0139'
    }
});

      var mailOptions = {
        to: user.email,
        from: 'Bookrest@noreply.com',
        subject: 'Bookrest Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host +'/users/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        error1='An e-mail has been sent to ' + user.email + ' with further instructions.'
        console.log('sagdf');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('login');
    console.log('mailsent');
  });
});
router.get('/reset/:token', function(req, res) {
  Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      error1= 'Password reset token is invalid or has expired.'
      return res.redirect('./forgot');
    }
    res.render('reset');
  });
});

router.post('/reset/:token',urlencodedParser,[check('password').not().isEmpty().withMessage('password is required'),
                                          check('password').isLength({min:6}).withMessage('Please enter a password at least 6 character.'),
                                          check('password').matches(/^(?=.\d)(?=.[a-z])(?=.[A-Z])[a-zA-Z\d@$.!%#?&]/,).withMessage('Passwordmust contain one uppercase letter one lower case letter and one special character  '),
                                          check('password1').not().equals('password').withMessage('Passwords do not match'),
], function(req, res) {
    let errors =validationResult(req);
    if (errors.errors.lenght>0){
      console.log('im here')
      res.render('reset',{
        errors:errors

      });
    }else{
console.log(req.body)
  async.waterfall([
    function(done) {
      Users.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          error1= 'Password reset token is invalid or has expired.'
          console.log('Password reset token is invalid or has expired.')
          return res.redirect('./forgot');
        }

        bcrypt.genSalt(10,(err,salt)=>bcrypt.hash(req.body.password,salt,(err,hash)=>
        {
          if (err){
            console.log(err)
          } ;
          console.log(user.password)
          user.password=hash;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          console.log(user.password)
          console.log('created')
          user.save(function(err) {
                    req.logIn(user, function(err) {
                      console.log('done')
                      done(err, user);
                    });
                  });
        }))
      });
    },
    function(user, done) {
      console.log('mail')
      var smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'bookrest.com@gmail.com',
      pass: 'ead@0139'
    }
});
      var mailOptions = {
        to: user.email,
        from: 'koushiks666@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        error1='Success! Your password has been changed.'
        done(err);
      });
    }
  ], function(err) {
    console.log('im1')
     res.redirect('/users/login');
  });
};
});

  module.exports=router
