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
var logoutButton = document.getElementById('logout-button');

var database = firebase.database();

/*
 * Get a signed-in user's stories from Firebase and sync them to browser storage.
 * @param userId the signed-in user's uid
 */
function syncStoriesToLocalStorage(userId) {
	return new Promise(function(resolve, reject) {
		// 1. Get ids of user's stories
		database.ref('userStories/' + userId).once('value').then(function(snapshot) {
			const userStoriesIds = snapshot.val();

			let stories = [];
			let passages = [];
			const storiesQuery = userStoriesIds.map(id => {
				return database.ref('stories/' + id).once('value')
					.then(s => stories.push(s.val()));
			})
			const passagesQuery = userStoriesIds.map(id => {
					return database.ref('passages').orderByChild('story')
						.equalTo(id).once('value').then(s => {
							let somePassages = s.val();
							Object.keys(somePassages).map(key => {
								passages.push(somePassages[key]);
							});
						});
			});
			// 2. Get this user's stories 
			Promise.all(storiesQuery)
				.then(storiesInDB => {
					// 3. Get the passages of those stories
					return Promise.all(passagesQuery);
				})
				.then(passagesInDB =>{
					// 4. Send data to content script to store locally
					const data = {
						stories: stories,
						passages: passages
					}
					chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
						chrome.tabs.sendMessage(tabs[0].id, data, response => console.log(response.farewell));
					});
				})
				.catch(err => console.log(err))
		});
	});
}

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		document.getElementById("LoginPage").style.display='none';
		document.getElementById("HomePage").style.display='block';
		var userId = firebase.auth().currentUser.uid;
		syncStoriesToLocalStorage(userId).then(function() {
			console.log('ok !');
		});
	} else {
		// User is signed out.
		// ...
		document.getElementById("LoginPage").style.display='block';
		document.getElementById("HomePage").style.display='none';
	}
});

// Project gets synced to firebase WHEN shared with other emails
// If Rope installed: get shared projects, put them in the cookies

// Get stories shared with me, store locally

loginButton.addEventListener('click', function() {
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;

	firebase.auth().signInWithEmailAndPassword(email, password).then(function(user) {
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


logoutButton.addEventListener('click', function() {
	firebase.auth().signOut().then(function(user) {
		console.log("logged out");

		chrome.tabs.update({
			url: "http://google.com"
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
		// Save the email locally so you don't need to ask the user for it again
		// if they open the link on the same device.
		window.localStorage.setItem('emailForSignIn', email);
		firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
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
}, false);
var actionCodeSettings = {
	// URL you want to redirect back to. The domain (www.example.com) for this
	// URL must be whitelisted in the Firebase Console.
	url: 'http://www.twinery.org/2',
	// This must be true.
	handleCodeInApp: true,
};
