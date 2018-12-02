/*
 * Chrome Messaging Module
 */

/*
 * Listener for messages from the content script
 */
Background.prototype.initMessageListener = function() {
    var $this = this;
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => { console.log(request);
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

        if (request.type == 'retrieveStories') {
            console.log('Tring to grab stores from FB');
            var user_id = request.content;
            var stories = getUserStoriesFromFirebase(user_id);
            sendResponse(stories);
        }

        if (request.type == 'addUsers') {
            console.log("adding user to story");
            var userEmails = request.userEmails;
            userEmails.push($this.userEmail);
            let storyId = request.storyId;
            $this.addUsersToStory(userEmails, storyId);
            console.log('added user to story');
            sendResponse();
        }

        if (request.type == 'getUsers') {
            let story = request.story;
            let usersRef = $this.database.ref('stories/' + story).child('users')
            usersRef.once('value', function(snapshot) {
                let users = snapshot.val();
                sendResponse(users);
            });
        }

        if (request.type == 'uploadStory') {
            console.log("uploading story")
            let story = request.story;
            let passages = request.passages;
            $this.uploadStory(story, passages, $this.userId);
            console.log('uploaded story to firebase');
            sendResponse();
        }
        sendResponse();
    });


}
