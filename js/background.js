/*
 * The background script is the extension's event handler;
 * it contains listeners for browser events that are important to the extension.
 */
var Background = function() {
    this.userStories = {};
    this.config = {
        apiKey: "AIzaSyDEuPZLh_r7FzRt5PACRuGnRmaXmNacxdk",
        authDomain: "rope-b4dbf.firebaseapp.com",
        databaseURL: "https://rope-b4dbf.firebaseio.com",
        projectId: "rope-b4dbf",
        storageBucket: "rope-b4dbf.appspot.com",
        messagingSenderId: "794052295835"
    };
    this.database;
    this.userEmail;
    this.userId;
}

window.onload = function() {
    var background = new Background();
    background.initFirebase();
    background.initMessageListener();
    console.log('init background');
}
