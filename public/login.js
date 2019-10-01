function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());

  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'localhost:3000');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
    console.log('Signed in as: ' + xhr.responseText);
  };
  xhr.send('idtoken=' + id_token);
  xhr.send('profilePicture=' + profile.getImageUrl());
}
