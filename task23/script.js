

var renderList = [];
var timer = null;

function handleBtn(){

	var DF = document.getElementById('traversalDF');
	DF.onclick = function(){
		myReset();
		traversalDF(callback);
		render();
	}

	var BF = document.getElementById('traversalBF');
	BF.onclick = function(){
		myReset();
		traversalBF(callback);
		render();
	}

	// callback can change backcolor in both types of traversal
	var callback = function(node){
		if (node.tagName == 'DIV') {
			renderList.push(node);
		}
	}

}

function handlerSearch(){

	
	var search_DF = document.getElementById('traversalDF_search');
	var search_BF = document.getElementById('traversalBF_search');

	search_DF.onclick = function(){

		myReset();
		traversalDF(callback);
		render();
	}

	search_BF.onclick = function(){
		myReset();
		traversalBF(callback);
		render();
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

	},100);	

}

function myReset(){
	
	clearInterval(timer);
	renderList = [];
	var divList = document.getElementsByTagName('div');
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


window.onload=function(){
	handleBtn();
	handlerSearch();
	var result = getByClass('result',null)[0];
	result.style.display = 'none';
}