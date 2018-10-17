console.log('Content script loaded.');

var ContentScript = function() {
}

window.onload = function() {
	var contentScript = new ContentScript();
	contentScript.getFirebaseData();
	contentScript.addListeners(); 

	
}
