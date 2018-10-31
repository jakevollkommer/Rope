// var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var opened = false;

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

    }
}

ContentScript.prototype.uploadStory = function(storyId) {
    storyObject = window.localStorage['twine-stories-' + storyId];
    passages = {};
    const localPassageIds = window.localStorage['twine-passages'].split(',');
    for (var id of localPassageIds) {
        passage = window.localStorage['twine-passages-' + id];
        if (passage['story'] == storyId) {
            passages.id = passage;
        }
    }
    if (storyId != null) {
        let uploadStoryRequest = {
            story: JSON.parse(storyObject),
            passages: passages,
            type: 'uploadStory'
        };
        chrome.runtime.sendMessage(uploadStoryRequest, (response) => {
            console.log(response);
            if (!response) {
                console.log('No response');
                return;
            }
            console.log('added story')
        });
    }
}

ContentScript.prototype.addUsers = function(shared_email, storyId) {
        console.log("attempt submit");
        console.log("shared emails: " + shared_email);
        if (shared_email != null) {
            popup.style.visibility = 'hidden';

            var img = document.createElement("IMG");
            var imgURL = chrome.extension.getURL('img/cloud.png');
            img.src = imgURL;

            var body = document.getElementById("storyEditView");
            var l = body.lastElementChild.firstElementChild;
            let addUsersRequest = {
                userIds: [shared_email],
                type: 'addUsers',
                storyId: storyId
            };
            chrome.runtime.sendMessage(addUsersRequest, (response) => {
                console.log(response);
                if (!response) {
                    // TODO probably indicate in UI that no one's signed into Rope
                    console.log('No response');
                    return;
                }

                console.log('added users');
            });
        }
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
        $this.addUsers(input.value);
        $this.uploadStory(storyId);
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
