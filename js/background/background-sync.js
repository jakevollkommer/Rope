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
