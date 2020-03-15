const mongoose =require('mongoose');
const bcrypt = require('bcryptjs')
const CustomStrategy = require('passport-custom').Strategy;
const User=require('../models/Users')
const Doctors=require('../models/Doctors')
const Counselors=require('../models/Counselors')
const Admin=require('../models/Admins')

const GoogleStrategy = require('passport-google-oauth20')


module.exports=function(passport){
  passport.use('local1',
    new CustomStrategy(function(req,done){
      User.findOne({email:req.body.email})
      .then(user => {
        if(!user){

          return done(null,false,req.flash('error', 'Username does not exist'));
        }
        bcrypt.compare(req.body.password,user.password,function(err,isMatch){
          if(err) throw err;

          if(isMatch){
            return done(null,user)
          }else{
            console.log('jhjhg');

            return done(null,false,req.flash('error', 'Incorrect password'));
          }
        });
      }
      )
      .catch(err => console.log(err));

    })
  );

  passport.use('local2',
    new CustomStrategy(function(req,done){
      Doctors.findOne({email:req.body.email})
      .then(user => {

        if(!user){
          return done(null,false,req.flash('error', 'Email does not exist'));
        }
        bcrypt.compare(req.body.password,user.password,function(err,isMatch){
          if(err) throw err;

          if(isMatch && user.is_verified==1){
            return done(null,user)
          }else{
            if(user.is_verified==-1){
              return done(null,false,req.flash('error', 'You are rejected by Admin'));
            }
            if(user.is_verified==0){
              return done(null,false,req.flash('error', 'Yet to be verified'));
            }
            return done(null,false,req.flash('error', 'Incorrect password'));
          }
        });
      }
      )
      .catch(err => console.log(err));

    })
  );


  passport.use('local3',
    new CustomStrategy(function(req,done){
      console.log(req.body);
      Admin.findOne({username:req.body.username})
      .then(user => {
        console.log('---------------------');
        console.log(user);
        if(!user){

          return done(null,false,req.flash('error', 'Username does not exist'));
        }

            bcrypt.compare(req.body.password,user.password,function(err,isMatch){
              if(err) throw err;

              if(isMatch){
                return done(null,user)
              }else{
                return done(null,false,req.flash('error', 'Incorrect password'));
              }
            });
      }
      )
      .catch(err => console.log(err));

    })
  );

  passport.use('local4',
    new CustomStrategy(function(req,done){
      Counselors.findOne({email:req.body.email})
      .then(user => {

        if(!user){
          return done(null,false,req.flash('error', 'Email does not exist'));
        }
        bcrypt.compare(req.body.password,user.password,function(err,isMatch){
          if(err) throw err;

          if(isMatch && user.is_verified==1){
            return done(null,user)
          }else{
            if(user.is_verified==-1){
              return done(null,false,req.flash('error', 'You are rejected by Admin'));
            }
            if(user.is_verified==0){
              return done(null,false,req.flash('error', 'Yet to be verified'));
            }
            return done(null,false,req.flash('error', 'Incorrect password'));
          }
        });
      }
      )
      .catch(err => console.log(err));

    })
  );



  passport.use(
  new GoogleStrategy({
    callbackURL:'/users/google/redirect',
    clientID:'496230600214-bumlrgtb5mrkjpdq3l2hh2ijjfo5lo66.apps.googleusercontent.com',
    clientSecret:'8E1ajfUUnlB4FoeYVBmjsWNM'

  },(accessToken,refreshToken,profile,email,done)=>{
    console.log('-------passport');

    console.log(email);

    console.log(email.emails[0].value);
    User.findOne({email:email.emails[0].value}).then((user)=>{
      if(user==null){
        new User({
          email:email.emails[0].value,
          name:email._json.given_name,
          type:'user',
          method:'google',
          img:email._json.picture
        }).save().then(new_user=>
        {
          console.log('new user created');
          done(null,new_user)
        })
      }else{
        if(user.method='google'){
            done(null,user)
          }else{
            console.log('already account linked');
            done(null,false,req.flash('error', 'You registered with gmail'))
      }
    }
    })
  })
)

  passport.serializeUser(function(user, done) {

    done(null, user.id +','+ user.type);
  });

  passport.deserializeUser(function(id, done) {
    type=id.split(',')[1]
    id1=id.split(',')[0]
    if (type=='user') {
      User.findById(id1, function(err, user) {
        done(err, user);
      });

    }else {
      if(type=='admin'){
        Admin.findById(id1, function(err, user) {
          done(err, user);
        });
      }
      else{
        if(type=='doctor'){
          Doctors.findById(id1, function(err, user) {
            done(err, user);
          });
        }
        else{
          Counselors.findById(id1, function(err, user) {
            done(err, user);
          });
        }

      }


    }
  });
  };
