# Rope
An extension to Twine which allows users to collaborate in real time.

# Setup

### Pre-requisites
1. Must be using Google Chrome

### Dependent libraries that must be installed
1. Install node.js from nodejs.org
2. Run `npm install` in the command line

### Download instructions
1. `git clone github.com/jakevollkommer/Rope.git`
1. `npm install 3.9.1 --save` to ensure you have gulp version 3.9.1
2. `gulp`
3. `npm install --save-dev gulp-watch`

### Installation of actual application
1. Add the Rope folder to chrome://extensions

## Using Rope

1. Click on the Rope chrome extension to prompt a sign-in box
2. Register for an account or sign into an existing account
3. The extension should redirect you to Twinery.org where you can access your
   personal stories and the stories being shared with you via Rope

## Sharing a Story

1. Open or create a story in Twine
2. You should notice a new "Share" button along the bottom navigation bar in the
   story interface
3. Use the "Share" button to enter the email addresses you wish to share your
   story with and click submit

## Contributing to a Story
When a story is shared with you, you can sign into Rope and refresh the page to
pull the story and its passages from the cloud.

## Troubleshooting
There is a known bug where sometimes if you refresh the page within the story
interface, the share button will disappear. If this happens, just go back and
re-open the story.
