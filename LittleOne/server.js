const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var app=express()
const morgan=require("morgan");
const bodyparser=require("body-parser");
const http = require('http');
var multer =require('multer');

const session = require('express-session');
const flash = require('connect-flash');
var passport=require('passport');


//EJS
const server = http.createServer(app);


app.set('view engine','ejs');

const mongoose = require('mongoose');
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

const URI = 'mongodb+srv://amulya:mommy@123@cluster0-tll5r.mongodb.net/MomsCare?retryWrites=true&w=majority';

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + Date.now()+ '.jpeg , .mpeg' )
  }
})
app.use(multer({ storage: storage }).any());

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,

}));
app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use(expressLayouts);


app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



mongoose.connect(URI,{   useNewUrlParser: true,
                        useUnifiedTopology: true
                      })
    .then(()=>console.log('connected to mongodb'))
    .catch(err=>console.log(err))


app.use('/uploads', express.static('./uploads'))
app.use(express.static('./uploads'));


app.use('/styles', express.static('styles'))

app.use('/admin',require('./routes/admin'));
app.use('/',require('./routes/landing'));


app.use('/forum',require('./routes/forums'));

app.use('/doc',require('./routes/doc'));
app.use('/co',require('./routes/co'));
app.use('/user',require('./routes/user'));

app.use('/users',require('./routes/user_signup'));
app.use('/docs',require('./routes/doc_signup'));
app.use('/cos',require('./routes/co_signup'));


app.use('/gynac_booking',require('./routes/gynac_booking'));
app.use('/pedia_booking',require('./routes/pedia_booking'));
app.use('/co_booking',require('./routes/co_booking'));
app.use('/session_booking',require('./routes/session_booking'));

app.use('/blog',require('./routes/blog'));


server.listen(8000, function(){
  console.log("Connected to server")
});
console.log('you are listening to port 8000');
