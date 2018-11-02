describe("A test suite", function() {

		global.window = {};
		global.window.localStorage = {
			"twine-stories-foo" : "{\"swag\":\"money\"}",
			"twine-passages": "a,b,c",
			"twine-passages-a": "{\"story\":\"foo\"}",
			"twine-passages-b": "{\"story\":\"bar\"}",
			"twine-passages-c": "{\"story\":\"foo\"}"
		};
	var ContentScript = require('../../build/inject.js')
	var contentScript;

	beforeEach(function() {

		contentScript = new ContentScript();

	})

	it("should return the correct story object and correct passages", function() {
		var body = contentScript.buildUploadStoryRequest('foo');
		expect(body.story).toEqual({'swag':'money'});
		for (var key in body.passages) {
			var passage = body.passages[key];
			expect(passage.story).toEqual('foo');
		}
		expect(body.type).toEqual('uploadStory');

	});

	it("should return nothing for no story id", function() {
		var body = contentScript.buildUploadStoryRequest(null);
		expect(body).toEqual(null);
	})
});