/*
 * Event Handling Module
 */
Popup.prototype.addEventListeners = function() {
    var loginButton = document.getElementById('login-button');
    var registerButton = document.getElementById('register-button');
    var logoutButton = document.getElementById('logout-button');
    loginButton.addEventListener('click', this.loginUser, false);
    logoutButton.addEventListener('click', this.logoutUser, false);
    registerButton.addEventListener('click', this.registerUser, false);
}
