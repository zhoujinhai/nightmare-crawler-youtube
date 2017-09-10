//爬取订阅号相关信息: channel/channel.js;
//爬取视频网址：spiderUrl/loop.js
//爬取视频具体信息： node-crawler/crawler.js
//存储视频具体信息： save/index.js

//运行 先设置debug=nightmare:* 然后node app>console.txt
var channel = require('./channel/channel');
// var videoUrl = require('./spiderUrl/loop');
// var information = require('./node-crawler/crawler');
// var informationSave = require('./save/index');

channel.channelInf();

// videoUrl.videoInf();//还未加时定时

// information.informationIfo();//还未加时定时