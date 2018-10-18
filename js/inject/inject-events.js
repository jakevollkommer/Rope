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

            console.log("clicked");

            // var popup = document.getElementById('myPopup');
            popup.style.visibility = 'visible';

            // if (!opened) {


            // // span.onclick = function() {


            // // }
            // window.onclick = function(event) {
            //     if (event.target == modal) {
            //         myModal.style.display = "none";
            //     }
            // }
            // var sub_email = document.getElementById('emailfield').value;
            // console.log(sub_email);

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
    popup.style.backgroundColor = '#555';
    popup.style.color = '#fff';
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

    var input = document.createElement('input');
    input.setAttribute('type','text');
    input.style.backgroundColor = 'white';
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
        var shared_email = document.getElementById('sharing_email').value;
        console.log(shared_email);
        popup.style.visibility = 'hidden';
        var img = document.createElement("img");
        // img.src = chrome.runtime.getURL("img/cloud.png");
        img.src = "img/cloud.png";
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(img);

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
