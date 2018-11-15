/*
 * Modify DOM depending on if a user is signed in or not.
 */
Popup.prototype.displayCurrentUser = function(user) {
    if (user) {
        document.getElementById('current-user-display').innerHTML = 'Logged in as <b>' + user.email + '</b>';
        document.getElementById("LoginPage").style.display='none';
        document.getElementById("HomePage").style.display='block';
    } else {
        // User is signed out.
        // ...
        document.getElementById("LoginPage").style.display='block';
        document.getElementById("HomePage").style.display='none';
    }
}
