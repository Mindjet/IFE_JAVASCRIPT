
var queueElements = ['京','广','小','分','队'];

// ----------------------search event----------------------------//

function initSearch(){
	var btn_search = document.getElementById('search');
	btn_search.onclick = search;
}

function search(){
	var input_search = document.getElementById('input-search');
	var queue = document.getElementById('queue');
	var content = input_search.value.trim();
	for (var i = 0; i < queueElements.length; i++) {
		queue.children[i].innerHTML = queue.children[i].innerText.replace(content,'<span class="selected">'+content+'</span>');
	};
}

// ------------------------------------------------------------------//

// ------------------------handle the content in textarea---------------//
var items = [];

// extract the items in content from the textarea
function extractItems(content){
	items = [];
	var charList = [];
	var myItems = [];

	// get the index of space, comma,enter and so on
	for (var i = 0; i < content.length; i++) {
		var myChar = content.charAt(i);
		if (myChar==' '||myChar==','||myChar=='，'||myChar=='\n'||myChar=='、') {
			charList.push(i);
		};
	};

	// get elments divided by the marks
	if (charList.length==0&&content!='') {
			items.push(content);
		}else{
			// it is a special case if the there is only 1 mark
			if (charList.length==1) {
				items.push(content.substring(0,charList[0]));
				items.push(content.substring(charList[0]));
			}else{
				for (var i = 0; i < charList.length; i++) {

					if (i==0 && content.substring(0,charList[i])) {
						items.push(content.substring(0,charList[i]));

					}else if(i==charList.length-1){
						if (content.substring(charList[i-1]+1,charList[i])) {
							items.push(content.substring(charList[i-1]+1,charList[i]));
						};
						items.push(content.substring((charList[i])+1));
					}else{
						if (content.substring(charList[i-1]+1,charList[i])) {
							items.push(content.substring(charList[i-1]+1,charList[i]));
						};
					}
				};
			}
		}
}

// --------------------------------------------------------------//

// -------------------enqueue and dequeue event--------------------//

// handle the left-in button
function leftIn(){
	var input = document.getElementById('input');
	var left_in = document.getElementById('left-in');
	left_in.onclick = function(){
		var content = input.value.trim();
		if (content!='') {
			extractItems(content);
			// enqueue the items one by one
			for (var i = items.length-1; i >= 0; i--) {
				enqueueLeft(items[i]);
			};
			renderQueue();
		}else{
			alert('please enter something');
		}
		input.value = '';
	}
}

// handle the right-in button
function rightIn(){
	var input = document.getElementById('input');
	var right_in = document.getElementById('right-in');
	right_in.onclick = function(){
		var content = input.value.trim();
		if (content!='') {
			extractItems(content);
			// enqueue the items one by one
			for (var i = 0; i < items.length; i++) {
				enqueueRight(items[i]);
			};
			renderQueue();
		}else{
			alert('please enter something');
		}
		input.value = '';
	}
}

// handle the left-out button
function leftOut(){
	var left_out = document.getElementById('left-out');
	left_out.onclick = function(){
		dequeueLeft();
		renderQueue();
	}
}

// handle the right-out button
function rightOut(){
	var right_out = document.getElementById('right-out');
	right_out.onclick = function(){
		dequeueRight();
		renderQueue();
	}
}


// remove the first element from the queue
function dequeueLeft(){

	if (queueElements.length == 0) {
		alert('there is no element in queue');
	};

	if (queueElements.length!=0) {
		alert('the "'+queueElements[0]+'" has been deleted from queue')
		delete queueElements[0];

		// reprocess the queueElement array after deletion
		var tempQueue = [];
		for (var i = 0; i < queueElements.length-1; i++) {
			tempQueue[i] = queueElements[i+1];
		};
		queueElements = tempQueue;
	};

}

// remove the last element from the queue
function dequeueRight(){

	if (queueElements.length == 0) {
		alert('there is no element in queue');
	};

	if (queueElements.length!=0) {
		alert('the "'+queueElements[queueElements.length-1]+'" has been deleted from queue');
		delete queueElements[queueElements.length-1];
		queueElements.length--;
	}
}

// the element enqueue from right
function enqueueRight(content){
	queueElements.push(content);
}

// the element enqueue from left
function enqueueLeft(content){
	var tempQueue = queueElements;
	queueElements = [];
	queueElements[0] = content;
	for (var i = 0; i < tempQueue.length; i++) {
		queueElements.push(tempQueue[i]);
	}
}

// -----------------------------------------------------------------//


// ----------------------render the queue and deletion-----------------//

// render the queue
function renderQueue(){
	var queue = document.getElementById('queue');
	queue.innerHTML = '';
	for (var i = 0; i < queueElements.length; i++) {
		var ele = document.createElement('div');
		ele.className = 'index'+i;
		ele.innerHTML = queueElements[i];
		ele.style.backgroundColor = '#333';
		queue.appendChild(ele);
	};
	ElementClick_ToDelete();
}

//handle the element-click-delete event;
function ElementClick_ToDelete(){
	var queue = document.getElementById('queue');
	var eles = queue.getElementsByTagName('div');

	for (var i = 0; i < eles.length; i++) {
		eles[i].onclick = function(event){
			deleteElement(event.target);
		}
		eles[i].onmouseover = function(event){
			event.target.style.cursor = 'pointer';
		}
	};
}

// any element's click will trigger this function
function deleteElement(whichDiv){
	var clsName = whichDiv.className;
	// the index is in the className
	var index = clsName.substring(5);

	// in fact, this function is unniversal for any deletion of the queue
	// it can be used in the dequeueLeft() and dequeueRight() 
	delete queueElements[index];
	var tempQueue = [];
	for (var i = 0,j = 0; i < queueElements.length; i++) {
		if (queueElements[i]==null) {
			// j--;
		}else{
			tempQueue[j] = queueElements[i];
			j++;
		}
	};
	queueElements = tempQueue;	
	renderQueue();
}

// -----------------------------------------------------------//

window.onload = function(){
	leftIn();
	rightIn();
	leftOut();
	rightOut();
	renderQueue();
	initSearch();
}