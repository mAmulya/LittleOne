const express=require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require('fs');

var ts=require("time-slots-generator");

const nodemailer = require('nodemailer');
const Counselors=require('../models/Counselors');
const Articles=require('../models/Articles');
const Bookings=require('../models/Bookings');
const Users=require('../models/Users');





router.get('/home',function(req,res){
  console.log(req.user);
      dates=[]
      s_dates=[]
      b_dates=[]

      for(var j=0;j<req.user.sessions.length;j++){
        for(var k=0;k< req.user.sessions[j].dates.length;k++){
            s_dates.push(req.user.sessions[j].dates[k])
        }
      }
      var present =0;
      Bookings.find({doctor:req.user.email},function(err,booking){
        console.log('------------------------------------------------------------------');
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
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------');
            console.log(booking[c].date_n_time.date);
            b_dates.push(booking[c].date_n_time.date)
            console.log('--------------');
            console.log(booking[c]);
            if(booking[c].booking_type=='session_booking'){
              for(var f=0;f<booking[c].num_of_days;f++){
                df = new Date(booking[c].date_n_time.date);
                var nextDay = new Date(df);
                nextDay.setDate(df.getDate() + f);
                y=nextDay.getFullYear()
                if(Number(nextDay.getMonth())<10){
                  m='0'+(Number(nextDay.getMonth())+Number(1))
                }
                else{
                  m=(Number(nextDay.getMonth())+Number(1))
                }
                if(Number(nextDay.getDate())<10){
                  date_d='0'+Number(nextDay.getDate())
                }
                else{
                  date_d=Number(nextDay.getDate())
                }
                df__= y + '/' + m + '/' + date_d
                console.log(df__);
                b_dates.push(df__)

              }
            }
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
        res.render('co_home',{counselor:req.user,dates:dates,s_dates:s_dates,b_dates:b_dates,booking:booking});
      })
});

router.get('/myarticles',function(req,res){
  console.log(req.user);
    Articles.find({'email':req.user.email},function(err,articles){
      console.log(articles);
      Articles.find({'email':req.user.email,'topic':'anxiety'},function(err,anxiety){
        Articles.find({'email':req.user.email,'topic':'depression'},function(err,depression){
          Articles.find({'email':req.user.email,'topic':'abuse'},function(err,abuse){
            Articles.find({'email':req.user.email,'topic':'family'},function(err,family){
              Articles.find({'email':req.user.email,'topic':'adjustments'},function(err,adjustments){
                res.render('co_my',{counselor:req.user,articles:articles,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length});

              })
            })
          })
        })
      })
    })
});

router.get('/myarticles/:name',function(req,res){
  console.log('--------------------');

  console.log(req.params.name);

  console.log(req.user);
    Articles.find({'email':req.user.email},function(err,articles){
      console.log(articles);
      Articles.find({'email':req.user.email,'topic':'anxiety'},function(err,anxiety){
        Articles.find({'email':req.user.email,'topic':'depression'},function(err,depression){
          Articles.find({'email':req.user.email,'topic':'abuse'},function(err,abuse){
            Articles.find({'email':req.user.email,'topic':'family'},function(err,family){
              Articles.find({'email':req.user.email,'topic':'adjustments'},function(err,adjustments){
                if(req.params.name=='anxiety'){
                  res.render('co_my',{counselor:req.user,articles:anxiety,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                }
                if(req.params.name=='depression'){
                  res.render('co_my',{counselor:req.user,articles:depression,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                }
                if(req.params.name=='abuse'){
                  res.render('co_my',{counselor:req.user,articles:abuse,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                }
                if(req.params.name=='family'){
                  res.render('co_my',{counselor:req.user,articles:family,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                }
                if(req.params.name=='adjustments'){
                  res.render('co_my',{counselor:req.user,adjustments:anxiety,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
                }
                if(req.params.name==null){
                  res.render('co_my',{counselor:req.user,articles:articles,anxiety:anxiety.length,depression:depression.length,abuse:abuse.length,family:family.length,adjustments:adjustments.length,all:articles.length});
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
    pic:req.user.img.path,
    topic:req.body.topic,
    title: req.body.title,
    text: req.body.text,
    images: img,
    likes:0
  })
  articlepost.save()
  res.redirect('/co/myarticles');
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
                      {$addToSet:{availabledates:availabledates}},function(){})

}
else{
  if(req.body.type=='group'){
    var sessions={
      dates:dates,
      num_of_days:dates.length,
      limit:req.body.limit,
      topic:req.body.topic,
      bookings:'0'}
    await Counselors.updateOne({email:req.user.email},
                    {$addToSet:{sessions:sessions}},function(){})
  }
}



console.log('redirecting you stupi thing--------------------')

  res.redirect('/co/home')
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
test.push({senderid:req.user.email,sender_type:'counselor',img:a,username:b,typeid:'testimonial',unread:true,msg:'please help me by testifying'})
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

        Counselors.findById(req.user.id, (err, user) =>{

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

                res.redirect('/co/home#edit');
            });
        });
    });

module.exports = router;
