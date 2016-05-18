
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

		switch(block.direction){

			case 'up':
				if(block.coordinateY>1){

					block.verticalOffset+=59;
					realBlock.style.transform = 'translate(0,-'+block.verticalOffset+'px)';
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
				if (block.coordinateX<10) return true;

			return false;

		}

	}

	// transform:translate()

	return {

		go:go

	}
	
};

Block.prototype.turn = function() {

	block = this;
	var realBlock = document.getElementById('block');

	var left = function(){

		console.log('sadsadas');
		block.degree -= 90;
		realBlock.style.transformOrigin = block.verticalOffset+'px '+block.horizontalOffset+'px';
		realBlock.style.transform =  'translate('+block.horizontalOffset+'px,'+block.verticalOffset+'px)'+' rotate('+block.degree+'deg)';
		// block.direction = 'left';

		switch(block.direction){

			case 'up':
				block.direction = 'left';
			case 'left':
				block.direction = 'down';
			case 'down':
				block.direction = 'right';
			case 'right':
				block.direction = 'up';

		}

	}
	
	var right = function(){



	}

	var back = function(){



	}

	return{

		left:left,
		right:right,
		back:back

	}

};

Block.prototype.change = function(){



}

Block.prototype.decode = function() {

	block = this;
	var decode = function(msg){

		switch(msg){

			case 'GO':
				block.move().go();
				break;
			case 'TUN LEF':
				block.turn().left();
				break;
			case 'TUN BAC':
				block.turn().back();
				break;
			case 'TUN RIG':
				block.turn().right();
				break;

		}

	}
	
	return {

		decode:decode

	}

};




function positionLeftAxis(){

	var leftCoordinate = document.getElementById('vertical');
	leftCoordinate.style.left = document.getElementById('table').offsetLeft-45+'px';

}

function controlInit(){

	var table = document.getElementById('table');
	var form = document.getElementById('control');
	form.style.top = table.offsetTop + table.offsetHeight +'px';
	form.style.left = document.documentElement.offsetWidth/2 - form.offsetWidth/2 + 'px';

	var input = document.getElementById('input');
	var button = document.getElementById('button');

	var block = new Block();

	button.onclick = function(){

		block.decode().decode(input.value.trim());

	}

}

function positionBlock(){

	var block = document.getElementById('block');
	var table = document.getElementById('table');

	originRow = document.getElementById('table').getElementsByTagName('tr')[5];
	origin = originRow.getElementsByTagName('td')[5];

	block.style.left = origin.offsetLeft+table.offsetLeft+1+'px';
	block.style.top = origin.offsetTop+table.offsetTop+'px';
}

function positionTable(){

	var table = document.getElementById('table');

	table.style.left = document.documentElement.offsetWidth/2 - table.offsetWidth/2 +'px';

}

window.onload = function(){

	positionTable();
	positionBlock();
	positionLeftAxis();
	controlInit();

}

