const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');



const nodemailer = require('nodemailer');


const Users=require('../models/Users');
const Doctors=require('../models/Doctors');
const Counselors=require('../models/Counselors');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/',function(req,res){

  Doctors.find({},function(err,docs){
    if(err){
      console.log(err);
    }else{
      Counselors.find({},function(err,counselors){
        if(err){
          console.log(err);
        }else{
          res.render('landing',{docs:docs,counselors:counselors});

        }
      })

    }
  })

});



router.post('/',urlencodedParser, function (req, res) {
  console.log(req.body);



  let s = req.body.message+"\r\n"+"\r\n"+req.body.name+"\r\n"+req.body.telephone+"\r\n"+req.body.email;

    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wandermate.help@gmail.com',
      pass: 'wandermate123'
    }
  });

  var mailOptions = {
    from: 'wandermate.help@gmail.com',
    to: 'deepikasowmya.5@gmail.com, amulya.murukutla@gmail.com',
    subject: req.body.subject,
    text: s
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

    res.redirect('/')
  })


module.exports = router;
