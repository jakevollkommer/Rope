var config = {
	apiKey: "AIzaSyDEuPZLh_r7FzRt5PACRuGnRmaXmNacxdk",
	authDomain: "rope-b4dbf.firebaseapp.com",
	databaseURL: "https://rope-b4dbf.firebaseio.com",
	projectId: "rope-b4dbf",
	storageBucket: "rope-b4dbf.appspot.com",
	messagingSenderId: "794052295835"
};
firebase.initializeApp(config);

function initApp() {
	console.log(firebase.auth().currentUser);
	firebase.auth().onAuthStateChanged(function(user) {
		console.log('auth state changed');
		console.log(user);
		if (user) {
			var userId = firebase.auth().currentUser.uid;
			console.log('syncing stories');
			syncStoriesToLocalStorage(userId)
				.then(data => {})
				.catch(err => { console.log(err); });
				
	/*
			chrome.tabs.create({
				url: "http://twinery.org/2/#!/stories"
			}, function() {
				setTimeout(function() {
			});
			*/
		}
	});
}
var database = firebase.database();

/*
 * Get a signed-in user's stories from Firebase and sync them to browser storage.
 * @param userId the signed-in user's uid
 */
function syncStoriesToLocalStorage(userId) {
	return new Promise(function(resolve, reject) {
		// 1. Get ids of user's stories
		database.ref('userStories/' + userId).once('value').then(function(snapshot) {
			const userStoriesIds = snapshot.val();

			let stories = [];
			let passages = [];
			const storiesQuery = userStoriesIds.map(id => {
				return database.ref('stories/' + id).once('value')
					.then(s => stories.push(s.val()));
			})
			const passagesQuery = userStoriesIds.map(id => {
					return database.ref('passages').orderByChild('story')
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
					// 4. Send data to content script to store locally
					const data = {
						stories: stories,
						passages: passages
					}
					chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
						console.log(tabs[0]);
						chrome.tabs.sendMessage(tabs[0].id, data, response => {
							console.log('sync complete');
							chrome.tabs.getSelected(null, function(tab) {
								  var code = 'window.location.reload();';
									  chrome.tabs.executeScript(tab.id, {code: code});
							});
							return resolve();
						})
					});
				})
				.catch(err => reject(err))
		});
	});
}
window.onload = function() {
	initApp();
}
