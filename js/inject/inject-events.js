
ContentScript.prototype.addListeners = function() {
    var $this = this;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", chrome.extension.getURL ("html/pull.html"), false );
    xmlHttp.send( null );

    //Pull from cloud button
    var li  = document.createElement("li");
    li.innerHTML = xmlHttp.responseText;
    li.setAttribute("id", "pull-cloud");
    var nav_list = document.getElementsByClassName("plain");
    var child = nav_list[0].childNodes;
    nav_list[0].insertBefore (li, child[7]);

    document.getElementById("pull-cloud").addEventListener("click", function () {
        console.log("cloud");
        $this.sendMessage({type: 'syncStories'})
            .then((data) => {
                console.log(data);
                $this.saveFirebaseDataLocally(data);
            })
    });


    let menu_button = document.getElementsByClassName('drop-target');

    for (i = 0; i < menu_button.length;i++) {
        // console.log(menu_button[i]);
        let max = menu_button.length;
        var count = 0;
        menu_button[i].addEventListener('click', function () {
            // var menu = document.getElementsByClassName('me')
            var lis = document.createElement("li");
            var button = document.createElement("button");
            button.innerText = "Remove Story from Cloud";
            button.setAttribute("id", "remove_cloud");
            lis.append(button);
            var menus = document.getElementsByClassName("menu");
            let max = menus.length;

            // console.log(menus);
            for (j =0; j < menus.length; j++) {
                if (count < max) {
                    menus[j].insertBefore(lis, menus[j][6]);
                    console.log(count);
                    count = count + 1;
                }


            }
        });
    }

    document.getElementById('cloudPull').addEventListener("click", function(){
        //$this.buildUploadStoryRequest(storyId)
        console.log('cloud')
    });


    var counting = 0;
    window.onhashchange = function(e) {
        /*Inject share button on toolbar */
        var shareBtn = document.createElement("button")
        shareBtn.setAttribute("class", "share-button");
        shareBtn.innerText = "Share"
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(shareBtn);


        var saveBtn = document.createElement("button")
        saveBtn.setAttribute("id", "save-button");
        saveBtn.innerText = "Save";
        l.appendChild(saveBtn);


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
        saveBtn.addEventListener("click", function(){
            console.log('save');
            $this.sendMessage($this.buildUploadStoryRequest(storyId))
                .then((response) => {
                    console.log(response);
                });
        });

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
        var rmBtn = document.createElement("input");
        manageBtn.addEventListener("click", function(){

            /*Inject manage users popup on screen */
            document.getElementById("myPopup").style.visibility = 'hidden';
            var pop = document.getElementById("usersPop")
            pop.style.visibility = 'visible';

            var table = document.getElementById("userTable");


            $this.sendMessage($this.getUsersRequest(storyId))
                .then((userRecords) => {
                    for (var userRecord of userRecords) {
                        console.log(userRecord);
                        var row = table.insertRow(-1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var rmBtn = document.createElement("input");
                        rmBtn.className = 'button';
                        rmBtn.setAttribute("type", "button");
                        rmBtn.setAttribute("value", "remove");
                        rmBtn.setAttribute("data-uid", userRecord.id);
                        rmBtn.onclick = function(e) {
                            let userIdToRemove = e.target.getAttribute('data-uid');
                            let request = $this.removeUserRequest(userIdToRemove, storyId);
                            $this.sendMessage(request);
                        };
                        cell1.innerHTML = userRecord.email;
                        cell2.appendChild(rmBtn);
                    }
                });

        });
        document.getElementById("managecloseButton").addEventListener("click", function() {
            document.getElementById("usersPop").style.visibility = 'hidden';

        });

    }
};

ContentScript.prototype.getUsersRequest = function(storyId) {
    let req = {
        story: storyId,
        type: 'getUsers'
    }

    return req;
}

ContentScript.prototype.removeUserRequest = function(userId, storyId) {
    let req = {
        userId: userId,
        storyId: storyId,
        type: 'removeUser'
    };

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

