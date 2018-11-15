
ContentScript.prototype.addListeners = function() {
    var $this = this;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", chrome.extension.getURL ("html/pull.html"), false );
    xmlHttp.send( null );

    var li  = document.createElement("li");
    li.innerHTML = xmlHttp.responseText;
    var nav_list = document.getElementsByClassName("plain");
    console.log(nav_list);
    var child = nav_list[0].childNodes;
    console.log(child);
    nav_list[0].insertBefore (li, child[7]);



    window.onhashchange = function(e) {

        /*Inject share button on toolbar */
        var shareBtn = document.createElement("button")
        shareBtn.setAttribute("class", "share-button");
        shareBtn.innerText = "Share"
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(shareBtn);

        /*Inject share with others popup on screen */
        var xmlHttp = null;
        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", chrome.extension.getURL ("html/sharePopup.html"), false );
        xmlHttp.send( null );
        var inject  = document.createElement("div");

        inject.innerHTML = xmlHttp.responseText
        document.body.insertBefore(inject, document.body.firstChild);
        /* Go ahead and define all the buttons*/
        var input = document.getElementById("inputSubmit");
        var submitBtn = document.getElementById("btnSubmit");
        var closeBtn = document.getElementById("closeButton");
        var pop = document.getElementById("myPopup");

        /*Button listeners*/
        submitBtn.addEventListener("click", function() { 
            var sharedEmail = input.value;
            input.value = "";
            if (sharedEmail) {
                
                pop.style.visibility = 'hidden';
                
                var multipleEmails = sharedEmail.split(",");
                for (i = 0; i < multipleEmails.length; i++) {
                    $this.sendMessage($this.buildAddUsersRequest(multipleEmails[i].replace(/\s+/g, ''), storyId));
                }
                $this.sendMessage($this.buildUploadStoryRequest(storyId));

                var img = document.createElement("IMG");
                img.src = chrome.extension.getURL('img/cloud.png');
                shareBtn.appendChild(img);
            }
        });
        
        closeBtn.addEventListener("click", function() {
            pop.style.visibility = 'hidden'; 
            input.value = "";
        });
    }
};


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

