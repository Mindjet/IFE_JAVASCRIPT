
var Block = function(){

	this.direction = 'up';
	this.coordinateX = 6;
	this.coordinateY = 6;
	this.verticalOffset = 0;
	this.horizontalOffset = 0;
	this.degree = 0;

}

Block.prototype.move = function() {

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

Block.prototype.turn = function() {

	block = this;
	var realBlock = document.getElementById('block');

	var rotate = function(rotate_direction){

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

		realBlock.style.transformOrigin = '50%+'+block.horizontalOffset+' '+'50%+'+block.verticalOffset;
		realBlock.style.transform ='translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';

		block.direction = block.change().changeDirection(block.direction, rotate_direction);

	}

	return{

		rotate:rotate

	}

};


Block.prototype.change = function(){

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

	return{

		changeDirection:changeDirection

	}

}

Block.prototype.decode = function() {

	block = this;
	var decode = function(msg){

		switch(msg){

			case 'GO':
				block.move().go();
				break;
			case 'TUN LEF':
				block.turn().rotate('left');
				break;
			case 'TUN BAC':
				block.turn().rotate('back');
				break;
			case 'TUN RIG':
				block.turn().rotate('right');
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

		if (event.keyCode==13)
			block.decode().decode(input.value.trim());

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

