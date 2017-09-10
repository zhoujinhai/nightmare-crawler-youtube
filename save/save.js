var mysql = require('mysql');
var async = require('async');

var pool = mysql.createPool({
	host : 'localhost',
	user : 'root',
	password : 'z2457098495924',
	database : 'youtube'
});

//保存订阅列表
exports.channelList = function(list){

	pool.getConnection(function(err,connection){
		if(err){
			return console.log(err);
		}

		var insertsql = 'insert into channel(channel,channelUrl,channelId,subscriber,currentTime) values(?,?,?,?,now())';
		
		async.eachSeries(list,function(item,next){
			
			//将订阅号信息插入到数据表channel
			connection.query(insertsql,[item.channel,item.channelUrl,item.channelId,item.subscriber],next);
				
		},function(err){
			if(err){
				console.log(err);
			}
			console.log('insert channel successed!');
		});
		connection.release();
	});
};

//保存视频列表
exports.videoList = function(list,callback){

	pool.getConnection(function(err,connection){
		if(err){
			return console.log(err);
		}
		
		var findsql = 'select * from video where videoId=?';
		var insertsql = 'insert into video (videoName,url,duration,videoId,channelName,channelUrl,channelId,categoryName,categoryVideos,categoryViews,currentTime) values(?,?,?,?,?,?,?,?,?,?,now())';
		var updatesql = 'update video set videoName=?,url=?,currentTime=now() where videoId=?';
		async.eachSeries(list,function(item,next){
			//查询订阅号是否存在
			connection.query(findsql,[item.videoId],function(err,result){
				if(err){
					return next(err);
				}
				if(result.length>=1){
					//订阅号已经存在，更新
					connection.query(updatesql,[item.videoName,item.url,item.videoId],next);
				}else{
					//将订阅号信息插入到数据表channel
					connection.query(insertsql,[item.videoName,item.url,item.duration,item.videoId,item.channelName,item.channelUrl,item.channelId,item.categoryName,item.categoryVideos,item.categoryViews],next);
				}
			});	
		},function(err){
			if(err){
				console.log(err);
			}
			console.log('insert video successed!');
		});
		connection.release();
	});
};

//保存视频信息
exports.videoDetail = function(list){

	pool.getConnection(function(err,connection){
		if(err){
			return console.log(err);
		}
		
        var findsql = 'select * from information where videoId=?';
		var insertsql = 'insert into information(url,videoName,pubTime,intro,videoId,videoClass,viewCount,support,oppose,currentTime) values(?,?,?,?,?,?,?,?,?,now())';
		var insertValues = [list.url,list.videoName,list.pubTime,list.intro,list.videoId,list.videoClass,list.viewCount,list.support,list.oppose];
		var updatesql = 'update information set viewCount=?,support=?,oppose=?,currentTime=now() where videoId=?';
		connection.query(findsql,[list.videoId],function(err,result){
			if(err){
				return console.log(err);
			}
			if(result.length>=1){
				//订阅号已经存在，更新
				connection.query(updatesql,[list.viewCount,list.support,list.oppose,list.videoId],function(err){
					if(err){
						console.log(err);
					}
					console.log('updata information successed!');
				});
			}else{
				connection.query(insertsql,insertValues,function(err){
					if(err){
						console.log(err);
					}
					console.log('insert information successed!');
				});
			}
			connection.release();
		});
	});
};

