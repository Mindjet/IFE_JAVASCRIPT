/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */

var aqiData = {};
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById('aqi-city-input').value.trim();
	var num = document.getElementById('aqi-value-input').value.trim();

	// to verify the city name and num
	if (city!=null&&num!=null) {
		if (!city.match(/^[A-Za-z\u0391-\uFFE5]+$/)) {
			alert('您输入的城市格式错误');
		}else if (!num.match(/^[-+]?\d*$/)) {
			alert('您输入的空气质量错误');
		}else{
			aqiData[city] = parseInt(num);
		}
	};
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	
	var table = document.getElementById('aqi-table');
	// delete rows in table
	table.innerHTML = "";

	//loop through the aqiData and render the whole table 
	for (var i in aqiData) {

		// add the thead at first after clearing up the table
		if (table.children.length == 0) {
			var firstRow = document.createElement('tr');
			firstRow.innerHTML = '<td>城市</td><td>空气质量</td><td>操作</td>';
			table.appendChild(firstRow);
		};

		var newRow = document.createElement('tr');

		var newTd1 = document.createElement('td');
		newTd1.innerHTML = i;
		newRow.appendChild(newTd1);

		var newTd2 = document.createElement('td');
		newTd2.innerHTML = aqiData[i];
		newRow.appendChild(newTd2);

		var newTd3 = document.createElement('td');
		newTd3.innerHTML = '<button class = "del-btn">删除</button>';
		newRow.appendChild(newTd3);

		table.appendChild(newRow);
	};
	
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
  // clear the input
  document.getElementById('aqi-city-input').value = "";
  document.getElementById('aqi-value-input').value = "";
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {

  // find out which tr the button is in
  var whichTr = event.target.parentElement.parentElement;

  // find out the city name
  var city = whichTr.children[0].innerHTML;

  // delete the corresponding element in aqiData
  delete aqiData[city];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  var add_btn = document.getElementById('add-btn');
  add_btn.onclick = addBtnHandle;

  /**as there is no del-btn at first after the page is rendered,
  /* we can add onClickListener to the table, and find out the button later
  **/
  var table = document.getElementById('aqi-table');
  table.onclick = function(event){
  	if (event.target.nodeName == 'BUTTON') {
  		delBtnHandle(event);
  	};
  }
}

// only after the page is entirely rendered, can we execute init
window.onload = init;