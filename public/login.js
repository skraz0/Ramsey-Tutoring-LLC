// const User = require('./server.js');

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getGivenName());
  console.log('Email: ' + profile.getEmail());
  // User.findOne({googleId: profile.getId()}).then((currentUser) =>{
  //   if(currentUser){
  //       console.log('user is: ', currentUser);
  //   }
  //   else{
  //     new User({
  //       googleId: profile.getId(),
  //       name: profile.getGivenName(),
  //       email: profile.getEmail(),
  //       type: student,
  //     }).save().then((newUser)=>{
  //       console.log('new user created'+ newUser);
  //     });
  //   }
  // });

};

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    location.reload();
  });
};
