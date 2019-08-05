
	
/*
	STRUCTURE

	  —SpaceShip
		 |————dynamicSystem
		 |————fuelSystem
		 |————signalSystem
		 |————stateSystem

	  —Commander
	  	 |————send

	  —Mediator
	  	 |————send
	  	 |————receive

	  —Message
	  	 |————id
	  	 |————command

	  —ConsoleUtil
	  
*/




var SpaceShip = function(id){

	this.fuel = 30;
	this.state = 'destroy';
	this.id = id;
	this.timer = null;
	this.charge_timer = null;
	this.degree = 0;

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
		var realShip = document.getElementById('_'+currentship.id);
		var orbit = document.getElementById('orbit'+currentship.id.substring(4));

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

		var ship = document.getElementById('_'+currentship.id);
		var orbit = document.getElementById('orbit'+currentship.id.substring(4));

		ship.style.display = 'block';

		//initialize the position
		ship.style.left = orbit.offsetLeft+orbit.offsetWidth/2-ship.offsetWidth/2+'px';
		ship.style.top = orbit.offsetTop+orbit.offsetHeight-ship.offsetHeight/2+'px';

		//initialize the rotation
		ship.style.transform = 'rotate(-'+0+'deg)';

	};
	
	return{

		launch:function(){

			if (mycraft.state=='destroy'){
				initPlace(mycraft);
				mycraft.state = 'launch';
			} 
		},

		fly:function(){

			mycraft.state = 'fly';
			ConsoleUtils.send_normal(mycraft.id+'--->'+'flying');
			startRotate(mycraft);

		},

		stop:function(){

			mycraft.state = 'stop';
			ConsoleUtils.send_normal(mycraft.id+'--->'+'stopped');
			clearInterval(mycraft.timer);

			mycraft.fuelSystem().charge(mycraft);

		},

		destory:function(){

			mycraft.state = 'destroy';
			shipGroup = Mediator.getShipGroup();
			delete shipGroup[mycraft.id];
			clearInterval(mycraft.timer);
			clearInterval(mycraft.charge_timer);
			document.getElementById('_'+mycraft.id).style.display = 'none';

		}

	};

};

SpaceShip.prototype.fuelSystem = function() {

	mycraft = this;
	var myprogressbar = document.getElementById('_progressbar'+mycraft.id.substring(4));

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

				mycraft.state = 'stop';
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

			if (msg.id==mycraft.id){
				mycraft.stateSystem().changeState(msg.command);
			} 

		}

	};

};

SpaceShip.prototype.stateSystem = function(){

	mycraft = this;

	var changeState = function(state){

		if (state!=mycraft.state) {

			// mycraft.state = state;
			controlState(state);

		};

	}

	var controlState = function(state){

		switch(state){

			case 'launch':
				mycraft.dynamicSystem().launch();
				break;

			case 'fly':
				mycraft.dynamicSystem().fly();
				break;

			case 'stop':
				mycraft.dynamicSystem().stop();
				break;

			case 'destroy':
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

			var msg = new Message(id, command);
			Mediator.receive(msg);

		}

	};	

}();

var Mediator = function(){

	var shipGroup = {};

	return{

		//broadcast
		send:function(msg){

			setTimeout(function(){

				if (msg.command=='launch'&&shipGroup[msg.id]==undefined) {

					var newShip = new SpaceShip(msg.id);
					shipGroup[msg.id] = newShip;

					ConsoleUtils.send_state(msg);;

				}

				if (shipGroup[msg.id]==undefined) 
					ConsoleUtils.send_alert();
				else
					for(var key in shipGroup)
						shipGroup[key].signalSystem().receive(msg);

			}, 1000);
			

		},

		receive:function(msg){

			if (Math.random()>0.3) {
				ConsoleUtils.send_success();
				this.send(msg);
			}else{
				ConsoleUtils.send_fail();
			}
			

		},

		getShipGroup:function(){

			return shipGroup;

		}

	}

}();

var Message = function(id, command){

	this.id = id;
	this.command = command;

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

