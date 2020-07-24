const express = require('express');
const expressLayouts = require('express-ejs-layouts');
var app=express()
const morgan=require("morgan");
const bodyparser=require("body-parser");
const http = require('http');
var multer =require('multer');
const socketio = require('socket.io');

const session = require('express-session');
const flash = require('connect-flash');
var passport=require('passport');
let Chatdata = require('./models/Bookings');


//EJS
const server = http.createServer(app);
const io = socketio(server);
io.origins('*:*');

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
    cb(null, file.originalname + Date.now()+ '.jpeg' )
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
  next()
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


 var count=0;

 app.get('/chat/:id', function(req, res){
   var id = req.params.id;
   var uname = req.user.name
   var username, guidename
   count=count+1;

   Chatdata.find({_id:id, }, function(err, data){
     if(err){
       console.log(err);
     } else {
       console.log(data[0])
       username = data[0].user_name
       guidename = data[0].doc_name
       res.render('chat', {data:data[0], usertype:uname, user:data[0].user_name, doctor:data[0].doc_name, user2:req.user});
     }
   });
console.log('heyy')
   io.on('connection', function(socket){
     //console.log(count);

 if(count==1){

         console.log(count);

             sendStatus = function(s){
               io.emit('status', s);
             }
             socket.on('join', function(room){
                 socket.join(room);
                 console.log(room);
                   // socket.broadcast.to(username+'-'+guidename).emit('output', res);
             });

             // socket.on('sendlocation', (coords)=>{
             //   var type = coords.type;
             //   var time = coords.time;
             //   var msg = 'https://www.google.com/maps/place/'+coords.lat+','+coords.lng;
             //   Chatdata.updateOne(
             //     { username: username, guidename:guidename},
             //     { $push: {messages: {text: msg, time: time, sentby: type}} },
             //     function(){
             //       io.to(username+'-'+guidename).emit('output', { username: username, guidename:guidename, messages: [{text: msg, sentby: type, time: time}]});
             //       sendStatus({
             //         message: 'Message sent',
             //         clear: true
             //       });
             //     }
             //   );
             // });

             socket.on('input', function(data){

               let type = data.type;
               let msg = data.msg;
               let time = data.time;
               console.log(type);
               console.log(msg);
               console.log(time);

               if (msg == ''){
                 sendStatus("Please enter a message.");
               } else {



                 Chatdata.updateOne(
                   {_id:id},
                   { $push: {messages: {text: msg, time: time, sentby: type}} },
                   function(){
                     io.to(username+'-'+guidename).emit('output', { username: username, guidename:guidename, messages: [{text: msg, sentby: type, time: time}]});
                     console.log(username+'-'+guidename);
                     sendStatus({
                       message: 'Message sent',
                       clear: true
                     });
                   }
                 );
               }
             });

             socket.on('dis', function(users){
               console.log('socket');
               console.log(users);
               username = users.uname;
               guidename = users.gname;
               socket.disconnect();
             });
             count=0
 }


   });

 });


server.listen(8000, function(){
  console.log("Connected to server")
});
console.log('you are listening to port 8000');
