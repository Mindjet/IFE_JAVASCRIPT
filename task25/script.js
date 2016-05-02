

var renderList = [];
var timer = null;
var divList;


/*----------------------spinner event------------------------------*/
function spinner(){

	divList = getByClass('tree', null)[0].getElementsByTagName('div');

	for (var i = 0; i < divList.length; i++) {
		if (i==0) {
			divList[i].style.display = 'block';
		}
		else{
			divList[i].style.display = 'none';
		}

		if (divList[i].children.length>1) {
			attachArrow(divList[i].className);
		};
	};

	click_collapse_or_full();


}


// add arrows to the <div>
function attachArrow(clsName){

	var object = getByClass(clsName,null)[0];
	var arrow_right = document.createElement('span');
	arrow_right.className = 'arrow-right';
	var arrow_down = document.createElement('span');
	arrow_down.className = 'arrow-down';
	arrow_down.style.display = 'none';
	object.insertBefore(arrow_right,object.children[0]);
	object.insertBefore(arrow_down,object.children[0]);

}

// handle the collapse and fulltext event;
function click_collapse_or_full(){

	var arrow_right_list = getByClass('arrow-right', null);
	for (var i = 0; i < arrow_right_list.length; i++) {
		arrow_right_list[i].onclick = function(){
			this.style.display = 'none';
			this.parentNode.children[0].style.display = 'inline-block';
			for (var i = 3; i < this.parentNode.children.length; i++) {
				this.parentNode.children[i].style.display = 'inline-block';
			};
			event.stopPropagation();
		}
	};

	var arrow_down_list = getByClass('arrow-down', null);
	for (var i = 0; i < arrow_down_list.length; i++) {
		arrow_down_list[i].onclick = function(){
			this.style.display = 'none';
			this.parentNode.children[1].style.display = 'inline-block';
			for (var i = 3; i < this.parentNode.children.length; i++) {
				this.parentNode.children[i].style.display = 'none';
			};
			event.stopPropagation();
		}
	};

}

// change the state of 2 arrows
function changeArrow(clsName){

	var object = getByClass(clsName, null)[0];

	if (object.children.length == 3) {
		object.children[0].remove();
		object.children[1].remove();
	};

	if (object.children.length>3) {

		if (object.children[3].style.display == 'inline-block') {
			object.children[0].style.display = 'inline-block';
			object.children[1].style.display = 'none';
		};

		if (object.children[3].style.display=='none') {
			object.children[0].style.display = 'none';
			object.children[1].style.display = 'inline-block';
		};

	};

}

/*-------------------------------------------------------------*/

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
		
		parent = object.parentNode;
		object.remove();

		// if there is nothing left in the parentNode, then delete the arrows
		changeArrow(parent.className);
		
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
			newItem.style.display = 'inline-block';
			newItem.appendChild(span);
			newItem.style.backgroundColor = 'white';
			object.appendChild(newItem);
			input.value = '';
			popup.style.display = 'none';

			// create arrows for its parentNode
			if (object.getElementsByTagName('span').length<3) {
				attachArrow(object.className);
				click_collapse_or_full();
				changeArrow(object.className);
			};
			
			object.style.backgroundColor = 'white';
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
			if (node.children.length>1) {
				if (node.children[2].innerText == content) {
					node.className = node.className + '-MARKED';
				};
				renderList.push(node);
			}else{
				if (node.children[0].innerText == content) {
					node.className = node.className + '-MARKED';
				};
				renderList.push(node);
			}
			
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

		var object = renderList[tiktok];
		object.style.display = 'inline-block';
		while(object.parentNode.className!='tree'){

			object.parentNode.style.display = 'inline-block';
			changeArrow(object.parentNode.className);
			object = object.parentNode;

		}

		return;
	};

	timer = setInterval(function(){

		tiktok++;

		if (tiktok<renderList.length) {

			renderList[tiktok-1].style.backgroundColor = 'white';
			renderList[tiktok].style.backgroundColor = 'blue';

			// if it's marked, change the backcolor to red
			if(renderList[tiktok].className.indexOf('-MARKED')>0){ 

				renderList[tiktok].style.display = 'inline-block';
				renderList[tiktok].style.backgroundColor = 'red';

				var object = renderList[tiktok];
				while(object.parentNode.className!='tree'){

					object.parentNode.style.display = 'inline-block';
					changeArrow(object.parentNode.className);
					object = object.parentNode;

				}

				// renderList[tiktok].parentNode.children[0].style.display = 'inline-block';
				// renderList[tiktok].parentNode.children[1].style.display = 'none';
				
				clearInterval(timer);
				return;
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
	spinner();
	myReset();
	handlerSearch();
	popupEvent();
}
