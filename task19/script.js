
var queueElements = ['10','90','20','80','100','10','90','20','80','100'
					,'10','90','20','80','100','10','90','20','80','100'
					,'10','90','20','80','100','10','90','20','80','100'
					,'10','90','20','80','100','10','90','20','80','100'
					,'10','90','20','80','100','10','90','20','80','100'
					,'10','90','20','80','100','10','90','20','80','100'];
// handle the left-in button
function leftIn(){
	var input = document.getElementById('input');
	var left_in = document.getElementById('left-in');
	left_in.onclick = function(){
		var content = input.value.trim();
		if (content!='') {
			if (parseInt(content)>=10&&parseInt(content)<=100) {
				enqueueLeft(content);
				renderQueue();
			}else{
				alert('please enter a number between 10 and 100');
			}
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
			if (parseInt(content)>=10&&parseInt(content)<=100) {
				enqueueRight(content);
				renderQueue();
			}else{
				alert('please enter a number between 10 and 100');
			}
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
	if (queueElements.length<60) {
		queueElements.push(content);
	}else alert('the queue is full');
}

// the element enqueue from left
function enqueueLeft(content){
	if (queueElements.length<60) {
		var tempQueue = queueElements;
		queueElements = [];
		queueElements[0] = content;
		for (var i = 0; i < tempQueue.length; i++) {
			queueElements.push(tempQueue[i]);
		}
	}else alert('the queue is full');
}

// handle the sort buttons
function sortQueue(){
	var sort_dec = document.getElementById('sort-dec');
	var sort_inc = document.getElementById('sort-inc');
	sort_dec.onclick = sortQueueByDec;
	sort_inc.onclick = sortQueueByInc;
}

// sort the queue by dec
function sortQueueByDec(){
	// here we use bubble sort
	snapShot = [];
	for (var i = 0; i < queueElements.length; i++) {
		for (var j = i+1; j < queueElements.length; j++) {
			if (parseInt(queueElements[i])<parseInt(queueElements[j])) {
				swap(queueElements,i,j);
				renderQueue();
			};
		};
	};
}

// sort the queue by inc
function sortQueueByInc(){
	// here we use bubble sort
	for (var i = 0; i < queueElements.length-1; i++) {
		for (var j = i+1; j < queueElements.length; j++) {
			if (parseInt(queueElements[i])>parseInt(queueElements[j])) {
				swap(queueElements,i,j);
				renderQueue();
			};
		};
	};
}


// define a function to swap 2 elements in the queue
function swap(array,a,b){
	var temp;
	temp = array[a];
	array[a] = array[b];
	array[b] = temp;
}

// render the queue
function renderQueue(){
	var queue = document.getElementById('queue');
	queue.innerHTML = '';
	averageWidth = (queue.offsetWidth/queueElements.length)*0.6;
	for (var i = 0; i < queueElements.length; i++) {
		var ele = document.createElement('div');
		ele.className = 'index'+i;
		ele.style.height = queueElements[i]*3+'px';
		ele.style.width = averageWidth+'px';
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
			event.target.style.backgroundColor = '#666';
			event.target.style.cursor = 'pointer';
		}
		eles[i].onmouseout = function(event){
			event.target.style.backgroundColor = '#333';
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

// initial
window.onload = function(){
	leftIn();
	rightIn();
	leftOut();
	rightOut();
	sortQueue();
	renderQueue();
}