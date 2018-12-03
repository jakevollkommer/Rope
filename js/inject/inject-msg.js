/*
 * Chrome Messaging Module
 */

ContentScript.prototype.getFirebaseData = function() {
    var $this = this;
    chrome.runtime.sendMessage({type: 'syncStories'}, (response) => {
        if (!response) {
            // TODO probably indicate in UI that no one's signed into Rope
            console.log('No one is signed in.');
            return;
        }
        // TODO indicate that stories are being synced in UI
        $this.saveFirebaseDataLocally(response);
    });
}

ContentScript.prototype.sendMessage = function(requestBody) {
    return new Promise(function(resolve, reject) {
        chrome.runtime.sendMessage(requestBody, function(response) {
            if (!response) {
                console.log('No response');
                return;
            }
            return resolve(response);
        });
    });
}

