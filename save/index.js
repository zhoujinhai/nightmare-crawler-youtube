//先读取 再存数据库 
// exports.saveInf = function(){

var config = require('../config');
// function timer(){

var fs = require('fs');
var save = require('./save');

//获取当前日期
var myDate = new Date();
var localdate = myDate.toLocaleDateString();

// 保存视频信息,先得添加']'
fs.appendFileSync('../node-crawler/informationList'+localdate+'.json',JSON.stringify({})+']',function(err){
	if(err){
      console.log('write informationList failed!');
      return console.log(err);
    }
    console.log('write informationList successed!');
});

var informationList = fs.readFileSync('../node-crawler/informationList'+localdate+'.json',function(err){
	if(err){
		return console.log(err);
	}
});

informationList = JSON.parse(informationList);
// console.log(informationList);
for(var i=0;i<informationList.length;i++){
	if(informationList[i].hasOwnProperty('videoId')&&informationList[i].videoName!==''){
		save.videoDetail(informationList[i]);
	}
}

// }

// setInterval(timer,config.saveTime);//定时器设置,每天爬取一次 

// }

