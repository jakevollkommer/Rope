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

Background.prototype.addUsersToStory = function(userEmails, storyId) {
    var $this = this;
    console.log(storyId)
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

Background.prototype.uploadStory = function(story, passages) {
    var $this = this;

    let ref = $this.database.ref();
    for (key in passages) {
        console.log(key);
        ref.child('passages').child(key).set(passages[key]);
    }

    ref.child('stories').child(story['id']).set(story);
}

