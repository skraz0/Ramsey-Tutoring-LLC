function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
<<<<<<< HEAD
  console.log('Email: ' + profile.getEmail());
};

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
    location.reload();
  });
};
=======
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Logged in as ' + profile.getName());

  $(".data").css("display","block");
  $("#pic").attr('src',profile.getImageUrl());
  $('#signOutButton').css("display","block");
  var auth2 = gapi.auth2.getAuthInstance();
  // auth2.signOut().then(function () {
  //   window.location.href = '/terms';
  // });
  window.location.href = '/terms';
}

  function onFailure(error) {
    console.log(error);
  }

  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      location.reload();
    });
  }
>>>>>>> e5cbca2c175bc48c591e2ad5ac00be2307078ecb
