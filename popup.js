  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDEuPZLh_r7FzRt5PACRuGnRmaXmNacxdk",
    authDomain: "rope-b4dbf.firebaseapp.com",
    databaseURL: "https://rope-b4dbf.firebaseio.com",
    projectId: "rope-b4dbf",
    storageBucket: "rope-b4dbf.appspot.com",
    messagingSenderId: "794052295835"
  };
  firebase.initializeApp(config);


var loginButton = document.getElementById('login-button');
var registerButton = document.getElementById('register-button');


loginButton.addEventListener('click', function() {
}, false);

registerButton.addEventListener('click', function() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;

	  console.log(errorCode);
	  console.log(errorMessage);
	  // ...
	});
}, false);
