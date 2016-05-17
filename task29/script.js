function verify(){

	var text = document.getElementById('text');
	var result = document.getElementById('result');


		if (string.length>16||string.length<4) {

			result.innerText = '格式错误';
			this.style.backgroundColor = 'red';
			return false;

		}else{

			result.innerText = '格式正确';
			this.style.backgroundColor = 'white';
			result.style.color = 'green';
			return true;
		}


}

window.onload=function(){

	var result = document.getElementById('result');
	result.style.left = document.getElementById('text').offsetLeft+'px';

}