
//window.localStorage['twine-stories'] = window.localStorage['twine-stories'] + ',testStory';



console.log('content script loaded');
chrome.runtime.onMessage.addListener(
		function(stories, sender, sendResponse) {
			console.log(stories);
			// Iterate over keys, see what stories are here locally
			// For the stories that are not here, add them, and add the passages
			var storyNames = Object.keys(stories);
			var localStoryNames = window.localStorage['twine-stories'].split(',');
			for (var storyName of storyNames) {
				if (!localStoryNames.includes(storyName)) {
				  window.localStorage['twine-stories-' + storyName] = JSON.stringify(stories[storyName]);
					localStoryNames.push(storyName);
					var passages = stories[storyName];
					window.localStorage['twine-passages'] += ',' + Object.keys(passages).join(',');
					for (var passageId of Object.keys(passages)) {
						if (passages.hasOwnProperty(passageId)) {
							var passage = passages[passageId];
							console.log(passage);
							window.localStorage['twine-passages-' + passageId] = JSON.stringify(passage);
						}
					}
				}
			}
		  window.localStorage['twine-stories'] = localStoryNames.join(',');
			sendResponse();
		});


