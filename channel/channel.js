exports.channelInf = function(){
	var config = require('../config');
	var save = require('../save/save');


  function timer(){
	var crawler = require('crawler');
	var fs = require('fs');

	console.time("code runTime");//开始运行时间
	var urls = config.urls;//获取订阅号URL列表

	var  channelList = [];

	var c = new crawler({
		retryTimeout : 1000,
		forceUTF8 : true,
		header:{
			'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch, br',
            'Accept-Language':'en;q=0.8'
		},
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
	for(var i=0;i<urls.length;i++){
		c.queue({
			uri: urls[i],
			proxy: 'http://127.0.0.1:61481'
		});

	}	

	c.on('drain',function(){
		//获取当前日期
	    // var myDate = new Date();
	    // var localdate = myDate.toLocaleDateString();
	    //将视频列表写入文件
	    // var filedata = JSON.stringify(channelList);
	    // fs.writeFile(__dirname+'/channelList'+localdate+'.json',filedata,function(err){
	    //     if(err){
	    //       console.log('write channelList failed!')
	    //       return console.log(err);
	    //     }
	    //     console.log('write channelList successed!');
	    // });

		//存入数据库
	 	save.channelList(channelList)
		console.log(channelList);
		console.log('finished!');
		console.timeEnd("code runTime");//结束运行时间
	});


	//获取视频详细信息
	function information(res , done){

		var $ = res.$;
		
		var item={};
		item.channel = $('#c4-primary-header-contents .branded-page-header-title-link').text();
		var strSub = $('#c4-primary-header-contents .subscribed').text();
		item.subscriber = Number(strSub.replace(/[^0-9]+/g,''));
		
		item.channelUrl = 'https://www.youtube.com' + $('#c4-primary-header-contents .branded-page-header-title-link').attr('href');
		
		if(item.channelUrl.indexOf('channel')!==-1){
			var s = item.channelUrl.match(/channel\/([a-zA-Z0-9_-]+)/);
			if(Array.isArray(s)){
				item.channelId = s[1].substr(2);
				//订阅号列表
				channelList.push(item);	
			}
		}
		if(item.channelUrl.indexOf('user')!==-1){
			var s = item.channelUrl.match(/user\/([a-zA-Z0-9_-]+)/);
			if(Array.isArray(s)){
				item.channelId = s[1];
				//订阅号列表
				channelList.push(item);	
			}
		}
	};
  }

  setInterval(timer,config.timeDelay.channelTime);//定时器设置
}