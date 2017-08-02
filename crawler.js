var crawler = require('crawler');
var config = require('./config');
var fs = require('fs');
// var videoList = config.videoList;
//var read = require('./read');
var debug = require('debug')('nightmare:crawler');

console.time("程序运行时间");//开始运行时间
//从videoList文件中获取视频列表
var read = fs.readFileSync(__dirname+'/videoList.json',function(err){
	if(err){
		console.log(err);
	}
	debug('读取videoList文件');
	console.log('successed!');
});
var videoList = JSON.parse(read);

var informationList = [];
var c = new crawler({
	maxConnection : 20000,
	// rateLimit : 1000,
	retryTimeout : 1000,
	forceUTF8 : true,
	callback : function(error,res,done){
		if(error){
			console.log(error);
		}else{	
			information(res,done);
			done();
		}
		// console.log(informationList);
		// console.log(informationList.length);
	}
});

// //爬取订阅号列表
for(i=0;i<videoList.length;i++){
	//if(i<1500){
		c.queue({
			uri: videoList[i].url,
			proxy: 'http://127.0.0.1:61481'
	    });
	//}
}

// c.on('schedule',function(options){
// 	options.proxy = 'http://127.0.0.1:61481';
// })

c.on('drain',function(){
    // console.log(informationList);
	// //将视频列表写入文件
 //    var filedata = JSON.stringify(informationList);
 //    fs.writeFile(__dirname+'/informationList.json',filedata,function(err){
 //        if(err){
 //          console.log('write informationList failed!')
 //          return console.log(err);
 //        }
 //        console.log('write informationList successed!');
 //    });
	// console.log('informationList length:'+informationList.length);
	console.log('finished!');
	console.timeEnd("程序运行时间");//结束运行时间
});


//获取视频详细信息
function information(res , done){

	var $ = res.$;
	var information = {};
    information.url = 'https://www.youtube.com'+$('#playlist-autoscroll-list .currently-playing a').attr('href');
	information.videoName = $('#watch-headline-title').text().trim();
	information.pubTime = $('#watch-uploader-info').text().trim();
	information.intro = $('#watch-description-text').text().trim();

	debug('获取视频详细信息:',information.url);//打印信息debug信息
	
	var filmLen = $('#watch-description-extras .watch-extras-section li').text().trim();
	var s = filmLen.match(/(\d+\:\d+\:\d+)/);
	if(Array.isArray(s)){
		information.filmLen = s[1];
	}

	console.log(information.url);
	fs.appendFile(__dirname+'/informationList.json',JSON.stringify(information)+'\n',function(err){
		if(err){
          console.log('write informationList failed!')
          return console.log(err);
        }
        console.log('write informationList successed!');
	});
	// informationList.push(information);	
};







	
	
	