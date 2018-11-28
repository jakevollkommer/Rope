ContentScript.prototype.addListeners = function() {
    var $this = this;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", chrome.extension.getURL ("html/pull.html"), false );
    xmlHttp.send( null );

    //Pull from cloud button
    var li  = document.createElement("li");
    li.innerHTML = xmlHttp.responseText;
    var nav_list = document.getElementsByClassName("plain");
    var child = nav_list[0].childNodes;
    nav_list[0].insertBefore (li, child[7]);

    // Delete story from cloud button

    var deleteList  = document.createElement("li");
    deleteList.innerText = "Delete from cloud";
    var dropdown = document.getElementsByClassName("divider");
    //dropdown.childNodes.append(deleteList)
    //console.log(dropdown.childNodes)
    //[deleteList].concat(Array.from(document.getElementsByClassName('divider')))
    //dropdown.parentNode.insertBefore(deleteList, dropdown.nextSibling);


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
        var inject = document.createElement("div");

        // /*Inject manage users popup on screen */
        // var xmlHttp = null;
        // xmlHttp = new XMLHttpRequest();
        // xmlHttp.open( "GET", chrome.extension.getURL ("html/manageUsers.html"), false );
        // xmlHttp.send( null );
        // var inject = document.createElement("div");

        inject.innerHTML = xmlHttp.responseText
        document.body.insertBefore(inject, document.body.firstChild);
        /* Go ahead and define all the buttons*/
        var input = document.getElementById("inputSubmit");
        var submitBtn = document.getElementById("btnSubmit");
        var closeBtn = document.getElementById("closeButton");
        var pop = document.getElementById("myPopup");
        var manageBtn = document.getElementById("btnManage");
        var manage = document.getElementById
        let storyId = window.location.hash.split("/").pop()

        /*Button listeners*/
        shareBtn.addEventListener("click", function(){
            var pop = document.getElementById("myPopup")
            pop.style.visibility = 'visible';
        });


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
                var e = document.createElement("label");
                e.setAttribute("class", "cloud_button");
                e.style.padding = '25px';
                e.innerHTML = '<i class="fa fa-cloud"></i>';
                console.log("this is hte sharedEmail")
                console.log(sharedEmail)
                $this.sendMessage($this.buildAddUsersRequest(sharedEmail, storyId));
                $this.sendMessage($this.buildUploadStoryRequest(storyId));
                console.log(storyId);
                shareBtn.appendChild(e);
            }
        });
        closeBtn.addEventListener("click", function() {
            pop.style.visibility = 'hidden';
            input.value = "";
        });

        manageBtn.addEventListener("click", function(){
            console.log('manage button');
            /*Inject manage users popup on screen */
            document.getElementById("myPopup").style.visibility = 'hidden';
            var xmlHttp = null;
            xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", chrome.extension.getURL ("html/manageUsers.html"), false );
            xmlHttp.send( null );
            var inject = document.createElement("div");
            inject.innerHTML = xmlHttp.responseText
            document.body.insertBefore(inject, document.body.firstChild);

            var pop = document.getElementById("usersPop")
            pop.style.visibility = 'visible';

            var table = document.getElementById("userTable");
            // for (i = 0; i < users.length; i++) {
            //     var row = table.insertRow(1);
            //     var cell1 = row.insertCell(0);
                // var cell2 = row.insertCell(1);
            //     cell1.innerHTML = user.email;
            // }
            

        });
        document.getElementById("managecloseButton").addEventListener("click", function() {
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
        userIds: [sharedEmail],
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

