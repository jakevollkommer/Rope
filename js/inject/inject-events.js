var modal = document.getElementById('myModal');
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
            modal.style.display = "block";
            span.onclick = function() {
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                    modal.style.display = "none";
                }
            }
            var sub_email = document.getElementById('emailfield').value;
            console.log(sub_email);
        });

    }
}
