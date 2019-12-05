const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const assert = require('assert');
const mongoose = require('mongoose');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys.js');
const Schema = mongoose.Schema;
const cookieSession = require('cookie-session');
const mongodb = require('mongodb');
const GoogleStrategy = require ('passport-google-oauth20');
//const requirejs = require('requirejs');
//const url = process.env.MONGODB_URI || "mongodb://admin:cmps411@ds043338.mlab.com:43338/heroku_whtv069m";
// Use connect method to connect to the Server
mongoose.connect("mongodb://admin:cmps411@ds043338.mlab.com:43338/heroku_whtv069m",{
  useNewUrlParser:true},
    function(error){
      if(error){
        console.log(error);
      }
      else{
        console.log("connected to database");
      }
    });

//cookie stuff
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys:[keys.session.cookieKey]
}));


//initialize passportSetup
app.use(passport.initialize());
app.use(passport.session());

//passportSetup
//const Schema = mongoose.Schema;
const userSchema = new Schema({
  googleId: String,
  name: String,
  type: String
});

const User = mongoose.model('user', userSchema);
module.export= User;
passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser((id, done)=>{
    User.findById(id).then((user)=>{
      done(null, user.id);
    });
});

passport.use(
  new GoogleStrategy({
    callbackURL:'/terms',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) =>{
    //passport callback function
    console.log(profile);
    User.findOne({googleId: profile.id}).then((currentUser)=>{
      if(currentUser){
        console.log(currentUser);
        done(null, currentUser);
      }
      else{
        new User({
          googleId: profile.id,
          name: profile.name.givenName,
          type: "student"
            }).save().then((newUser)=>{
             console.log('new user created'+ newUser);
             done(null, newUser);
        });
      }
    });


  })
)



app.get('/google', passport.authenticate('google',{
  scope:['profile']
}));

app.use(express.static('public'));

//auth check
const authCheck = (req,res,next)=>{
    if(!req.user){
      res.redirect('/');
    } else{
      next();
    }
};

// endpoints for all pages of the site
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/terms', passport.authenticate('google'), authCheck, function (req, res) {
  res.sendFile(__dirname + '/public/ToS.html');
});
app.get('/terms-preview', function (req, res) {
  res.sendFile(__dirname + '/public/ToS_preview.html');
});
app.get('/dashboard', authCheck, function (req, res) {
  res.sendFile(__dirname + '/public/dashboard.html');
});
app.get('/scheduler', authCheck, function (req, res) {
  res.sendFile(__dirname + '/public/scheduler.html');
});
app.get('/session', authCheck, function (req, res) {
  User.findById(req.user).then((user)=>{
    var name=user.name;
    console.log(name);
    res.sendFile(__dirname + '/public/board.html');
  });

});

app.get('/auth/google', passport.authenticate('google', {scope:['profile']}), function(req,res){

});
app.get('/logout', (req,res) =>{
  req.logout();
  res.redirect('/');
  console.log("user signed out");
});

// start of socket.io stuff
function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  // socket.on('clear', clearCanvas) => socket.broadcast('clear', clearCanvas);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

io.on('connection', function(socket){
  console.log(socket.id + ' has connected');
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(socket.id + ': ' + msg);
  });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// server queries
