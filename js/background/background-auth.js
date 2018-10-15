Background.prototype.initFirebase = function() {
	firebase.initializeApp(this.config);
	this.database = firebase.database();
	firebase.auth().onAuthStateChanged(this.redirectUserAfterLogin.bind(this));
}

Background.prototype.redirectUserAfterLogin = function(user) {
	var $this = this;
	console.log($this);
	console.log(user);
	if (user) {
		var userId = firebase.auth().currentUser.uid;
		// Get stories, sync when twinery.org is loaded
		chrome.tabs.create({
			url: "http://twinery.org/2/#!/stories"
		}, function() {
			$this.getUserStoriesFromFirebase(userId)
				.then(data => {
					$this.userStories = data;
				})
				.catch(err => { console.log(err); });
		});
	}
}
