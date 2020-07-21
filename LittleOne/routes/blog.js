const express=require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false,limit:'50mb' })
const fs = require('fs');


const Blogs=require('../models/Blog')

ObjectId = require('mongodb').ObjectId;




var events = require('events');
var eventEmitter = new events.EventEmitter();


var count=0
var posts=0
var max_liked_blog
var show_posts

var user,type;


Blogs.find().sort({likes:-1}).limit(2)
  .catch(err=>{console.log(err)})
  .then( h_data=>{
      max_liked_blog=h_data
  })

  // function CheckUser(req, res, next) {
  //     if (req.isAuthenticated()){
  //       if(req.user.usertype == 'user'){
  //         return next();
  //       }
  //       else {
  //         return res.sendStatus(404)
  //       }
  //     }
  //     res.redirect('/users/login');
  // }
  //
  // function IsAuth(req,res,next){
  //   if(req.isAuthenticated())
  //     return next()
  //   return res.send(404)
  // }
  //
  // function CheckGuide(req, res, next) {
  //     if (req.isAuthenticated()){
  //       if(req.user.usertype == 'guide'){
  //         return next();
  //       }
  //       else {
  //         return res.sendStatus(404)
  //       }
  //     }
  //     res.redirect('/guides/login');
  // }
  //


var i=0
router.get('/',function(req,res){
  var useremail=req.user.email //req.user.username
  var type=req.user.type
  var username = req.user.name

  console.log(req.query.pg);

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

   Blogs.find({}).sort({_id:-1}).limit(9).skip(i*9)
   .catch(err=>{console.log(err)})
   .then( data=>{
      count=0
      posts=0

      Blogs.find({$and:[{email:useremail},{type:type},{name:username}]}, function(err,p_data){
       if(err){
         console.log(err);
       }else{
         p_data.forEach(function(item,index){
           if(item.email==useremail && item.type==type && item.name==username){
             count=count+parseInt(item.likes)
             posts=posts+1
           }
         })
          }
          console.log(data.length);
          Blogs.find().sort({likes:-1}).limit(2)
            .catch(err=>{console.log(err)})
            .then( h_data=>{
                max_liked_blog=h_data
                res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'blog',i:i});
            })

    })
  })
});


var i=0
router.get('/myposts',function(req,res){
  // var user=req.user.name //req.user.username
  // var type=req.user.type

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

   Blogs.find({$and:[{eamil:req.user.email},{name:req.user.name},{type:req.user.type}]}).limit(9).skip(i*9)
   .catch(err=>{console.log(err)})
   .then( data=>{
          count=0
          posts=0
          Blogs.find({$and:[{name:req.user.name},{type:req.user.type},{email:req.user.email}]}, function(err,p_data){
           if(err){
             console.log(err);
           }else{
             p_data.forEach(function(item,index){
               if(item.name==user && item.type==type && item.email==email){
                 count=count+parseInt(item.likes)
                 posts=posts+1
               }
             })
              }

              Blogs.find().sort({likes:-1}).limit(2)
                .catch(err=>{console.log(err)})
                .then( h_data=>{
                    max_liked_blog=h_data
                    res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'myposts',i:i});
                })

        })

  })
});


router.get('/:id',function(req,res){

  Blogs.find({'_id':req.params.id})
  .catch(err=>{console.log(err)})
  .then( user_data=>{

      var liked=false

      if( user_data[0].userlikes.includes(req.user.email)){
        liked=true
      }
      else{
        if( user_data[0].doclikes.includes(req.user.email)){
          liked=true
        }
        else{
          if( user_data[0].colikes.includes(req.user.email)){
            liked=true
          }
          else{
            liked=false
          }
        }
      }

      console.log(liked);

      count=0
      posts=0
      Blogs.find({name:user_data[0].name,type:user_data[0].type,email:user_data[0].email}, function(err,p_data){
       if(err){
         console.log(err);
       }else{
         p_data.forEach(function(item,index){
           if(item.name==user_data[0].name && item.type==user_data[0].type && item.email==user_data[0].email){
             count=count+parseInt(item.likes)
             posts=posts+1
           }
         })
          }
          Blogs.find().sort({likes:-1}).limit(2)
            .catch(err=>{console.log(err)})
            .then( h_data=>{
                max_liked_blog=h_data
                res.render('post',{user:req.user,likes:count,posts:posts,blog:user_data,first:max_liked_blog[0],second:max_liked_blog[1],liked:liked})
            })

    })

  })

});

router.post('/:id', urlencodedParser, function(req, res){

  console.log(req.body);


  var id=req.body.id
  Blogs.findOne({'_id':id})
  .catch(err=>{console.log(err)})
  .then( data=>{
      var likes=parseInt(data.likes)+1
      data.likes=likes.toString()

        if(req.body.type=='user'){
          data.userlikes.push(req.body.email)
        }
        if(req.body.type=='doctor'){
          data.doclikes.push(req.body.email)

        }
        if(req.body.type=='counselor'){
          data.colikes.push(req.body.email)

        }
      var newvalues = { $set: data };
      Blogs.updateOne({'_id':id}, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
      });



      Blogs.find({'_id':req.params.id})
      .catch(err=>{console.log(err)})
      .then( user_data=>{
          var liked=false


          if( user_data[0].userlikes.includes(req.user.email)){
            liked=true
          }
          else{
            if( user_data[0].doclikes.includes(req.user.email)){
              liked=true
            }
            else{
              if( user_data[0].colikes.includes(req.user.email)){
                liked=true
              }
              else{
                liked=false
              }
            }
          }

          console.log(liked);
          count=0
          posts=0
          Blogs.find({name:user_data[0].name,type:user_data[0].type,email:user_data[0].email}, function(err,p_data){
           if(err){
             console.log(err);
           }else{
             p_data.forEach(function(item,index){
               if(item.name==user_data[0].name && item.type==user_data[0].type && item.email==user_data[0].email){
                 count=count+parseInt(item.likes)
                 posts=posts+1
               }
             })
              }

              Blogs.find().sort({likes:-1}).limit(2)
                .catch(err=>{console.log(err)})
                .then( h_data=>{
                    max_liked_blog=h_data
                    res.render('post',{user:req.user,likes:count,posts:posts,blog:user_data,first:max_liked_blog[0],second:max_liked_blog[1],liked:liked})
                })

        })

      })
  })
})


var i=0
router.get('/:id/all',function(req,res){

  if(req.query.pg){
    i=i+1
  }
  else{
    i=0
  }

  Blogs.find({'_id':req.params.id})
  .catch(err=>{console.log(err)})
  .then( user_data=>{

    Blogs.find({$and:[{name:user_data[0].name},{type:user_data[0].type},{email:user_data[0].email}]}).limit(9).skip(i*9)
    .catch(err=>{console.log(err)})
    .then( data=>{

           count=0
           posts=0
           Blogs.find({$and:[{name:user_data[0].name},{type:user_data[0].type},{email:user_data[0].email}]}, function(err,p_data){
            if(err){
              console.log(err);
            }else{
              p_data.forEach(function(item,index){
                if(item.name==user_data[0].name && item.type==user_data[0].type && item.email==user_data[0].email){
                  count=count+parseInt(item.likes)
                  posts=posts+1
                }
              })
               }

               Blogs.find().sort({likes:-1}).limit(2)
                 .catch(err=>{console.log(err)})
                 .then( h_data=>{
                     max_liked_blog=h_data
                     res.render('blog',{user:req.user,likes:count,posts:posts,blog:data,first:max_liked_blog[0],second:max_liked_blog[1],url:'posts',i:i,id:req.params.id});
                 })

         })

   })
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

  var blogpost = new Blogs({
    name: req.user.name,
    email: req.user.email,
    type: req.user.type,
    heading: req.body.title,
    text: req.body.text,
    images: img,
    likes:0
  })
  blogpost.save()
  res.redirect('/blog');
})



module.exports = router;
