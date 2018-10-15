Popup.prototype.initFirebase = function() {
	var $this = this;
	firebase.initializeApp(this.config);
	firebase.auth().onAuthStateChanged(function(user) {
		$this.displayCurrentUser(user);
	});
}
