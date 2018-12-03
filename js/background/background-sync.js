/*
 * Firebase Syncing Module
 */

/*
 * Get a user's stories from Firebase.
 * @param userId the signed-in user's uid
 */
Background.prototype.getUserStoriesFromFirebase = function(userId) {
    var $this = this;
    let stories = [];
    let passages = [];
    return new Promise(function(resolve, reject) {
        // 1. Get ids of user's stories
        $this.database.ref('userStories/' + userId).once('value')
            .then(function(snapshot) {
                const userStoriesIds = snapshot.val();
                if (!userStoriesIds) {
                    return reject('user has no stories');
                }
                const storiesQuery = userStoriesIds.map(id => {
                    return $this.database.ref('stories/' + id).once('value')
                        .then(s => stories.push(s.val()));
                })
                const passagesQuery = userStoriesIds.map(id => {
                    return $this.database.ref('passages').orderByChild('story')
                        .equalTo(id).once('value').then(s => {
                            Object.keys(s.val()).map(key => {
                                passages.push(s.val()[key]);
                            });
                        });
                });
                // 2. Get this user's stories
                Promise.all(storiesQuery)
                    .then(storiesInDB => {
                        // 3. Get the passages of those stories
                        return Promise.all(passagesQuery);
                    })
                    .then(passagesInDB =>{
                        // 4. Return to database
                        resolve({
                            stories: stories,
                            passages: passages
                        });
                    })
                    .catch(err => reject(err))
            });
    });
}

Background.prototype.removeUserFromStory = function(userId, storyId) {
    var $this = this;
    console.log(userId, storyId);
    // TODO Jake: write the code for removing userId from storyId here
    let userRef = $this.database.ref('stories').child(storyId).child('users');
    let userStoriesRef = $this.database.ref('userStories').child(userId);
    userRef.once("value", function(snapshot) {
        let users = snapshot.val();
        let newUsers = [];
        for (var user of users) {
            if (user !== userId) {
                newUsers.push(user);
            }
        }
        console.log(newUsers);
        userRef.set(newUsers);
    });
    userStoriesRef.once("value", function(snapshot) {
        let stories = snapshot.val();
        let newStories = [];
        for (var story of stories) {
            if (story !== storyId) {
                newStories.push(story);
            }
        }
        console.log(newStories);
        userStoriesRef.set(newStories);
    })
};

Background.prototype.getEmailsFromUserIDs = function(userIDs, callback) {
    var $this = this;

    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/emails';
    var params = JSON.stringify({userIDs: userIDs});
    console.log("params: " + params);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-Type', 'application/json');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseText + " are the emails");
            return callback(JSON.parse(http.responseText));
        }
    }
    http.send(params);

}

Background.prototype.addUsersToStory = function(userEmails, storyId) {
    var $this = this;
    console.log('add the user');

    var http = new XMLHttpRequest();
    var url = 'http://localhost:3000/add';
    var params = JSON.stringify({storyId: storyId, emails: userEmails});
    console.log("params: " + params);
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-Type', 'application/json');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            console.log(http.responseText);
        }
    }
    http.send(params);
}

Background.prototype.uploadStory = function(story, passages, uid) {
    var $this = this;

    let ref = $this.database.ref();
    let usersRef = ref.child('stories').child(story['id']).child('users');
    for (key in passages) {
        console.log(key);
        ref.child('passages').child(key).set(passages[key]);
    }

    //story['users'] = [uid];
    usersRef.once("value", function(snapshot) {
        var users = snapshot.val()
        if(!users) {
            story['users'] = [uid];
            ref.child('stories').child(story['id']).set(story);
        } else {
            story['users'] = users;
            ref.child('stories').child(story['id']).set(story);
        }
    })
}

