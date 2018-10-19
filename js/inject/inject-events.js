// var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

var opened = false;

ContentScript.prototype.addListeners = function() {
    window.onhashchange = function(e) {
        console.log("window has changed")
        var share_button = document.createElement("button")
        share_button.innerText = "Share"
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(share_button);

        // createPopup();
        var popup = createPopup();
        body.insertBefore(popup,body.childNodes[1]);

        share_button.addEventListener("click", function(){

            //console.log("clicked");
            var blur_div = document.createElement('div');
            blur_div.style.position='absolute';
            blur_div.style.top = '0';
            blur_div.style.left = '0';
            blur_div.style.width = "100%";
            blur_div.style.height = '100%';
            blur_div.style.filter = "blur(15px)";
            body.appendChild(blur_div);


            popup.style.visibility = 'visible';

        });

    }
}

function createPopup() {
    popup = document.createElement('div');
    // popup.src = chrome.extension.getURL('html/myModal.html')
    //popup.position = absolute;
    popup.style.position = 'absolute';
    popup.style.visibility = 'hidden';
    popup.style.width = '300px';
    popup.style.height = '150px';
    popup.style.backgroundColor = 'white';
    popup.style.color = 'white';
    popup.style.outline = "thin solid #000000";
    popup.style.textAlign = 'center';
    popup.style.borderRadius = ' 6px';
    popup.style.padding = '8px';

    popup.style.zIndex = '100';
    popup.style.bottom = '125%';
    popup.style.left = '30%';
    popup.style.top = '25%';
    popup.style.marginLeft = '-80px';
    // popup.innerText = 'Share';

    popup.id = 'myPopup';

    // var input = document.createElement('input');
    var label = document.createElement('label');
    label.innerText = 'Enter email to share.'
    label.style.color = 'black';

    var input = document.createElement('input');

    input.setAttribute('type','text');
    input.style.backgroundColor = 'white';
    input.style.outline = "thin solid #000000";
    input.id = 'sharing_email';

    var close_button = document.createElement('button');
    close_button.setAttribute('type','close');
    close_button.innerText = "Close";
    close_button.style.backgroundColor = '#ec2133';
    close_button.style.marginTop = '10px';
    close_button.style.marginRight = '5px';
    close_button.style.marginLeft = '5px';


    close_button.addEventListener("click",function() {
        console.log("tried to close");
        popup.style.visibility = 'hidden';
    });


    var btnsubmit = document.createElement('button');
    btnsubmit.setAttribute("type", "submit");
    btnsubmit.innerText = "Submit";
    btnsubmit.style.backgroundColor = '#0bda50';
    btnsubmit.style.marginTop = '10px';
    btnsubmit.style.marginRight = '5px';
    btnsubmit.style.marginLeft = '5px';


    btnsubmit.addEventListener("click", function() {
        console.log("attempt submit");
        var shared_email = input.value;
        //console.log(shared_email);
        if (shared_email != null) {
            popup.style.visibility = 'hidden';


            var img = document.createElement("IMG");
            var imgURL = chrome.extension.getURL('img/cloud.png');
            img.src = imgURL;

            var body = document.getElementById("storyEditView");
            var l = body.lastElementChild.firstElementChild;
            // l.appendChild(img);
            // document.getElementsByClassName(button)

            chrome.runtime.sendMessage({content: shared_email, type: 'addUsers'}, (response) => {
                if (!response) {
                    // TODO probably indicate in UI that no one's signed into Rope
                    console.log('No response');
                    return;
                }

                console.log('added users');
            });
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
