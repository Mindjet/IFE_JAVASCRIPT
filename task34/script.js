
var Block = function(){

	this.direction = 'up';
	this.coordinateX = 6;
	this.coordinateY = 6;
	this.verticalOffset = 0;
	this.horizontalOffset = 0;
	this.degree = 0;
	this.timer = null;

}

Block.prototype.forward = function() {

	block = this;

	var go = function(){

		var realBlock = document.getElementById('block');

		//which direction to go depends on the DIRECTION of block
		switch(block.direction){

			case 'up':
				if(block.coordinateY>1){

					block.verticalOffset-=59;
					realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
					block.coordinateY--;
				}

				break;
					 
			case 'down':
				if (block.coordinateY<10) {

					block.verticalOffset+=59;
					realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
					block.coordinateY++;

				}

				break;

			case 'left':
				if (block.coordinateX>1){

					block.horizontalOffset-=60;
					realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
					block.coordinateX--;

				}
				break;

			case 'right':
				if (block.coordinateX<10){

					block.horizontalOffset+=60;
					realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
					block.coordinateX++;

				}

				break;

		}

	}

	return {

		go:go

	}
	
};


Block.prototype.translate = function() {

	block = this;
	var realBlock = document.getElementById('block');
	
	var tra_left = function(){

		if (block.coordinateX>1) {

			block.horizontalOffset-=60;
			realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
			block.coordinateX--;

		};

	}

	var tra_right = function(){

		if (block.coordinateX<10) {

			block.horizontalOffset+=60;
			realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
			block.coordinateX++;

		};

	}

	var tra_top = function(){

		if (block.coordinateY>1) {

			block.verticalOffset-=59;
			realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
			block.coordinateY--;

		};

	}

	var tra_bottom = function(){

		if (block.coordinateY<10) {

			block.verticalOffset+=59;
			realBlock.style.transform = 'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
			block.coordinateY++

		};

	}

	return{

		tra_left:tra_left,
		tra_right:tra_right,
		tra_top:tra_top,
		tra_bottom:tra_bottom

	}

};

Block.prototype.move_rotate = function() {

	block = this;
	var realBlock = document.getElementById('block');
	
	var mov_left = function(){

		block.translate().tra_left();
		block.change().change2direction(block.direction, 'left');
		block.turn().rotate(realBlock);	

	}

	var mov_right = function(){

		block.translate().tra_right();
		block.change().change2direction(block.direction, 'right');
		block.turn().rotate(realBlock);

	}

	var mov_top = function(){

		block.translate().tra_top();
		block.change().change2direction(block.direction, 'up');
		block.turn().rotate(realBlock);

	}

	var mov_bottom = function(){

		block.translate().tra_bottom();
		block.change().change2direction(block.direction, 'down');
		block.turn().rotate(realBlock);

	}

	return {

		mov_left:mov_left,
		mov_right:mov_right,
		mov_top:mov_top,
		mov_bottom:mov_bottom

	}

};

Block.prototype.turn = function() {

	block = this;
	var realBlock = document.getElementById('block');

	//turn to the relative direction of the current direction
	var turnself = function(rotate_direction){

		switch(rotate_direction){

			case 'left':
				block.degree-=90;
				break;
			case 'right':
				block.degree+=90;
				break;
			case 'back':
				block.degree+=180;
				break;

		}

		rotate(realBlock);
		block.direction = block.change().changeDirection(block.direction, rotate_direction);

	}

	var rotate = function(object){

		object.style.transformOrigin = '50%+'+block.horizontalOffset+' '+'50%+'+block.verticalOffset;
		object.style.transform ='translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';

	}

	return{

		turnself:turnself,
		rotate:rotate

	}

};


Block.prototype.change = function(){

	block = this;
	var directions = ['up','left','down','right'];

	//change the direction of the block after rotations
	var changeDirection = function(currectDirection, rotateDirection){

		var i = 0;
		for (;i < directions.length; i++) {
			if(directions[i]==currectDirection)
				break;
		};

		switch(rotateDirection){

			case 'left':
				if (i==3) {
					return directions[0];
				}else{
					return directions[i+1];
				}
				break;

			case 'right':
				if (i==0) {
					return directions[3];
				}else{
					return directions[i-1];
				}
				break;

			case 'back':
				if (i-2<0) {
					return directions[i+2];
				}
				if (i+2>0) {
					return directions[i-2];
				}
				break;

		}

	}

	//change the direction to 1 specific direction but not a relative one!
	var change2direction = function(currectDirection, expectedDirection){

		var i = 0;
		for (;i < directions.length; i++) {
			if(directions[i]==currectDirection)
				break;
		};

		var j = 0;
		for (;j < directions.length; j++) {
			if(directions[j]==expectedDirection)
				break;
		};

		block.degree-=90*(j-i);
		block.direction = directions[j];

	}

	return{

		changeDirection:changeDirection,
		change2direction:change2direction

	}

}

Block.prototype.decode = function() {

	block = this;
	var decode = function(msg){

		switch(msg){

			case 'GO':
				block.forward().go();
				break;
			case 'TUN LEF':
				block.turn().turnself('left');
				break;
			case 'TUN BAC':
				block.turn().turnself('back');
				break;
			case 'TUN RIG':
				block.turn().turnself('right');
				break;
			case 'TRA LEF':
				block.translate().tra_left();
				break;
			case 'TRA RIG':
				block.translate().tra_right();
				break;
			case 'TRA TOP':
				block.translate().tra_top();
				break;
			case 'TRA BOT':
				block.translate().tra_bottom();
				break;
			case 'MOV LEF':
				block.move_rotate().mov_left();
				break;
			case 'MOV RIG':
				block.move_rotate().mov_right();
				break;
			case 'MOV TOP':
				block.move_rotate().mov_top();
				break;
			case 'MOV BOT':
				block.move_rotate().mov_bottom();
				break;

		}

	}
	
	return {

		decode:decode

	}

};


function controlInit(){

	var input = document.getElementById('input');
	var button = document.getElementById('button');

	var block = new Block();
	button.onclick = function(){

		block.decode().decode(input.value.trim());

	}

	document.onkeydown = function(){

		if (event.keyCode==13){
			block.decode().decode(input.value.trim());
			input.value = '';
		}

	}

}


function positionInit(){

	//postion the table
	var table = document.getElementById('table');
	table.style.left = document.documentElement.offsetWidth/2 - table.offsetWidth/2 +'px';
	
	//postion the block
	var block = document.getElementById('block');
	originRow = table.getElementsByTagName('tr')[5];
	origin = originRow.getElementsByTagName('td')[5];
	block.style.left = origin.offsetLeft+table.offsetLeft+1+'px';
	block.style.top = origin.offsetTop+table.offsetTop+'px';

	//postion the left axis
	var leftCoordinate = document.getElementById('vertical');
	leftCoordinate.style.left = table.offsetLeft-45+'px';

}

window.onload = function(){

	positionInit();
	controlInit();

}

