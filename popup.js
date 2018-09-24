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
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log(user);
        // ...
    } else {
        // User is signed out.
        // ...
    }
});

loginButton.addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        document.getElementById("login-button").disabled = true;
        document.getElementById("login-done").style.display = "block";

        chrome.tabs.update({
            url: "http://twinery.org/2/#!/stories"
        });
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        alert(errorMessage);
    });

}, false);

registerButton.addEventListener('click', function() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
    .then(function() {
        // The link was successfully sent. Inform the user.
        alert("A link was sent to your email for verification.")
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem('emailForSignIn', email);
        firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;

            alert(errorMessage);
        });
    })
    .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
        alert(error.message)
    });
    document.getElementById("login-button").disabled = true;
    document.getElementById("login-done").style.display = "block";

}, false);
var actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be whitelisted in the Firebase Console.
    url: 'https://www.twinery.org/2/#!/stories',
    // This must be true.
    handleCodeInApp: true,
};
