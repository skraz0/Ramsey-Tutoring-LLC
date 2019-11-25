const passport = require('passport');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
const GoogleStrategy = require ('passport-google-oauth20');
const keys = require('./keys.js');
// const User = require('../server.js');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  googleId: String,
  name: String,
  type: String
});

const User = mongoose.model('user', userSchema);

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
