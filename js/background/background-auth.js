/*
 * Authorization Module
 */

Background.prototype.initFirebase = function() {
    firebase.initializeApp(this.config);
    this.database = firebase.database();

    // Listener for when a user logs in
    firebase.auth().onAuthStateChanged(this.redirectUserAfterLogin.bind(this));
}

Background.prototype.redirectUserAfterLogin = function(user) {
    var $this = this;
    if (user) {
        var user = firebase.auth().currentUser;
        $this.userEmail = user.email;
        $this.userId = user.uid;

        chrome.tabs.create({
            url: "http://twinery.org/2/#!/stories"
        }, () => {
            // Cache the latest copy of this user's stories
            $this.getUserStoriesFromFirebase(uid)
                .then(data => {
                    $this.userStories = data;
                })
                .catch(err => { console.log(err); });
        });
    }
}
