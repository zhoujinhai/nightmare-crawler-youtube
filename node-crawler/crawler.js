//打印debug 设置：set debug=nightmare:node-crawler:crawler
//运行时防止后台溢出，可以尝试node crawler>console.txt
// exports.informationIfo = function(){

	var config = require('../config');

// function timer(){

	var crawler = require('crawler');
	var fs = require('fs');
	var debug = require('debug')('nightmare:node-crawler:crawler');

	// var informationList = [];
	//获取当前日期
	var myDate = new Date();
	var localdate = myDate.toLocaleDateString();

	// console.time("程序运行时间");//开始运行时间
	//从videoList文件中获取视频列表
	var read = fs.readFileSync('../spiderUrl/videoList'+localdate+'.json',function(err){
		if(err){
			console.log(err);
		}
		debug('读取videoList文件');
		console.log('successed!');
	});
	var videoList = JSON.parse(read);

	var c = new crawler({
		retryTimeout : 3000,
		forceUTF8 : true,
		callback : function(error,res,done){
			if(error){
				console.log(error);
				done();
			}else{	
				information(res,done);
				done();
			}
		}
	});

	// //爬取订阅号列表
	var i = 0;
	function urls(){
		if(typeof videoList[i]!=='undefined'&&videoList[i].hasOwnProperty('url')){
			c.queue({
				uri: videoList[i].url,
				proxy: 'http://127.0.0.1:61481'
	    	});
		}
	    if(i%1000===0){
			setTimeout(urls,0);
		}else{
			process.nextTick(urls);
		}
		i++;
	}
	if(i<videoList.length){
		urls();
	}


	c.on('drain',function(){
		console.log('finished!');
		// console.timeEnd("程序运行时间");//结束运行时间
	});


	//获取视频详细信息
	function information(res , done){

		var $ = res.$;

		var information = {};

		var strViewCount = $('#watch7-views-info .watch-view-count').text().trim();
		var strSupport = $('#watch8-action-buttons .like-button-renderer-like-button-clicked .yt-uix-button-content').text().trim();
		var strOppose = $('#watch8-action-buttons .like-button-renderer-dislike-button-clicked .yt-uix-button-content').text().trim();
		
		//视频好评和差评数
		information.viewCount = Number(strViewCount.replace(/[^0-9]+/g,''));
		information.support = Number(strSupport.replace(/[^0-9]+/g,''));	
		information.oppose = Number(strOppose.replace(/[^0-9]+/g,''));
		//视频相关信息
		information.url = 'https://www.youtube.com'+$('#playlist-autoscroll-list .currently-playing a').attr('href');
		information.videoName = $('#watch-headline-title').text().trim();
		information.pubTime = $('#watch-uploader-info').text().trim();
		information.intro = $('#watch-description-text').text().trim();
		var videoReg = information.url.match(/v\=([a-zA-Z0-9_-]+)/);
		if(Array.isArray(videoReg)){
			information.videoId = videoReg[1];
		}

		//视频类别
		information.videoClass = $('#watch-description-extras .watch-extras-section li .content .g-hovercard').text();
		
		debug('获取视频详细信息:',information.url);//打印信息debug信息
		
		// //存入数据库
		// if(information.hasOwnProperty('videoId')){
		// 	save.videoDetail(information,done);
		// }
		
		//写入文件
		fs.stat(__dirname+'/informationList'+localdate+'.json',function(err,stat){
			if(stat&&stat.isFile()){
				//如果文件存在，则添加信息
				fs.appendFile(__dirname+'/informationList'+localdate+'.json',JSON.stringify(information)+','+'\n',function(err){
					if(err){
			          console.log('write informationList failed!');
			          return console.log(err);
			        }
			        console.log('write informationList successed!');
				});
			}else{
				//不存在的话文件开头添加'['
				fs.appendFile(__dirname+'/informationList'+localdate+'.json','[',function(err){
					if(err){
			          return console.log(err);
			        }
			        console.log('write informationList successed!');
				});
			}
		})
		
	};
	
// }

// setInterval(timer,config.timeDelay.nodeCrawlerTime);//定时器设置,每天爬取一次 

// }





	
	
	