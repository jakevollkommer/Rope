console.log('Content script loaded.');
var ContentScript = function() {

}

ContentScript.prototype.getFirebaseData = function() {
	var $this = this;
	chrome.runtime.sendMessage({type: 'syncStories'}, (response) => {
		if (!response) { 
			// TODO probably indicate in UI that no one's signed into Rope
			console.log('no one is signed in!');
			return; 
		}
		// TODO indicate that stories are being synced in UI
		$this.saveFirebaseDataLocally(response);
	});
}

window.onload = function() {
	var contentScript = new ContentScript();
	contentScript.getFirebaseData();
}
