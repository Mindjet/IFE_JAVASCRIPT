
var queueElements = ['京','广','小','分','队'];


// ------------------handle the tag-add event------------------------------//
function addHobby(){

	var hobby = document.getElementById('hobby');

	hobby.onkeyup = function(){
		var hobbyContent = hobby.value;
		if (hobbyContent) {
			var lastChar = hobbyContent.substring(hobbyContent.length-1);
			if (lastChar==' '||lastChar==','||lastChar=='，'||lastChar=='、') {
				if (queueElements.length==10) {
					deleteElementByIndex(queueElements,0);
				};
				queueElements.push(hobbyContent.substring(0, hobbyContent.length-1));
				hobby.value = '';
				renderQueue('queue',queueElements);
			}else if (event.keyCode==13) {
				if (queueElements.length==10) {
					deleteElementByIndex(queueElements,0);
				};
				queueElements.push(hobbyContent);
				hobby.value = '';
				renderQueue('queue',queueElements);
			};
		}
	}

}

// ---------------------------------------------------------------------//


// ------------------------handle the textarea-add event---------------//
var items = [];

//
function addManyHobbies(){
	var add_btn = document.getElementById('confirm');
	add_btn.onclick = function(){
		var textarea = document.getElementById('textarea');
		extractItems(textarea.value.trim());
		textarea.value = '';
		renderQueue('hobbyList',items);
	};
}

// extract the items in content from the textarea
function extractItems(content){
	// items = [];
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


// ----------------------render the queue and deletion-----------------//

/**
/*this function is universal for any rendering
/*itsID -- the id of the list you want to render
/* source -- the source array to render
**/ 

// render the queue
function renderQueue(itsID,source){
	var arrayToRender = document.getElementById(itsID);
	arrayToRender.innerHTML = '';
	for (var i = 0; i < source.length; i++) {
		var ele = document.createElement('div');
		ele.className = 'index'+i;
		ele.innerHTML = source[i];
		ele.style.backgroundColor = '#333';
		arrayToRender.appendChild(ele);
	};
	ElementClick_ToDelete(itsID,source);
}

//handle the element-click-delete event;
function ElementClick_ToDelete(itsID,source){
	var queue = document.getElementById(itsID);
	var eles = queue.getElementsByTagName('div');

	for (var i = 0; i < eles.length; i++) {
		eles[i].onclick = function(event){
			deleteElement(event.target,itsID,source);
		}
		eles[i].onmouseenter = function(event){
			event.target.innerHTML = "<span>click to delete</span> "+event.target.innerHTML;
			event.target.style.cursor = 'pointer';
			// event.stopPropagation();
		}
		eles[i].onmouseleave = function(event){
			event.target.innerHTML = event.target.innerHTML.replace('<span>click to delete</span> ', '');
		}
	};
}

// any element's click will trigger this function
function deleteElement(whichDiv,itsID,source){
	var clsName = whichDiv.className;
	// the index is in the className
	var index = clsName.substring(5);
	deleteElementByIndex(itsID,source,index);	
}

// in fact, this function is unniversal for any deletion of the queue
function deleteElementByIndex(itsID,source,index){
	var isqueueElements = false;
	var isitems = false;
	if (source == queueElements) {
		isqueueElements = true;
	}
	if (source == items) {
		isitems = true;
	};
	delete source[index];
	var tempQueue = [];
	for (var i = 0,j = 0; i < source.length; i++) {
		if (source[i]==null) {
			// j--;
		}else{
			tempQueue[j] = source[i];
			j++;
		}
	};
	source = tempQueue;
	if (isqueueElements) {queueElements=source};
	if (isitems) {items = source};
	renderQueue(itsID,source);
}

// -----------------------------------------------------------//

window.onload = function(){
	addHobby();
	addManyHobbies();
	renderQueue('queue',queueElements);
}