var Popup = function() {
	this.config = {
		apiKey: "AIzaSyDEuPZLh_r7FzRt5PACRuGnRmaXmNacxdk",
		authDomain: "rope-b4dbf.firebaseapp.com",
		databaseURL: "https://rope-b4dbf.firebaseio.com",
		projectId: "rope-b4dbf",
		storageBucket: "rope-b4dbf.appspot.com",
		messagingSenderId: "794052295835"
	};
  this.actionCodeSettings = {
		// URL you want to redirect back to. The domain (www.example.com) for this
		// URL must be whitelisted in the Firebase Console.
		url: 'http://www.twinery.org/2',
		// This must be true.
		handleCodeInApp: true,
	};
}

window.onload = function() {
	var popup = new Popup();
	popup.initFirebase();
	popup.addEventListeners();
};
