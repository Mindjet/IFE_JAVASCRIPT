
	
/*
	STRUCTURE

	  —SpaceShip
		 |————dynamicSystem
		 |————fuelSystem
		 |————signalSystem
		 |————stateSystem

	  —Commander
	  	 |————send

	  —Bus
	  	 |————send
	  	 |————receive

	  —bitMessage
	  	 |————id
	  	 |————command

	  —ConsoleUtil
	  
*/
var data2render = {};
var messageDelay = 300;
var fail_rate = 0.1;


var SpaceShip = function(id){

	this.fuel = 30;
	this.state = '0004'; //it means that the ship is destroyed from the very beginning
	this.id = id;
	this.timer = null;
	this.charge_timer = null;
	this.degree = 0;
	this.speed = null;
	this.charge_rate = null;
	this.discharge_rate = null;

};


SpaceShip.prototype.dynamicSystem = function() {

	mycraft = this;
	var progressbarMax = 30;

	// dealing with the flying motion
	var startRotate = function(currentship){

		//stop charging
		clearInterval(currentship.charge_timer);

		var planet = document.getElementById('planet');
		var centralX = planet.offsetLeft+planet.offsetWidth/2;
		var centralY = planet.offsetTop+planet.offsetHeight/2;
		var realShip = document.getElementById('_'+'ship'+currentship.id.substring(3));
		var orbit = document.getElementById('orbit'+currentship.id.substring(3));

		var radius = orbit.offsetWidth/2;
		var perimeter = radius*2*Math.PI;
		var increment = 360/(perimeter/currentship.speed);

		currentship.timer = setInterval(function(){

			currentship.degree = currentship.degree>=360?0:currentship.degree;

			realShip.style.transform = 'rotate(-'+currentship.degree+'deg)';
			realShip.style.left = centralX + radius*Math.sin(currentship.degree*Math.PI/180) - realShip.offsetWidth/2 +'px';
			realShip.style.top = centralY + radius*Math.cos(currentship.degree*Math.PI/180) - realShip.offsetHeight/2 +'px';

			currentship.degree += increment;

			currentship.fuel -= currentship.discharge_rate;
			currentship.fuelSystem().discharge();
			
			currentship.emitter().emit(currentship);

		},100);

	};


	//initialize the place when it launches
	var initPlace = function(currentship){

		var ship = document.getElementById('_'+'ship'+currentship.id.substring(3));
		var orbit = document.getElementById('orbit'+currentship.id.substring(3));

		ship.style.display = 'block';

		//initialize the position
		ship.style.left = orbit.offsetLeft+orbit.offsetWidth/2-ship.offsetWidth/2+'px';
		ship.style.top = orbit.offsetTop+orbit.offsetHeight-ship.offsetHeight/2+'px';

		//initialize the rotation
		ship.style.transform = 'rotate(-'+0+'deg)';

	};
	
	return{

		launch:function(){

			if (mycraft.state=='0004'){
				initPlace(mycraft);
				mycraft.state = '0001';

				//update the information table
				mycraft.emitter().emit(mycraft);
			} 
		},

		fly:function(){

			mycraft.state = '0002';
			ConsoleUtils.send_normal(mycraft.id+'--->'+'flying');
			startRotate(mycraft);

		},

		stop:function(){

			mycraft.state = '0003';
			ConsoleUtils.send_normal(mycraft.id+'--->'+'stopped');

			//stop flying 
			clearInterval(mycraft.timer);

			//start charging
			mycraft.fuelSystem().charge(mycraft);

			//update the information table
			mycraft.emitter().emit(mycraft);

		},

		destory:function(){

			mycraft.state = '0004';
			shipGroup = Bus.getShipGroup();

			//strip the ship from the shipgroup
			delete shipGroup[mycraft.id];

			//strip the corresponding information on the table
			delete data2render[mycraft.id];
			renderTable.render();

			//stop flying and charging
			clearInterval(mycraft.timer);
			clearInterval(mycraft.charge_timer);

			//let the ship disappear and initialize the progressbar
			document.getElementById('_'+'ship'+mycraft.id.substring(3)).style.display = 'none';
			document.getElementById('_progressbar'+mycraft.id.substring(3)).style.height = '30px';

		}

	};

};

SpaceShip.prototype.fuelSystem = function() {

	mycraft = this;
	var myprogressbar = document.getElementById('_progressbar'+mycraft.id.substring(3));

	return{

		charge:function(currentship){

			if (currentship.fuel<30) {

				ConsoleUtils.send_normal(currentship.id+'--->charging...');

				currentship.charge_timer = setInterval(function(){

					currentship.fuel += currentship.charge_rate;

					if (currentship.fuel>=30) {

						currentship.fuel = 30;
						clearInterval(currentship.charge_timer);
						ConsoleUtils.send_normal(currentship.id+'--->charge complete');
						currentship.dynamicSystem().fly();

					};

					myprogressbar.style.height = currentship.fuel + 'px';

					currentship.emitter().emit(currentship);

				}, 200);

			}

		},

		discharge:function(){

			if (mycraft.fuel<=0) {

				mycraft.state = '0003';
				mycraft.fuel=1;
				myprogressbar.style.height = '1px';
				clearInterval(mycraft.timer);
				mycraft.fuelSystem().charge(mycraft);

			}else 
				myprogressbar.style.height = mycraft.fuel + 'px';

		}

	};

};

SpaceShip.prototype.signalSystem = function() {
	
	mycraft = this;

	return{

		receive:function(msg){

			if (msg.substring(0,4)==mycraft.id) {
				mycraft.stateSystem().changeState(msg.substring(4));
			};

		}

	};

};

SpaceShip.prototype.stateSystem = function(){

	mycraft = this;

	var changeState = function(state){

		if (state!=mycraft.state) {

			controlState(state);

		};

	}

	var controlState = function(state){

		mycraft.adapter().decode(state);

	}

	return{

		changeState:changeState

	}

}

SpaceShip.prototype.adapter = function() {

	mycraft = this;

	var decode = function(state){

		switch(state){

			case '0001':
				mycraft.dynamicSystem().launch();
				break;

			case '0002':
				mycraft.dynamicSystem().fly();
				break;

			case '0003':
				mycraft.dynamicSystem().stop();
				break;

			case '0004':
				mycraft.dynamicSystem().destory();
				break;

		};

	}

	var encode = function(){

		return mycraft.id+mycraft.state+'-'+(mycraft.fuel/30*100).toFixed(2)+'%'+'-'+mycraft.speed+'-'+mycraft.discharge_rate;
		//id
		//state
		//fuel
		//speed
		//discharge_rate

	}

	return {

		decode:decode,
		encode:encode

	}
	
};

SpaceShip.prototype.emitter = function() {
	
	mycraft = this;

	var emit = function(currentship){

		var string = currentship.adapter().encode();
		DataCenter.receive(string);

	}

	return{

		emit:emit

	}

};


var DataCenter = function(){

	var receive = function(string){

		var data = decode(string);
		data2render[data['id']] = data;
		renderTable.render();

	}

	var decode = function(string){

		var data = {};
		var zeroArrayIndex = [];

		data['id'] = string.substring(0,4);
		data['state'] = string.substring(4,8);

		for (var i = 0; i < string.length; i++) {
			if (string.substring(i,i+1)=='-') {
				zeroArrayIndex.push(i);
			};
		};

		data['fuel'] = string.substring(zeroArrayIndex[0]+1,zeroArrayIndex[1]);
		data['speed'] = string.substring(zeroArrayIndex[1]+1,zeroArrayIndex[2]);
		data['discharge_rate'] = string.substring(zeroArrayIndex[2]+1);

		return data;

	}

	return {

		receive:receive

	}

}();

var Commander = function(){

	return{

		//broadcast receiver
		send:function(id, command){

			var msg = bitMessage(id, command);
			Bus.receive(msg);

		}

	};	

}();

var Bus = function(){

	var shipGroup = {};

	var initialCore = function(ship){

		var dynamic = document.getElementById('dynamic');
		var dynamicSystem = dynamic.getElementsByTagName('input');

		for (var i = 0; i < dynamicSystem.length; i++) {
			if(dynamicSystem[i].checked == true){
				// ship.speed = dynamicSystem[i].value;
				switch(dynamicSystem[i].value){

					case 'cheap':
						ship.speed = 10;
						ship.discharge_rate = 1;
						break;
					case 'medium':
						ship.speed = 15;
						ship.discharge_rate = 2;
						break;
					case 'expensive':
						ship.speed = 20;
						ship.discharge_rate = 3;
						break;

				}

				break;
			}
				
		};

		var fuel = document.getElementById('fuel');
		var fuelSystem = fuel.getElementsByTagName('input');

		for (var i = 0; i < fuelSystem.length; i++) {
			if(fuelSystem[i].checked==true){

				switch(fuelSystem[i].value){

					case 'cheap':
						ship.charge_rate = 2;
						break;
					case 'medium':
						ship.charge_rate = 3;
						break;
					case 'expensive':
						ship.charge_rate = 4;
						break;

				}

				break;
			}
				
		};

	}

	return{

		//broadcast
		send:function(msg){

			// extract the id and command from the message
			var id = msg.substring(0,4);
			var command = msg.substring(4);

			setTimeout(function(){

				if (command=='0001'&&shipGroup[id]==undefined) {

					var newShip = new SpaceShip(id);

					initialCore(newShip);

					shipGroup[id] = newShip;

					ConsoleUtils.send_normal('newShip launched');

				}

				if (shipGroup[id]==undefined) 
					ConsoleUtils.send_alert();
				else
					for(var key in shipGroup)
						shipGroup[key].signalSystem().receive(msg);

			}, messageDelay);
			

		},

		receive:function(msg){

			//try until it is successfully sent
			while(Math.random()<fail_rate){
				ConsoleUtils.send_fail();
			};
			
			ConsoleUtils.send_success();
			this.send(msg);

		},

		getShipGroup:function(){

			return shipGroup;

		}

	}

}();

var bitMessage = function(id, command){

	var bitmessage  = null;
	var shipId = null;
	var shipCommand = null;

	switch(id){

		case 'ship1':
			shipId= '0001'
			break;
		case 'ship2':
			shipId= '0002'
			break;
		case 'ship3':
			shipId= '0003'
			break;
		case 'ship4':
			shipId= '0004'
			break;

	}

	switch(command){

		case 'launch':
			shipCommand = '0001';
			break;
		case 'fly':
			shipCommand = '0002';
			break;
		case 'stop':
			shipCommand = '0003';
			break;
		case 'destroy':
			shipCommand = '0004';
			break;

	}

	bitmessage = shipId + shipCommand;

	return bitmessage;

}

var ConsoleUtils = function(){

	return{

		send_success:function(){

			var log = document.getElementById('content');
			log.innerText = 'command send...success\n' + log.innerText;

		},

		send_fail:function(){

			var log = document.getElementById('content');
			log.innerText = 'command send...fail\n' + log.innerText;

		},

		send_state:function(msg){

			var log = document.getElementById('content');
			log.innerText = msg.id+'--->'+msg.command+'\n' + log.innerText;

		},

		send_alert:function(){

			var log = document.getElementById('content');
			log.innerText = '!!!launch your ship first!!!'+'\n' + log.innerText;

		},

		send_normal:function(content){

			var log = document.getElementById('content');
			log.innerText = content+'\n' + log.innerText;

		}

	};

}();

var renderTable = function(){
	
	var render = function(){

		var table = document.getElementById('table');
		var tbody = document.getElementById('tbody')?document.getElementById('tbody'):document.createElement('tbody');
		tbody.id = 'tbody';
		tbody.innerHTML = '';

		for(var key in data2render){

			var row = buildTr();
			topkey = key;
			for(var key in data2render[topkey]){

				var cell = buildTd();
				cell.innerText = data2render[topkey][key];
				row.appendChild(cell);

			}

			tbody.appendChild(row);

		}

		table.appendChild(tbody);

	}

	var buildTr = function(){

		var row = document.createElement('tr');
		return row;
	}

	var buildTd = function(){

		var cell = document.createElement('td');
		return cell;

	}

	return{

		render:render

	}

}();

function panelInit(){

	// var commander = new Commander();
	var panel = document.getElementById('panel');

	var buttonList = document.getElementsByTagName('button');
	for (var i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = function(){

			Commander.send(event.target.parentNode.id, event.target.innerText);

		}
	};

	var clean = document.getElementById('clean');
	clean.onclick = function(){

		document.getElementById('content').innerText = '';

	}

}

function planetInit(){
	
	autoCenter(document.getElementById('planet'));
	autoCenter(document.getElementById('orbit1'));
	autoCenter(document.getElementById('orbit2'));
	autoCenter(document.getElementById('orbit3'));
	autoCenter(document.getElementById('orbit4'));

}

function autoCenter(object){

	winWidth = document.getElementById('universe').offsetWidth;
	object.style.left = winWidth/2-object.offsetWidth/2+'px';

}


window.onload = function(){

	panelInit();
	planetInit();

}

