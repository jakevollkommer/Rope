
//window.localStorage['twine-stories'] = window.localStorage['twine-stories'] + ',testStory';



console.log('content script loaded');
chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			console.log(request);
			// Set twine-stories, twine-passages, twine-story-*, and twine-passage-*
			const stories = request.stories;
			const storyIds = stories.map(story => story.id);
			const passages = request.passages;
			const passageIds  = passages.map(passage => passage.id);
			// Filter stories that are already stored locally.
			if (!window.localStorage['twine-stories']) {
				window.localStorage['twine-stories'] = '';
			}
			if (!window.localStorage['twine-passages']) {
				window.localStorage['twine-passages'] = '';
			}
			const localStoryIds = window.localStorage['twine-stories'].split(',');
			const localPassageIds = window.localStorage['twine-passages'].split(',');
			storyIds.map(id => {
				if (!localStoryIds.includes(id)) {
					if (window.localStorage['twine-stories'].length == 0) {
						window.localStorage['twine-stories'] += id;
					} else {
						window.localStorage['twine-stories'] += ',' + id;
					}
				}
			});
			passageIds.map(id => {
				if (!localPassageIds.includes(id)) {
					if (window.localStorage['twine-passages'].length == 0) {
						window.localStorage['twine-passages'] += id;
					} else {
						window.localStorage['twine-passages'] += ',' + id;
					}
				}
			});

			stories.map(story => {
				window.localStorage['twine-stories-' + story.id] = JSON.stringify(story);
			});
			passages.map(passage => {
				window.localStorage['twine-passages-' + passage.id] = JSON.stringify(passage);
			});
			sendResponse();
		});


