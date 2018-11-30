# Rope
An extension to Twine which allows users to collaborate on and share stories.

# Setup

### Pre-requisites
1. Must be using Google Chrome

### Dependent libraries that must be installed
1. Install node.js from nodejs.org

### Build instructions
1. Clone repository: `git clone github.com/jakevollkommer/Rope.git`
2. `npm install` to install dependencies in package.json
3. `gulp` to build JS
4. `node index.js` to run the server

### Chrome extension installation
1. Navigate to chrome://extensions
2. Click "Developer mode" in the top right corner.
3. Click "Load unpacked" and select the Rope folder.

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

# Release Notes
> ## v1.1.2
>
> #### New Features:
>
> - Added story sharing via the cloud
> - Multiple users can share stories
>
> #### Bug Fixes:
>
> - Stories will now be shared with user's that previously had no stories
> - Stories were being overwritten, we now store them using unique ID's
>
> #### Known Bugs:
>
> - Sometimes when the page is refreshed in the stories interface, the share
>   button disappears
