/*
 * Chrome Messaging Module
 */

/*
 * Listener for messages from the content script
 */
Background.prototype.initMessageListener = function() {
	var $this = this;
	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (!firebase.auth().currentUser) {
			console.log('No one is currently logged in');
			sendResponse(null);
		}
		/*
		 * Handle requests to sync stories
		 */
		if (request.type == 'syncStories') {
			console.log('Sync stories request');
			sendResponse($this.userStories);
		}
	});
}
