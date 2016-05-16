
	
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
	this.fuel_comsume_rate = null;

};


SpaceShip.prototype.dynamicSystem = function() {

	mycraft = this;
	var speed = 10;
	var fuel_dec_rate=1;
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
		var increment = 360/(perimeter/speed);

		currentship.timer = setInterval(function(){

			currentship.degree = currentship.degree>=360?0:currentship.degree;

			realShip.style.transform = 'rotate(-'+currentship.degree+'deg)';
			realShip.style.left = centralX + radius*Math.sin(currentship.degree*Math.PI/180) - realShip.offsetWidth/2 +'px';
			realShip.style.top = centralY + radius*Math.cos(currentship.degree*Math.PI/180) - realShip.offsetHeight/2 +'px';

			currentship.degree+=increment;
			currentship.fuel-=fuel_dec_rate;
			currentship.fuelSystem().discharge();

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
			clearInterval(mycraft.timer);

			mycraft.fuelSystem().charge(mycraft);

		},

		destory:function(){

			mycraft.state = '0004';
			shipGroup = Bus.getShipGroup();
			delete shipGroup[mycraft.id];
			clearInterval(mycraft.timer);
			clearInterval(mycraft.charge_timer);
			document.getElementById('_'+'ship'+mycraft.id.substring(3)).style.display = 'none';

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

					currentship.fuel += 2;

					if (currentship.fuel>=30) {

						currentship.fuel = 30;
						clearInterval(currentship.charge_timer);
						ConsoleUtils.send_normal(currentship.id+'--->charge complete');
						currentship.dynamicSystem().fly();

					};

					myprogressbar.style.height = currentship.fuel + 'px';

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

	return{

		changeState:changeState

	}

}

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
			if(dynamicSystem[i].checked == true)
				ship.speed = dynamicSystem[i].value;
		};

		var fuel = document.getElementById('fuel');
		var fuelSystem = fuel.getElementsByTagName('input');

		for (var i = 0; i < fuelSystem.length; i++) {
			if(fuelSystem[i].checked==true)
				ship.fuel_comsume_rate = dynamicSystem[i].value;
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

	winWidth = document.documentElement.clientWidth;
	winHeight = document.documentElement.clientHeight;
	object.style.left = winWidth/2-object.offsetWidth/2+'px';

}


window.onload = function(){

	panelInit();
	planetInit();

}

