Popup.prototype.addEventListeners = function() {
	var loginButton = document.getElementById('login-button');
	var registerButton = document.getElementById('register-button');
	var logoutButton = document.getElementById('logout-button');
	loginButton.addEventListener('click', this.loginButtonListener, false);
	logoutButton.addEventListener('click', this.logoutButtonListener, false);
	registerButton.addEventListener('click', this.registerButtonListener, false);
}

Popup.prototype.loginButtonListener = function() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;

		alert(errorMessage);
	});
}

Popup.prototype.logoutButtonListener = function() {
	firebase.auth().signOut().then(function(user) {
		console.log("logged out");
	}).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(errorMessage);
	});
}

Popup.prototype.registerButtonListener = function() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	firebase.auth().sendSignInLinkToEmail(email, this.actionCodeSettings)
		.then(function() {
			// The link was successfully sent. Inform the user.
			// Save the email locally so you don't need to ask the user for it again
			// if they open the link on the same device.
			window.localStorage.setItem('emailForSignIn', email);
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(function() {
					document.getElementById("register-button").disabled = true;
					document.getElementById("register-done").style.display = "block";

					alert("A link was sent to your email for verification.")
				}).catch(function(error) {
					// Handle Errors here.
					var errorCode = error.code;
					var errorMessage = error.message;
					alert(error.message);
				});
		})
		.catch(function(error) {
			// Some error occurred, you can inspect the code: error.code
			alert(error.message);
		});
}
