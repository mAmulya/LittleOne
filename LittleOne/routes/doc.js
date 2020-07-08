const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs');

var ts=require("time-slots-generator");

const nodemailer = require('nodemailer');

const Doctors=require('../models/Doctors');
const Users=require('../models/Users');
const Bookings=require('../models/Bookings');


router.get('/home',function(req,res){
  console.log(req.user);
      dates=[]
      b_dates=[]
      var present =0;
        console.log(req.user.availabledates);

        var datetime = new Date();
        date = datetime.toISOString().slice(0,10);
          date1 = date.split('-')
          console.log(date1)
          var date2 = date1[0]+'/'+date1[1]+'/'+date1[2]
          var user = req.user;
          Bookings.find({doctor:req.user.email}).then(booking=>{
            console.log('-----------------------------------------------');
            console.log(booking);
            for(var i=0;i<booking.length;i++){
              d2 = new Date()
              console.log(i);
              if(booking[i].current == true   ){
                d1 = new Date(booking[i].date_n_time.date);
                console.log(d1)
                console.log(d2)

                if(d1 <= d2){
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
              }
            }
            for(var c=0;c<booking.length;c++){
                b_dates.push(booking[c].date_n_time.date)
            }
            for(var i=0;i<req.user.availabledates.length;i++){
              dates.push(req.user.availabledates[i].date)

                for(var k=0;k<b_dates.length;k++){
                  if(req.user.availabledates[i].date==b_dates[k]){
                    dates.pop()
                    break
                  }
                }

            }

            console.log('--------------------------------------------------------------------------------------------homeeeeeeeeeee');
            console.log(b_dates);
            console.log(dates);
             // booking.save()
             res.render('doc_home',{doctor:req.user,dates:dates,b_dates:b_dates,user:req.user,booking:booking});

          })

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




router.post('/testimonial',async (req,res)=>{
  console.log('hey there')
console.log(req.body.userid)
  var test=[]
await Users.findOne({"email":req.body.userid})
.then(u=>{
  console.log(u)
  var a= req.user.img.path
  var b=u.name
test.push({senderid:req.user.email,sender_type:'doctor',img:a,username:b,testid:'testimonial',unread:true,msg:'please help me by testifying'})
console.log(test)
}

)
console.log(test)
await Users.updateOne({"email":req.body.userid},{
    $push:{
      notifications:{
        $each:test
      },

    }
  })
  .then(x=>console.log('updated'))
  .catch(x=>console.log(x))

  res.send('')
});

router.post('/profile', (req, res, next) =>{
  console.log('post data');
  console.log(req.body);
  console.log(req.files);

        Doctors.findById(req.user.id, (err, user) =>{

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

                res.redirect('/doc/home#edit');
            });
        });
    });

module.exports = router;
