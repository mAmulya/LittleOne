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
const Bookings=require('../models/Bookings');



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


router.get('/profile', async (req,res) => {
      var datetime = new Date();
      date = datetime.toISOString().slice(0,10);
        date1 = date.split('-')
        console.log(date1)
        var date2 = date1[0]+'/'+date1[1]+'/'+date1[2]
        var user = req.user;
        Bookings.find({user:req.user.email}).then(booking=>{
          console.log('-----------------------------------------------');
          console.log(booking);
          for(var i=0;i<booking.length;i++){
            d2 = new Date()
            console.log(i);
            if(booking[i].current == true   ){
              console.log('camehere')
              d1 = new Date(booking[i].date_n_time.date);
              console.log(d1)
              console.log(d2)

              if(d1 <= d2){
                console.log('heyy')
                  console.log('yes');
                  if(d1==d2){
                  d2 = new Date().getHours
                  d1 = booking[i].date_n_time.time
                  d1 = d1.split(':')
                  if(Number(d2) >Number(d1[0])){
                    booking[i].current=false
                  }
                }
                else{
                  booking[i].current=false
                }
              }
              console.log('hip hip hurray')
            }
          }
          // booking.save()
          res.render('profile', { user : user, date : date,booking:booking})

        })
    })

router.post('/profile', (req, res, next) =>{
  console.log('post data');
  console.log(req.body);
  console.log(req.files);

        Users.findById(req.user.id, (err, user) =>{

            // todo: don't forget to handle err

            if (!user) {
                req.flash('error', 'No account found');
                return res.redirect('/users/login');
            }

            // good idea to trim
            var name = req.body.name.trim();
            var email = req.body.email.trim();
            var number = req.body.phone.trim();
            var city = req.body.city.trim();


            if (!name || !email || !number || !city) {
                req.flash('error', 'One or more fields are empty');
                return res.redirect('/user/profile');
            }


            user.name = name;
            user.email = email;
            user.phonenumber = number;
            user.city = city;
            if(req.files[0]){

              var k = fs.readFileSync(req.files[0].path)
              user.img.path = '/uploads/'+req.files[0].filename
              user.img.contentType = 'image/png';
            }
            user.save(function (err) {

                // todo: don't forget to handle err

                res.redirect('/user/profile');
            });
        });
    });

router.post('/st',async (req,res) => {
  Bookings.findById(req.body.id, (err, booking) =>{
    console.log('rating----------------------');
    console.log(booking);
    booking.rating=Number(req.body.st)
    booking.save()
  })
  if(req.body.type=='counselor'){
    var counselor = await Counselors.findOne({'email':req.body.doctor})
    console.log('-----------counselor');
    console.log(counselor);
    counselor.rating=(counselor.rating + Number(req.body.st))/2
    console.log(counselor.rating);
    await counselor.save()
  }
  else{
    var doctor = await Doctors.findOne({'email':req.body.doctor})
    console.log('-----------doctor');
    console.log(doctor);
    doctor.rating=(doctor.rating + Number(req.body.st))/2
    console.log(doctor.rating);
    await doctor.save()
  }

})



module.exports = router;
