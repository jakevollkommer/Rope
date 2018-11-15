describe("A test suite for inject.js", function() {

	global.window = {};

	var ContentScript = require('../../build/inject.js')
	var contentScript;

	beforeEach(function() {

		contentScript = new ContentScript();

	})

	it("should return the correct story object and correct passages", function() {
		global.window.localStorage = {
			"twine-stories-foo" : "{\"swag\":\"money\"}",
			"twine-passages": "a,b,c",
			"twine-passages-a": "{\"story\":\"foo\"}",
			"twine-passages-b": "{\"story\":\"bar\"}",
			"twine-passages-c": "{\"story\":\"foo\"}"
		};

		var body = contentScript.buildUploadStoryRequest('foo');
		expect(body.story).toEqual({'swag':'money'});
		for (var key in body.passages) {
			var passage = body.passages[key];
			expect(passage.story).toEqual('foo');
		}
		expect(body.type).toEqual('uploadStory');

	});

	it("should return nothing for no story id", function() {
		global.window.localStorage = {
			"twine-stories-foo" : "{\"swag\":\"money\"}",
			"twine-passages": "a,b,c",
			"twine-passages-a": "{\"story\":\"foo\"}",
			"twine-passages-b": "{\"story\":\"bar\"}",
			"twine-passages-c": "{\"story\":\"foo\"}"
		};

		var body = contentScript.buildUploadStoryRequest(null);
		expect(body).toEqual(null);
	})

	it("should store passages locally", function() {
		global.window.localStorage = {}
		let passages = [
			{
				"id" : "test1"
			},
			{
				"id" : "test2"
			},
			{
				"id" : "test3"
			}
		]
		contentScript.savePassagesLocally(passages);
		//check to see if local storage contains passages
		console.log(global.window.localStorage);
		for (var entry of passages) {
			//console.log(entry);
			//console.log(global.window.localStorage['twine-passages-' + entry.id]);
			expect(global.window.localStorage['twine-passages-' + entry.id]).toEqual(JSON.stringify(entry));
		}
	})

	it("should store stories locally", function() {
		global.window.localStorage = {}
		let stories = [
			{
				"id" : "test1"
			},
			{
				"id" : "test2"
			},
			{
				"id" : "test3"
			}
		]
		contentScript.saveStoriesLocally(stories);
		//check to see if local storage contains passages
		console.log(global.window.localStorage);
		for (var entry of stories) {
			//console.log(entry);
			//console.log(global.window.localStorage['twine-passages-' + entry.id]);
			expect(global.window.localStorage['twine-stories-' + entry.id]).toEqual(JSON.stringify(entry));
		}
	})
});