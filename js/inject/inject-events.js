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

ContentScript.prototype.createPopup = function() {
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
			console.log(shared_email);

			chrome.runtime.sendMessage({content: [shared_email], type: 'addUsers'}, (response) => {
				console.log(response);
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
