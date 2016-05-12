var SpaceShip = function(id){

	this.fuel = 100;
	this.state = 'stop';
	this.id = id;

}

SpaceShip.prototype.dynamicSystem = function() {
	
	return{

		fly:function(){



		},

		stop:function(){



		}

	};

};

SpaceShip.prototype.fuelSystem = function() {

	return{

		charge:function(){



		},

		discharge:function(){



		}

	};

};

SpaceShip.prototype.signalSystem = function() {
	
	return{

		receive:function(msg){



		}

	};

};

var Commander = function(){

	return{

		//broadcast receiver
		send:function(id, command){

			var msg = new Message(id, command);
			Mediator.receive(msg);

		}

	};	

}

var Mediator = function(){

	return{

		//broadcast
		send:function(msg){

			return msg;

		},

		receive:function(msg){

			if (Math.random()>0.3) {
				send(msg);
				ConsoleUtils.send_success(msg);
			}else{
				ConsoleUtils.send_fail();
			}
			

		}

	}

}();

var Message = function(id, command){

	this.id = id;
	this.command = command;

}

var ConsoleUtils = function(){

	return{

		send_success:function(msg){

			console.log(msg.id+"--->"+msg.command+'...success');

		},

		send_fail:function(id,msg){

			console.log('command send...fail');

		}

	};

}();

function panelInit(){

	// var commander = new Commander();
	var panel = document.getElementById('panel');

	var buttonList = document.getElementsByTagName('button');
	for (var i = 0; i < buttonList.length; i++) {
		buttonList[i].onclick = function(){

			console.log(event.target.parentNode.id+'+'+event.target.innerText)
			Commander.send(event.target.parentNode.id, event.target.innerText);

		}
	};

}


window.onload = function(){

	console.log(Math.random());

}

