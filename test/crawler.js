
  


// exports.videoInf = function(){

// exports.videoInf = function(){

  var config = require('../config');
  var save = require('../save/save');

// function timer(){
  var Nightmare = require('nightmare');
  //使用内置打印debug信息:   set debug=*;

  var nightmare = Nightmare({
    switches: {
      'proxy-server': 'http://127.0.0.1:61481',
      'ignore-certificate-errors': true
    }
  });
  var fs = require('fs');

  var urls = config.urls;//获取订阅号URL列表

  console.time("程序运行时间");//开始运行时间
  urls.reduce(function(accumulator, url) {
    return accumulator.then(function(categoryList) {
      return nightmare
        .header({
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch, br',
            'Accept-Language':'zh-CN,zh;q=0.8'
        })
        .goto(url)
        .inject('js', __dirname+'/jquery.min.js')
        .wait(function() {
            //模拟点击加载更多
            var loadMoreText = document.querySelector('.load-more-text');
            if (loadMoreText == null){
              return true;
            } 
            if (/hid/.test(loadMoreText.classList.value)){
              return false;
            } 
            document.querySelector('.browse-items-load-more-button').click();
            return false;
        })
        .evaluate(function(categoryList) {
          
          $('#browse-items-primary .branded-page-module-title').each(function(){
            var $category = $(this).find('a').first();
            var item = {
              categoryName : $category.text().trim(),
              url : 'https://www.youtube.com' + $category.attr('href')
            };
            //根据URL判断为订阅号还是视频分类
            if(item.url.indexOf('list')!==-1){
              categoryList.push(item);
            }
          });
          return categoryList;
        },categoryList)
        .then(function(categoryList){
          return categoryList;
        })
        .catch(function (error) {
          console.error('获取categoryList failed:', error);
        });
    });
  }, Promise.resolve([])).then(function(categoryList){
        //打印分类列表信息
        // console.log(categoryList);
        // console.log(categoryList.length);

        categoryList.reduce(function(accumulator, cate) {
        return accumulator.then(function(videoList) {
          return nightmare
            .header({
                'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding':'gzip, deflate, sdch, br',
                'Accept-Language':'zh-CN,zh;q=0.8'
            })
            .goto(cate.url)
            .inject('js', __dirname+'/jquery.min.js')
            .wait(function() {
                //模拟点击加载更多
                var loadMoreText = document.querySelector('.load-more-text');
                if (loadMoreText == null){
                  return true;
                } 
                if (/hid/.test(loadMoreText.classList.value)){
                  return false;
                } 
                document.querySelector('.browse-items-load-more-button').click();
                return false;
            })
            .evaluate(function(videoList) {
              
              // var  videoList = [];
              //获取视频分类名称
              var $category = $('#pl-header .pl-header-content .pl-header-title');
              //获取订阅号信息
              var $channel = $('#pl-header .pl-header-content .pl-header-details li');

              $('#pl-load-more-destination .pl-video-title').each(function(){
                var $video = $(this).find('a');
                var item = {
                  channelName : $channel.find('a').text().trim(),
                  channelUrl : 'https://www.youtube.com' + $channel.find('a').attr('href'),
                  categoryVideos: Number(($channel.eq(1).text()).replace(/[^0-9]+/g,'')),
                  categoryViews: Number(($channel.eq(2).text()).replace(/[^0-9]+/g,'')),
                  categoryName : $category.text().trim(),
                  videoName : $video.text().trim(),
                  url : 'https://www.youtube.com' + $video.attr('href'),
                  duration : $(this).parent().find('.pl-video-time .timestamp').text().trim()
                };

                var videoReg = item.url.match(/v\=([a-zA-Z0-9_-]+)/);
                if(Array.isArray(videoReg)){
                  item.videoId = videoReg[1];
                }
                if(item.channelUrl.indexOf('channel')!==-1){
                  var channelReg = item.channelUrl.match(/channel\/([a-zA-Z0-9_-]+)/);
                  if(Array.isArray(channelReg)){
                    item.channelId = channelReg[1].substr(2);
                  }
                }
                if(item.channelUrl.indexOf('user')!==-1){
                  var channelReg2 = item.channelUrl.match(/user\/([a-zA-Z0-9_-]+)/);
                  if(Array.isArray(channelReg2)){
                    item.channelId = channelReg2[1];
                  }
                }
                
                videoList.push(item);
              });
              
              return videoList;
            },videoList)
            .then(function(videoList){
              return videoList;
            })
            .catch(function (error) {
              console.error('获取videoList failed:', error);
            });
        });
      }, Promise.resolve([])).then(function(videoList){
        nightmare.end(function(){
          //分类列表去重处理
          videoList = config.unique(videoList);
          //保存到数据库
          save.videoList(videoList);
          //获取当前日期
          var myDate = new Date();
          var localdate = myDate.toLocaleDateString();
          //将视频列表写入文件
          var filedata = JSON.stringify(videoList);
          fs.writeFile(__dirname+'/videoList'+localdate+'.json',filedata,function(err){
              if(err){
                console.log('write videoList failed!')
                return console.log(err);
              }
              console.log('write videoList successed!');
          });
          //打印分类列表信息
          console.log(videoList);
          console.log('视频列表长度'+videoList.length);
          console.timeEnd("程序运行时间");//结束运行时间
          });
      });
  });

// }
// setInterval(timer,config.timeDelay.spiderUrlTime);//定时器设置
// }

// }
// setInterval(timer,config.timeDelay.spiderUrlTime);//定时器设置
// }























//打印debug 设置：set debug=nightmare:node-crawler:crawler
//运行时防止后台溢出，可以尝试node crawler>console.txt
exports.informationIfo = function(){

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
    
    //视频订阅号信息
    information.channel = $('#watch-appbar-playlist .playlist-header .playlist-details .author-attribution').text().trim();
    information.channelUrl = 'https://www.youtube.com'+$('#watch-appbar-playlist .playlist-header .playlist-details .author-attribution a').attr('href')
    var chaReg = information.channelUrl.match(/channel\/([a-zA-Z0-9_-]+)/);
    if(Array.isArray(chaReg)){
      information.channelId = chaReg[1].substr(2);
    }

    //视频分类信息
    information.category = $('#watch-appbar-playlist .playlist-header .playlist-title').text().trim();
    information.categoryUrl = 'https://www.youtube.com'+$('#watch-appbar-playlist .playlist-header .playlist-title a').attr('href');
    var cateReg = information.categoryUrl.match(/list\=([a-zA-Z0-9_-]+)/);
    if(Array.isArray(cateReg)){
      information.categoryId = cateReg[1];
    }
    
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
    var indexReg = information.url.match(/index\=([0-9]+)/);
    if(Array.isArray(indexReg)){
      information.videoIndex = indexReg[1];
    }
    var filmLen = $('#watch-description-extras .watch-extras-section li').text().trim();
    var s = filmLen.match(/(\d+\:\d+\:\d+)/);
    if(Array.isArray(s)){
      information.filmLen = s[1];
    }
    //视频类别
    information.videoClass = $('#watch-description-extras .watch-extras-section li .content .g-hovercard').text();
    
    debug('获取视频详细信息:',information.url);//打印信息debug信息
    
    // //存入数据库
    // if(information.hasOwnProperty('videoId')){
    //  save.videoDetail(information,done);
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

}





  
  
  