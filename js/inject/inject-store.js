/*
 * Local Storage module
 */
ContentScript.prototype.saveFirebaseDataLocally = function(request) {
	console.log(request);
	this.saveStoriesLocally(request.stories);
	this.savePassagesLocally(request.passages);
}

/* 
 * Copy Twine stories to local storage
 * @param stories an array of twine stories
 */
ContentScript.prototype.saveStoriesLocally = function(stories) {
	// Set twine-stories and twine-story-*
	const storyIds = stories.map(story => story.id);
	if (!window.localStorage['twine-stories']) {
		window.localStorage['twine-stories'] = '';
	}
	const localStoryIds = window.localStorage['twine-stories'].split(',');
	storyIds.map(id => {
		if (!localStoryIds.includes(id)) {
			if (window.localStorage['twine-stories'].length == 0) {
				window.localStorage['twine-stories'] += id;
			} else {
				window.localStorage['twine-stories'] += ',' + id;
			}
		}
	});
	stories.map(story => {
		window.localStorage['twine-stories-' + story.id] = JSON.stringify(story);
	});
}

/* 
 * Copy Twine stories to local storage
 * @param passages an array of passages of twine storiese
 */
ContentScript.prototype.savePassagesLocally = function(passages) {
	// Set twine-passages and twine-passage-*
	const passageIds  = passages.map(passage => passage.id);
	if (!window.localStorage['twine-passages']) {
		window.localStorage['twine-passages'] = '';
	}
	const localPassageIds = window.localStorage['twine-passages'].split(',');
	passageIds.map(id => {
		if (!localPassageIds.includes(id)) {
			if (window.localStorage['twine-passages'].length == 0) {
				window.localStorage['twine-passages'] += id;
			} else {
				window.localStorage['twine-passages'] += ',' + id;
			}
		}
	});
	passages.map(passage => {
		window.localStorage['twine-passages-' + passage.id] = JSON.stringify(passage);
	});
}

