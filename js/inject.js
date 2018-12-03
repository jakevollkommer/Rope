console.log('Content script loaded.');

var ContentScript = function() {
}

if (window) {
    window.onload = function() {
        var contentScript = new ContentScript();
        contentScript.getFirebaseData();
        contentScript.addListeners();
    }
}

// If on server, allow core to be require-able
if ('undefined' != typeof global) {
    module.exports = ContentScript;
}
