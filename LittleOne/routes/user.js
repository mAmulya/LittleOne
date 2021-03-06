const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })

const fs = require('fs');
const flash = require('connect-flash');

const nodemailer = require('nodemailer');
const cron = require('node-cron');

const Users=require('../models/Users');
const Articles=require('../models/Articles');
const Counselors=require('../models/Counselors');
const Doctors=require('../models/Doctors');
const Bookings=require('../models/Bookings');



var error =undefined



router.get('/home',function(req,res){

if(error==undefined){
  res.render('user_home',{user:req.user});
}
else{
  res.render('user_home',{user:req.user,error:error});
  error=undefined;
}


});

router.get('/pregnancy_home',function(req,res){
  if(error==undefined){
    res.render('pregnancy_home',{user:req.user});
  }
  else{
    res.render('pregnancy_home',{user:req.user,error:error});
    error=undefined;
  }
  });

router.post('/reminder', urlencodedParser, function(req, res){
  console.log(req.body);
  var sch = req.body.time.split(":")[1] + ' ' + req.body.time.split(":")[0] + ' ' + req.body.date.split("-")[2] + ' ' +req.body.date.split("-")[1] + ' *'
  console.log(sch);
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'wandermate.help@gmail.com',
    pass: 'wandermate123'
  }
});

var mailOptions = {
  from: 'wandermate.help@gmail.com',
  to: req.user.email,
  subject: 'Reminder',
  text: req.body.abt
};

cron.schedule(sch,() => {
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
});
error =  'reminder is set on ' + req.body.date + ' at ' + req.body.time

res.redirect('/user/pregnancy_home')
})

router.post('/todo', urlencodedParser, function(req, res){
        console.log(req.body);
          Users.updateOne({email: req.user.email}, {$push: {todos: {todo: req.body.newitem, done: false }}}, function(err){
           console.log('-------------pushed');
         });

         res.redirect('/user/pregnancy_home#main')
})

router.post('/del_todo', urlencodedParser, async function(req, res){
        console.log(req.body);
        Users.findById(req.user._id, (err, user) =>{
          console.log('user----------------------');
          for(var i=0;i<user.todos.length;i++){
            if(user.todos[i]._id==req.body.id){
              user.todos.splice(i,1)
              console.log('todo deleteddd');
              break;
            }
          }
          user.save()
        })


})

router.post('/change_todo', urlencodedParser, async function(req, res){
        console.log(req.body);
        Users.findById(req.user._id, (err, user) =>{
          console.log('user----------------------');
          for(var i=0;i<user.todos.length;i++){
            if(user.todos[i]._id==req.body.id){
              user.todos[i].done=!user.todos[i].done
              console.log('todo changedd');
              break;
            }
          }
           user.save()
        })


})


router.get('/babycare_home',function(req,res){
    res.render('babycare_home',{user:req.user});
});






  router.get('/counselors',function(req,res){
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
      res.render('counselors',{user:req.user,sessions:sessions,error:req.flash("error")});
    })

  });






  router.get('/counselors/articles',function(req,res){
    console.log(req.user);
      Articles.find({},function(err,articles){
        console.log(articles);
        Articles.find({'topic':'anxiety'},function(err,anxiety){
          Articles.find({'topic':'depression'},function(err,depression){
            Articles.find({'topic':'abuse'},function(err,abuse){
              Articles.find({'topic':'family'},function(err,family){
                Articles.find({'topic':'adjustments'},function(err,adjustments){
                  console.log('user',req.user)
                  res.render('articles',{user:req.user,articles:articles,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length});

                })
              })
            })
          })
        })
      })
  });





  router.get('/articles/:name',function(req,res){
    console.log('------------------[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]--');

    console.log(req.params.name);
    var name = req.params.name;
    console.log(name);

    console.log(req.user);
      Articles.find({},function(err,articles){
        Articles.find({'topic':'anxiety'},function(err,anxiety){
          Articles.find({'topic':'depression'},function(err,depression){
            Articles.find({'topic':'abuse'},function(err,abuse){
              Articles.find({'topic':'family'},function(err,family){
                Articles.find({'topic':'adjustments'},function(err,adjustments){
                  if(name=='anxiety'){
                    res.render('articles',{user:req.user,articles:anxiety,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                  else if(name=='depression'){
                    res.render('articles',{user:req.user,articles:depression,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                  else if(name=='abuse'){
                    res.render('articles',{user:req.user,articles:abuse,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                  else if(name=='family'){
                    res.render('articles',{user:req.user,articles:family,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                  else if(name=='adjustments'){
                    res.render('articles',{user:req.user,adjustments:anxiety,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                  else if(name==null){
                    res.render('articles',{user:req.user,articles:articles,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                  }
                 })
              })
            })
          })
        })
      })
    });


    router.get('/one/:id',function(req,res){
      console.log(req.user);
        Articles.findOne({'_id':req.params.id},function(err,article){
          res.render('single_article',{user:req.user,article:article});
        })
    });



    router.post('/article/liked',function(req,res){
      console.log(req.body);
        Articles.findOne({'_id':req.body.ans},function(err,article){
              article.likes=Number(article.likes)+1
              if(req.user.type=='user'){
                article.userlikes.push(req.user.email)
              }
              else{
                if(req.user.type=='doctor'){
                  article.doclikes.push(req.user.email)
                }
                else{
                  if(req.user.type=='counselor'){
                    article.colikes.push(req.user.email)
                  }
                }
              }


          article.save()



          res.render('single_article',{user:req.user,article:article});

          })
    });



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
          if(error==undefined){
            res.render('profile', { user : user, date : date,booking:booking})

          }
          else{
            res.render('profile', { user : user, date : date,booking:booking,error:error})
            error=undefined
          }

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

              error = 'succesfully updated profile details!!'
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

router.post('/noti',urlencodedParser,async function(req,res){
  console.log('hey there')
console.log(req.body.notiid)
  var test=[]
  Users.findById(req.user._id, (err, user) =>{
    console.log('user----------------------');
    console.log(user);
    for(var i=0;i<user.notifications.length;i++){
      if(user.notifications[i]._id==req.body.notiid){
        user.notifications.splice(i,1)
        console.log('notification deleteddd');
        break;
      }
    }
    user.save()
  })


});

router.post('/testimonial/', urlencodedParser, function(req, res, next){
  console.log(req.body);
  if(req.body.sender_type=='doctor'){
     Doctors.updateOne({email: req.body.senderid}, {$push: {testimonials: {useremail: req.body.usermail, text: req.body.text }}}, function(err){
      console.log(err);
    });
    console.log('------------------updated');
  }
  else{
    console.log('counselor ');
    if(req.body.sender_type=='counselor'){
       Counselors.updateOne({email: req.body.senderid}, {$push: {testimonials: {usermail: req.body.usermail, text: req.body.text }}}, function(err){
        console.log(err);
      });
    }
    console.log('------------------updated');

  }

  req.flash('error', 'testimonial is sent')



  error =  'testimonial is sent'

  res.redirect('/user/profile')

  // res.render('user_home',{user:req.user,error:req.flash("error")});

});

module.exports = router;
