

var renderList = [];
var timer = null;

/*-------------------handle the popup menu event---------------*/
function popupEvent(){

	var tree = getByClass('tree', null)[0];
	var divList = tree.getElementsByTagName('div');
	var spanList = tree.getElementsByTagName('span');
	var popup = getByClass('popup', null)[0];
	var btn_del = document.getElementById('delete');


	document.onclick = function(){
		myReset();
		popup.style.display = 'none';
	}

	// initialize the click-show event
	for (var i = 0; i < divList.length; i++) {

		divList[i].onmouseover = function(event){
			this.style.cursor = 'pointer';
			event.stopPropagation();
		}

		divList[i].onclick = click_show_process;
	};
}

// handle the divs' click-show-process event
function click_show_process(event){

	myReset();

	var popup = getByClass('popup', null)[0];
	var btn_del = document.getElementById('delete');
	var btn_add = document.getElementById('add');
	var input = document.getElementById('add-item');
	input.focus();
	var object;

	popup.style.display = 'inline-block';

	
	// judge whether the DIV or SPAN is clicked
	if (event.target.tagName == 'DIV') {
		object = event.target;
	}else if (event.target.tagName == 'SPAN') {
		object = event.target.parentNode;
	};

	object.style.backgroundColor = 'tomato';

	// postion the popup menu
	mleft = event.clientX;
	mtop = event.clientY;
	popup.style.left = mleft+'px';
	popup.style.top = mtop+'px';

	input.onclick = function(e){
		e.stopPropagation();
	}

	btn_del.onclick = function(e){
		object.remove();
		popup.style.display = 'none';
		e.stopPropagation();
	}

	btn_add.onclick = function(e){

		var name = input.value.trim();
		
		if (name!='') {
			var newItem = document.createElement('div');
			newItem.className = name;
			var span = document.createElement('span');
			span.innerHTML = name.substring(0, 1).toUpperCase()+name.substring(1);
			newItem.appendChild(span);
			newItem.style.backgroundColor = 'white';
			object.appendChild(newItem);
			input.value = '';
			popup.style.display = 'none';
		}else{
			alert('please enter something!');
		}
		
		e.stopPropagation();
	}

	event.stopPropagation();
	popupEvent();
}

/*---------------------------------------------------------------------*/

/*---------------------handle the search event-------------------------*/
function handlerSearch(){
	
	var search_DF = document.getElementById('traversalDF_search');
	var search_BF = document.getElementById('traversalBF_search');
	var popup = getByClass('popup', null)[0];

	search_DF.onclick = function(){
		myReset();
		traversalDF(callback);
		render();
		popup.style.display = 'none';
		event.stopPropagation();
	}

	search_BF.onclick = function(){
		myReset();
		traversalBF(callback);
		render();
		popup.style.display = 'none';
		event.stopPropagation();
	}

	var callback = function(node){
		var content = document.getElementById('input').value.trim();
		if (node.tagName == 'DIV') {
			if (node.children[0].innerText == content) {
				node.className = node.className + '-MARKED';
				console.log(node.className);
			};
			renderList.push(node);
		};
		
	}
}

// traversal of Breadth-first Search
function traversalDF(callback){

	(function recurse(nodeName){

		var node = getByClass(nodeName,null)[0];
		if (node.children.length!=0) {
			for (var j = 0; j < node.children.length; j++) {
				if (node.children[j].className)
					recurse(node.children[j].className);
			};
		};
		callback(node);

	})('super');

}

// traversal of Breadth-first Search
function traversalBF(callback){

	var queue = new Queue();
	queue.enqueue('super');

	var currentNode = queue.dequeue();
	while(currentNode){
		var node = getByClass(currentNode)[0];
			for (var j = 0; j < node.children.length; j++) {
				if (node.children[j].className) 
					queue.enqueue(node.children[j].className);
			};
		callback(node);
		currentNode = queue.dequeue();
	};


}


function render(){

	var exist = false;
	var tiktok = 0;

	renderList[tiktok].style.backgroundColor = 'blue';
	if (renderList[tiktok].className.indexOf('-MARKED')>0) {
		renderList[tiktok].style.backgroundColor = 'red';
	};

	timer = setInterval(function(){

		tiktok++;

		if (tiktok<renderList.length) {

			renderList[tiktok-1].style.backgroundColor = 'white';
			renderList[tiktok].style.backgroundColor = 'blue';

			// if it's marked, change the backcolor to red
			if(renderList[tiktok].className.indexOf('-MARKED')>0){
				renderList[tiktok].style.backgroundColor = 'red';
				exist = true;
			};

		}else if (tiktok == renderList.length) {
			clearInterval(timer);
			renderList[tiktok-1].style.backgroundColor = 'white';
		};

		if (!exist&&tiktok==renderList.length) {
			var result = getByClass('result',null)[0];
			result.style.display = 'inline-block';
		};

	},200);	

}

/*---------------------------------------------------------------------*/

function myReset(){
	
	clearInterval(timer);
	renderList = [];
	var tree = getByClass('tree',null)[0];
	var divList = tree.getElementsByTagName('div');
	for (var i = 0; i < divList.length; i++) {
		divList[i].style.backgroundColor = 'white';
		divList[i].className = divList[i].className.replace('-MARKED','');
	};
	var result = getByClass('result',null)[0];
	result.style.display = 'none';
}

/*-----------define a function to get element by classname--------*/

function getByClass(clsName, parentID){
	var ele = [];
	parent = document.getElementById(parentID)?document.getElementById(parentID):document;
	children = parent.getElementsByTagName('*');
	for (var i = 0; i < children.length; i++) {
		if (children[i].className == clsName) {
			ele.push(children[i]);
		};
	};
	return ele;
}

/*-----------------------------------------------------*/


/*----------define my Queue and its methods--------------*/
 
function Queue(){
	this.dataStore = [];
	this.enqueue = enqueue;
	this.dequeue = dequeue;
}

function enqueue(element){
	this.dataStore.push(element);
}

function dequeue(){
	return this.dataStore.shift();
}

/*-----------------------------------------------------*/


window.onload = function(){
	myReset();
	handlerSearch();
	popupEvent();
}
