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
            return;
        }
        /*
         * Handle requests to sync stories
         */
        if (request.type == 'syncStories') {
            console.log('Sync stories request');
            $this.getUserStoriesFromFirebase($this.userId)
                .then(data => {
                    $this.userStories = data;
                    sendResponse($this.userStories);
                })
                .catch(err => { console.log(err); });
            return true;
        }

        if (request.type == 'retrieveStories') {
            console.log('Tring to grab stores from FB');
            var user_id = request.content;
            var stories = getUserStoriesFromFirebase(user_id);
            sendResponse(stories);
            return;
        }

        if (request.type == 'addUsers') {
            console.log("adding user to story");
            var userEmails = request.userEmails;
            userEmails.unshift($this.userEmail);
            let storyId = request.storyId;
            $this.addUsersToStory(userEmails, storyId);
            console.log('added user to story');
            sendResponse();
            return;
        }

        if (request.type == 'getUsers') {
            let story = request.story;

            // Get IDs of users with access to this story.
            let usersRef = $this.database.ref('stories/' + story).child('users')
            usersRef.once('value', function(snapshot) {
                let userIDs = snapshot.val();
                // Get emails of the users with access to this story.
                $this.getEmailsFromUserIDs(userIDs, function(emails) {
                    sendResponse(emails);
                });
            });
            return true;
        }

        if (request.type == 'removeUser') {
            $this.removeUserFromStory(request.userId, request.storyId);
            sendResponse();
            return;
        }

        if (request.type == 'uploadStory') {
            console.log("uploading story")
            console.log(request);
            let story = request.story;
            let passages = request.passages;
            $this.uploadStory(story, passages, $this.userId);
            console.log('uploaded story to firebase');
            sendResponse();
            return;
        }
    });


}
