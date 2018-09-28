
//window.localStorage['twine-stories'] = window.localStorage['twine-stories'] + ',testStory';



console.log('content script loaded');
chrome.runtime.onMessage.addListener(
		function(request, sender, sendResponse) {
			var allPassages = request.allPassages;
			var allStories = request.allStories;
			console.log(request);
			// Iterate over keys, see what stories are here locally
			// For the stories that are not here, add them, and add the passages
			var storyNames = Object.keys(allStories);
			var localStoryNames = window.localStorage['twine-stories'].split(',');
			for (var storyName of storyNames) {
				if (!localStoryNames.includes(storyName)) {
				  window.localStorage['twine-stories-' + storyName] = JSON.stringify(allStories[storyName]);
					localStoryNames.push(storyName);
					var passages = allPassages[storyName];
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


