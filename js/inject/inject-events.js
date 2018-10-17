ContentScript.prototype.addListeners = function() {
    window.onhashchange = function(e) {
        var sharing = true;

        if (sharing) {
            var button = document.createElement("button")
            button.innerText = "Share"
            var body = document.getElementById("storyEditView");
            body.insertBefore(button, t.childNodes[0])
        }
    }
}
