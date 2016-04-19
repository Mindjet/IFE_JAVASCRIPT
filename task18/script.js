
var queueElements = ['京','广','小','分','队'];

// handle the left-in button
function leftIn(){
	var input = document.getElementById('input');
	var left_in = document.getElementById('left-in');
	left_in.onclick = function(){
		var content = input.value.trim();
		if (content!='') {
			enqueueLeft(content);
		}else{
			alert('please enter something');
		}
		renderQueue();
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
			enqueueRight(content);
		}else{
			alert('please enter something');
		}
		renderQueue();
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

// render the queue
function renderQueue(){
	var queue = document.getElementById('queue');
	queue.innerHTML = '';
	for (var i = 0; i < queueElements.length; i++) {
		var ele = document.createElement('div');
		ele.className = 'index'+i;
		ele.innerHTML = queueElements[i];
		ele.style.backgroundColor = 'red';
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
			event.target.style.backgroundColor = 'green';
			event.target.style.cursor = 'pointer';
		}
		eles[i].onmouseout = function(event){
			event.target.style.backgroundColor = 'red';
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

window.onload = function(){
	leftIn();
	rightIn();
	leftOut();
	rightOut();
	renderQueue();
}