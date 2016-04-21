

var colorLib = ['tomato','orange','black','green'];


function handleBtn(){
	
	var DF = document.getElementById('traversalDF');
	DF.onclick = function(){
		traversalDF(callback);
	}

	var BF = document.getElementById('traversalBF');
	BF.onclick = function(){
		traversalBF(callback);
	}

	// callback can change backcolor in both types of traversal
	callback = function(node){
		for (var i = 0; i < node.length; i++) {
			console.log(node[i].className.substring(6));
			node[i].style.backgroundColor = colorLib[Math.ceil(Math.random()*4)-1];
		};
	}

}

// traversal of Breadth-first Search
function traversalDF(callback){

	(function recurse(nodeName){

		var node = getByClass(nodeName,null);
		// console.log(node);
		for (var i = 0; i < node.length; i++) {
			if (node[i].children.length!=0) {
				for (var j = 0; j < node[i].children.length; j++) {
					recurse(node[i].children[j].className);
				};
			};
		};
		setTimeout(callback(node),2000);

	})('child-0');

}

// traversal of Breadth-first Search
function traversalBF(callback){

	var queue = new Queue();
	queue.enqueue('child-0');

	var currentNode = queue.dequeue();
	while(currentNode){
		var node = getByClass(currentNode);
		for (var i = 0; i < node.length; i++) {
			for (var j = 0; j < node[i].children.length; j++) {
				queue.enqueue(node[i].children[j].className);
			};
		};
		callback(node);
		currentNode = queue.dequeue();

	}

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