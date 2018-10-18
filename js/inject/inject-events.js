// var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

ContentScript.prototype.addListeners = function() {
    window.onhashchange = function(e) {
        console.log("window has changed")
        var share_button = document.createElement("button")
        share_button.innerText = "Share"
        var body = document.getElementById("storyEditView");
        var l = body.lastElementChild.firstElementChild;
        l.appendChild(share_button);



        share_button.addEventListener("click", function(){

            console.log("clicked");

            var popup = document.querySelector('myPopup');
            if (!popup) {
                popup = document.createElement('div');
                // popup.src = chrome.extension.getURL('html/myModal.html')
                popup.style.visibility = 'hidden';
                popup.style.width = '160px';
                popup.style.backgroundColor = '#555';
                popup.style.color = '#fff';
                popup.style.textAlign = 'center';
                popup.style.borderRadius = ' 6px';
                popup.style.padding = '8px 0';
                popup.style.position = 'absolute';
                popup.style.zIndex = '1';
                popup.style.bottom = '125%';
                popup.style.left = '50%';
                popup.style.marginLeft = '-80px';
                // popup.innerText = 'Share';


                popup.id = 'myPopup';


                // var input = document.createElement('input');
                var label = document.createElement('label');
                label.innerText = 'Enter email to share.'

                var input = document.createElement('input');
                input.setAttribute('type','text');


                var btnsubmit = document.createElement('INPUT');
                btnsubmit.setAttribute("type", "submit");
                btnsubmit.setAttribute('value','Submit');


                popup.appendChild(label);
                popup.appendChild(input);
                popup.appendChild(btnsubmit);

                // popup.show()
                share_button.appendChild(popup);

            }

            if (popup.style.visibility === 'hidden')
              popup.style.visibility = 'visible';
            else
                popup.style.visibility = 'hidden';




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
