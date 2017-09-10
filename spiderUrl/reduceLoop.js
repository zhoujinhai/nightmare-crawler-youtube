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
              
              // var  videos = [];
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
          打印分类列表信息
          console.log(videoList);
          console.log('视频列表长度'+videoList.length);
          console.timeEnd("程序运行时间");//结束运行时间
          });
      });
  });

// }
// setInterval(timer,config.timeDelay.spiderUrlTime);//定时器设置
// }