/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// color library for poles' background
var colorLibrary = ['#099','#036','#366','#cc9','#c96'];

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: 0,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart(city,time) {

  // first render
  if (city==null&&time==null) {
    city = 0;
    time = 'day';
  };

  // get the cityName by the index of cityList
  var cityList = document.getElementById('city-select');
  var cityName = cityList.children[city].innerHTML;

  // process the data for specific need
  initAqiChartData(cityName,time);

  // set the title
  var title = document.getElementById('title');
  title.children[0].innerText = cityName+"市空气质量报告";

  var detail = document.getElementById('detail');
  var chart = document.getElementById('aqi-chart-wrap');
  // clear up the chart
  chart.innerHTML = '';

  // calculate the distribution for the width of every pole
  var chartWidth = chart.offsetWidth;
  poleNum = getJsonLength(chartData);
  poleWidth = Math.ceil((chartWidth/poleNum)*0.6);

  // fetch the data and set the corresponding height of each pole
  for(var key in chartData){
      var pole = document.createElement('div');
      pole.className = key;
      pole.style.backgroundColor = colorLibrary[Math.ceil(Math.random()*5)-1];
      pole.style.height = chartData[key]+'px';
      pole.style.width = poleWidth+'px';
      chart.appendChild(pole);
  }

  // render the suspension menu
  var divList = chart.getElementsByTagName('div');
  for (var i = 0; i < divList.length; i++) {

    // when the mouseover, display the menu
    divList[i].onmouseover = function(){
      detail.style.display = 'block';
      detail.children[0].innerText = "时间段："+this.className;
      detail.children[2].innerText = "空气质量："+chartData[this.className].toFixed(2);
      this.onmousemove = function(event){
        detail.style.left = event.clientX+20+'px';
        detail.style.top = event.clientY-50+'px';
      }
    }
    // when the mouseout, let the menu disappear
    divList[i].onmouseout = function(){
      detail.style.display = 'none';
      this.onmousemove = null;
      this.onmouseout = null;
    }
  };

}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var radioGroup = document.getElementById('form-gra-time');
  var radios = radioGroup.getElementsByTagName('input');
  var whichTime = '';
  for (var i = 0; i < radios.length; i++) {
    if(radios[i].checked==true){
      whichTime = radios[i].value;
    }
  };
  // 设置对应数据
  pageState.nowGraTime = whichTime;
  // 调用图表渲染函数
  renderChart(pageState.nowSelectCity,pageState.nowGraTime);
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var cityList = document.getElementById('city-select');
  var index = cityList.selectedIndex;
  // 设置对应数据
  pageState.nowSelectCity = index;
  // 调用图表渲染函数
  renderChart(pageState.nowSelectCity,pageState.nowGraTime);
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radioGroup = document.getElementById('form-gra-time');
  var radios = radioGroup.getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
    radios[i].onclick = graTimeChange;
  };
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var cityList = document.getElementById('city-select');
  for(var key in aqiSourceData){
    var newOption = document.createElement('option');
    newOption.innerText = key;
    cityList.appendChild(newOption);
  }
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  cityList.onchange = citySelectChange;

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData(city,time) {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = {};
  var jsonLength = getJsonLength(aqiSourceData['北京']);

  switch(time){

    case 'day':chartData = aqiSourceData[city];
    break;

    case 'week':
      var i=0;  //when it reaches 7, calculate the avarage
      var sum = 0; 
      var endKey = 0;  
      var startKey = 0;
      for(var key in aqiSourceData[city]){

        //to mark the date of the beginning of one week 
        if (i==0) {
          var startKeyName = key;
        };

        endKey++;
        i++;
        sum = sum + aqiSourceData[city][key];
       
        if (i==7) {
          chartData[startKeyName+'~'+key] = sum/7;
          // add 7 to the startKey everytime the i reaches 7
          startKey = startKey + 7;  
          // restart the calculation
          sum = 0;
          i=0;
        };

        if(i<7&&i!=0&&endKey==jsonLength){
           chartData[startKeyName+'~'+key] = sum/(endKey-startKey);
        }
      }
    break;

    case 'month':
    var sum = 0;
    var startKey = 0;
    var endKey = 0;
    for(var key in aqiSourceData[city]){

      endKey++;
      if(key=='2016-01-01'||key=='2016-02-01'||key=='2016-03-01'){
        var startKeyName = key;
      }
      sum = sum + aqiSourceData[city][key];
      if (key == '2016-01-31'||key == '2016-02-29'||key == '2016-03-31') {
        chartData[startKeyName+'~'+key] = sum/(endKey-startKey);
        sum = 0;
        startKey = endKey;
      };
    }
    break;

  }
}

// of course i know the length is 91
function getJsonLength(data){
  var length=0;
  for(var key in data){
    length++;
  }
  return length;
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  renderChart();
}

window.onload = init;