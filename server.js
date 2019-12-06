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
  User.findById(req.user).then((user)=>{
    var type=user.type;
    if(type=="student"){
      res.sendFile(__dirname + '/public/ToS.html');
    }else if(type=="teacher"){
      res.sendFile(__dirname + '/public/dashboard_a.html');
    }
  });
});
app.get('/terms-preview', function (req, res) {
  res.sendFile(__dirname + '/public/ToS_preview.html');
});
app.get('/dashboard', authCheck, function (req, res) {
  User.findById(req.user).then((user)=>{
    var type=user.type;
    if(type=="student"){
      res.sendFile(__dirname + '/public/dashboard.html');
    }else if(type=="teacher"){
      res.sendFile(__dirname + '/public/dashboard_a.html');
    }else{
      function wrongLogin(){
        alert("You are not logged in redirecting to homepage");
      }
      req.logout();
      res.redirect('/');
    }

  });
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

//google calendar api

// const fs = require('fs');
// const readline = require('readline');
// const {google} = require('googleapis');
//
// // If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
// const TOKEN_PATH = 'token.json';
//
// // Load client secrets from a local file.
// fs.readFile('credentials.json', (err, content) => {
//   if (err) return console.log('Error loading client secret file:', err);
//   // Authorize a client with credentials, then call the Google Calendar API.
//   authorize(JSON.parse(content), listEvents);
// });
//
// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   const {client_secret, client_id, redirect_uris} = credentials.installed;
//   const oAuth2Client = new google.auth.OAuth2(
//       client_id, client_secret, redirect_uris[0]);
//
//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, (err, token) => {
//     if (err) return getAccessToken(oAuth2Client, callback);
//     oAuth2Client.setCredentials(JSON.parse(token));
//     callback(oAuth2Client);
//   });
// }
//
// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url:', authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }
//
// /**
//  * Lists the next 10 events on the user's primary calendar.
//  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
//  */
// function listEvents(auth) {
//   const calendar = google.calendar({version: 'v3', auth});
//   calendar.events.list({
//     calendarId: 'primary',
//     timeMin: (new Date()).toISOString(),
//     maxResults: 10,
//     singleEvents: true,
//     orderBy: 'startTime',
//   }, (err, res) => {
//     if (err) return console.log('The API returned an error: ' + err);
//     const events = res.data.items;
//     if (events.length) {
//       console.log('Upcoming 10 events:');
//       events.map((event, i) => {
//         const start = event.start.dateTime || event.start.date;
//         console.log(`${start} - ${event.summary}`);
//       });
//     } else {
//       console.log('No upcoming events found.');
//     }
//   });
// }
