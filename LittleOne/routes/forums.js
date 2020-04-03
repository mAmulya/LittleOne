const express=require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })


const nodemailer = require('nodemailer');

const Users=require('../models/Users');
const Forums=require('../models/Forums');


router.get('/',function(req,res){
  var all = 0 ;
  var pregnancy = 0;
  var baby =0;
  var babynames=0;
  var toddler=0;
  var parenting=0;
  var active=[]
  Forums.find({},function(err,forums){
    all=forums.length
    for(var i=0;i<forums.length;i++){
      if(forums[i].topic=='pregnancy'){
        pregnancy=pregnancy+1
      }
      if(forums[i].topic=='baby'){
        baby=baby+1
      }
      if(forums[i].topic=='toddler'){
        toddler=toddler+1
      }
      if(forums[i].topic=='babynames'){
        babynames=babynames+1
      }
      if(forums[i].topic=='parenting'){
        parenting=parenting+1
      }
    }
    active=forums.slice(Math.max(forums.length - 5, 0))

        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});

  })

});


router.get('/:name',function(req,res){
  console.log('--------------------');

  console.log(req.params.name);
  var all = 0 ;
  var pregnancy = 0;
  var baby =0;
  var babynames=0;
  var toddler=0;
  var parenting=0;
  var active=[]
  Forums.find({},function(err,forums){
    all=forums.length
    for(var i=0;i<forums.length;i++){
      if(forums[i].topic=='pregnancy'){
        pregnancy=pregnancy+1
      }
      if(forums[i].topic=='baby'){
        baby=baby+1
      }
      if(forums[i].topic=='toddler'){
        toddler=toddler+1
      }
      if(forums[i].topic=='babynames'){
        babynames=babynames+1
      }
      if(forums[i].topic=='parenting'){
        parenting=parenting+1
      }
    }
    active=forums.slice(Math.max(forums.length - 5, 0))

    if(req.params.name=='pregnancy'){
      Forums.find({topic:'pregnancy'},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }
    if(req.params.name=='baby'){
      Forums.find({topic:'baby'},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }
    if(req.params.name=='toddler'){
      Forums.find({topic:'toddler'},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }
    if(req.params.name=='babynames'){
      Forums.find({topic:'babynames'},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }
    if(req.params.name=='parenting'){
      Forums.find({topic:'parenting'},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }
    if(req.params.name==null){
      Forums.find({},function(err,forums){
        res.render('forum',{user:req.user,forums:forums,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});
      })
    }

  })


});

router.post('/', urlencodedParser, function(req, res){
  console.log(req.body);



  var question = new Forums({
    name: req.user.name,
    email:req.user.email,
    type: req.user.type,
    img:req.user.img,
    title: req.body.title,
    topic: req.body.topic,
    question: req.body.question,
  })
  question.save()
  res.redirect('/forum');
})

router.post('/ans', urlencodedParser, function(req, res){
  console.log(req.body);
  Forums.findOne({'_id':req.body.forum},function(err,forum){
    forum.answers.push({
      name:req.user.name,
      email:req.user.email,
      type:req.user.type,
      answer:req.body.answer,
      likes:'0',
      img:req.user.img,
      userlikes:new Array(),
      doclikes:new Array(),
      colikes:new Array(),
     })
     forum.save()

     var all = 0 ;
     var pregnancy = 0;
     var baby =0;
     var babynames=0;
     var toddler=0;
     var parenting=0;
     var active=[]
     Forums.find({},function(err,forums){
       all=forums.length
       for(var i=0;i<forums.length;i++){
         if(forums[i].topic=='pregnancy'){
           pregnancy=pregnancy+1
         }
         if(forums[i].topic=='baby'){
           baby=baby+1
         }
         if(forums[i].topic=='toddler'){
           toddler=toddler+1
         }
         if(forums[i].topic=='babynames'){
           babynames=babynames+1
         }
         if(forums[i].topic=='parenting'){
           parenting=parenting+1
         }
       }
       active=forums.slice(Math.max(forums.length - 5, 0))

           res.render('forum_one',{user:req.user,forum:forum,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});

     })
      })
});

router.post('/liked',function(req,res){
  console.log(req.body);
    Forums.findOne({'_id':req.body.forum},function(err,forum){
      for(var k=0;k<forum.answers.length;k++){
        console.log(forum.answers[k].answer);
        if(forum.answers[k]._id==req.body.ans){
          forum.answers[k].likes=Number(forum.answers[k].likes)+1
          if(req.user.type=='user'){
            forum.answers[k].userlikes.push(req.user.email)
          }
          else{
            if(req.user.type=='doctor'){
              forum.answers[k].doclikes.push(req.user.email)
            }
            else{
              if(req.user.type=='counselor'){
                forum.answers[k].colikes.push(req.user.email)
              }
            }
          }
          break
        }
      }
      forum.save()
      var all = 0 ;
      var pregnancy = 0;
      var baby =0;
      var babynames=0;
      var toddler=0;
      var parenting=0;
      var active=[]
      Forums.find({},function(err,forums){
        all=forums.length
        for(var i=0;i<forums.length;i++){
          if(forums[i].topic=='pregnancy'){
            pregnancy=pregnancy+1
          }
          if(forums[i].topic=='baby'){
            baby=baby+1
          }
          if(forums[i].topic=='toddler'){
            toddler=toddler+1
          }
          if(forums[i].topic=='babynames'){
            babynames=babynames+1
          }
          if(forums[i].topic=='parenting'){
            parenting=parenting+1
          }
        }
        active=forums.slice(Math.max(forums.length - 5, 0))

            res.render('forum_one',{user:req.user,forum:forum,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});

      })    })
});


router.get('/one/:id',function(req,res){
    Forums.findOne({'_id':req.params.id},function(err,forum){
      var all = 0 ;
      var pregnancy = 0;
      var baby =0;
      var babynames=0;
      var toddler=0;
      var parenting=0;
      var active=[]
      Forums.find({},function(err,forums){
        all=forums.length
        for(var i=0;i<forums.length;i++){
          if(forums[i].topic=='pregnancy'){
            pregnancy=pregnancy+1
          }
          if(forums[i].topic=='baby'){
            baby=baby+1
          }
          if(forums[i].topic=='toddler'){
            toddler=toddler+1
          }
          if(forums[i].topic=='babynames'){
            babynames=babynames+1
          }
          if(forums[i].topic=='parenting'){
            parenting=parenting+1
          }
        }
        active=forums.slice(Math.max(forums.length - 5, 0))

            res.render('forum_one',{user:req.user,forum:forum,all:all,pregnancy:pregnancy,baby:baby,babynames:babynames,toddler:toddler,parenting:parenting,active:active});

      })    })
});

module.exports = router;
