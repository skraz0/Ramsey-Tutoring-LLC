function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Logged in as ' + profile.getName());

  $(".data").css("display","block");
  $("#pic").attr('src',profile.getImageUrl());
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    window.location.href = 'https://ramsey-tutoring-llc.herokuapp.com/terms';
  });
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
