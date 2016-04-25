

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
	callback = function(node){
		renderList.push(node);
	}

}

// traversal of Breadth-first Search
function traversalDF(callback){

	(function recurse(nodeName){

		var node = getByClass(nodeName,null)[0];
		// console.log(node);
		if (node.children.length!=0) {
			for (var j = 0; j < node.children.length; j++) {
				recurse(node.children[j].className);
			};
		};
		// console.log('222');
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
				queue.enqueue(node.children[j].className);
			};
		callback(node);
		currentNode = queue.dequeue();
	};


}

function render(){
	var tiktok = 0;
	renderList[tiktok].style.backgroundColor = 'blue';
	timer = setInterval(function(){
		tiktok++;
		if (tiktok<renderList.length) {
			renderList[tiktok-1].style.backgroundColor = 'white';
			renderList[tiktok].style.backgroundColor = 'blue';
		}else if (tiktok == renderList.length) {
			clearInterval(timer);
			renderList[tiktok-1].style.backgroundColor = 'white';
		};

	},500);
}

function myReset(){
	
	clearInterval(timer);
	for (var i = 0; i < renderList.length; i++) {
		renderList[i].style.backgroundColor = 'white';
	};
	renderList = [];

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
}