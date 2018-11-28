ContentScript.prototype.addListeners = function() {
    var $this = this;
    window.onhashchange = function(e) {
        console.log("window has changed")
        var share_button = document.createElement("button")
        share_button.setAttribute("class", "share-button");
        share_button.innerText = "Share"
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(share_button);

        // createPopup();
        var popup = $this.createPopup();
        popup.setAttribute("class", "modal");
        body.insertBefore(popup,body.childNodes[1]);

        share_button.addEventListener("click", function(){
            var blur_div = document.createElement('div');
            blur_div.setAttribute("class", "blur-effect");
            body.appendChild(blur_div);
            popup.style.visibility = 'visible';
        });

        let passageElements = document.getElementsByClassName('passage');

        for (let i = 0; i < imageArray.length; i++) {
            passageElements[i].addEventListener("click", function() {
                $this.initFirepad();
            });
        }

    }
}

ContentScript.prototype.buildUploadStoryRequest = function(storyId) {
    if (!storyId) {
        return null;
    }
    storyObject = JSON.parse(window.localStorage['twine-stories-' + storyId]);
    passages = {};
    const localPassageIds = window.localStorage['twine-passages'].split(',');
    for (var id of localPassageIds) {
        passage = window.localStorage['twine-passages-' + id];
        if (JSON.parse(passage)['story'] == storyId) {
            passages[id] = JSON.parse(passage);
        }
    }

    let uploadStoryRequest = {
        story: storyObject,
        passages: passages,
        type: 'uploadStory'
    };
    return uploadStoryRequest;
}

ContentScript.prototype.buildAddUsersRequest = function(sharedEmail, storyId) {
    if (!sharedEmail || !storyId) {
        return null;
    }
    let addUsersRequest = {
        userIds: [shared_email],
        type: 'addUsers',
        storyId: storyId
    };
    return addUsersRequest;
}

ContentScript.prototype.initFirepad = function() {
    // Get Firebase Database reference.
    var firepadRef = $this.database.ref();

    // Create CodeMirror (with lineWrapping on).
    var codeMirror = CodeMirror(document.getElementById('firepad'), { lineWrapping: true });

    // Create Firepad (with rich text toolbar and shortcuts enabled).
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });
}

ContentScript.prototype.createPopup = function() {
    let $this = this;
    popup = document.createElement('div');
    // popup.src = chrome.extension.getURL('html/myModal.html')
    //popup.position = absolute;
    // popup.innerText = 'Share';

    popup.id = 'myPopup';

    // var input = document.createElement('input');
    var label = document.createElement('label');
    label.innerText = 'Enter email to share.'
    label.style.color = 'black';

    var input = document.createElement('input');
    input.setAttribute('type','text');
    input.setAttribute('class','modal-input');

    var close_button = document.createElement('button');
    close_button.setAttribute('class','modal-button--close');
    close_button.innerText = "Close";

    close_button.addEventListener("click",function() {
        console.log("tried to close");
        popup.style.visibility = 'hidden';
    });


    var btnsubmit = document.createElement('button');
    btnsubmit.setAttribute("type", "submit");
    btnsubmit.setAttribute("class", "modal-button--submit");
    btnsubmit.innerText = "Submit";

    let storyId = window.location.hash.split("/").pop()

    btnsubmit.addEventListener("click", function() {
        var sharedEmail = input.value;
        if (sharedEmail) {
            // Hide popup
            popup.style.visibility = 'hidden';
            var img = document.createElement("IMG");
            var imgURL = chrome.extension.getURL('img/cloud.png');
            img.src = imgURL;
            var body = document.getElementById("storyEditView");
            var l = body.lastElementChild.firstElementChild;
            $this.sendMessage($this.buildAddUsersRequest(sharedEmail, storyId));
            $this.sendMessage($this.buildUploadStoryRequest(storyId));
        }
    });


    popup.appendChild(label);
    popup.appendChild(input);


    var sub_div = document.createElement('div');
    sub_div.appendChild(btnsubmit);
    sub_div.appendChild(close_button);

    // popup.appendChild(btnsubmit);
    // popup.appendChild(close_button);

    popup.appendChild(sub_div);
    opened = true;
    return popup;
    // share_button.appendChild(popup);
}
