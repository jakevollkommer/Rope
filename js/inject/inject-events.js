
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

    var counting = 0;
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
        inject.innerHTML = xmlHttp.responseText
        document.body.insertBefore(inject, document.body.firstChild);

        var xmlHttp2 = null;
        xmlHttp2 = new XMLHttpRequest();
        xmlHttp2.open( "GET", chrome.extension.getURL ("html/manageUsers.html"), false );
        xmlHttp2.send( null );
        var inject2 = document.createElement("div");
        inject2.innerHTML = xmlHttp2.responseText
        document.body.insertBefore(inject2, document.body.firstChild);
        /* Go ahead and define all the buttons*/
        var input = document.getElementById("inputSubmit");
        var submitBtn = document.getElementById("btnSubmit");
        var pop = document.getElementById("myPopup");
        var manageBtn = document.getElementById("btnManage");
        var manage = document.getElementById
        let storyId = window.location.hash.split("/").pop()
        if (counting == 1) {
            var e = document.createElement("label");
            e.setAttribute("class", "cloud_button");
            e.style.padding = '25px';
            e.innerHTML = '<i class="fa fa-cloud"></i>';
            shareBtn.appendChild(e);
            
        }
        /*Button listeners*/
        shareBtn.addEventListener("click", function(){
            var pop = document.getElementById("myPopup")
            pop.style.visibility = 'visible';
        });

        submitBtn.addEventListener("click", function() {
            var userEmails = input.value;
            input.value = "";
            if (userEmails) {

                pop.style.visibility = 'hidden';

                var multipleEmails = userEmails.split(",");
                $this.sendMessage($this.buildUploadStoryRequest(storyId));
                $this.sendMessage($this.buildAddUsersRequest(multipleEmails, storyId));
                if (counting == 0) {
                    var e = document.createElement("label");
                    e.setAttribute("class", "cloud_button");
                    e.style.padding = '25px';
                    e.innerHTML = '<i class="fa fa-cloud"></i>';
                    shareBtn.appendChild(e);
                    counting = 1;
                }
               
            }
        });
        document.getElementById("closeButton").addEventListener("click", function() {
            pop.style.visibility = 'hidden';
            input.value = "";
        });

        manageBtn.addEventListener("click", function(){
            console.log('manage button');
            /*Inject manage users popup on screen */
            document.getElementById("myPopup").style.visibility = 'hidden';
            var pop = document.getElementById("usersPop")
            pop.style.visibility = 'visible';

            var table = document.getElementById("userTable");        
            
            // TODO get email from uid
            let users = $this.sendMessage($this.getUsersRequest(storyId));
            var rmBtn = document.createElement("input");
            rmBtn.setAttribute("type", "button");
            rmBtn.setAttribute("class", "button");
            rmBtn.setAttribute("id", "rmBtn");
            rmBtn.setAttribute("value", "remove");
            for (i = 0; i < users.length; i++) {
                var row = table.insertRow(-1);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var userEmail = document.createTextNode(users[i]);
                rmBtn.setAttribute("data_email", users[i]);
                cell1.innerHTML = userEmail;
                cell2.innerHTML = rmBtn;
            }
        });
        rmBtn.addEventListener("click", function() {
            $this.removeUser(rmBtn.data_email);
            
        });
        document.getElementById("managecloseButton").addEventListener("click", function() {
            document.getElementById("usersPop").style.visibility = 'hidden';
        });

    }
};
ContentScript.prototype.removeUser = function(user_email) {

}
ContentScript.prototype.getUsersRequest = function(storyId) {
    let req = {
        story: storyId,
        type: 'getUsers'
    }

    return req;

}

ContentScript.prototype.buildUploadStoryRequest = function(storyId) {
    var $this = this;
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

ContentScript.prototype.buildAddUsersRequest = function(userEmails, storyId) {
    if (!userEmails || !storyId) {
        return null;
    }
    let addUsersRequest = {
        userEmails: userEmails,
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

