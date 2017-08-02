var Nightmare = require('nightmare');
var nightmare = Nightmare({
  switches: {
    'proxy-server': 'http://127.0.0.1:61481',
    'ignore-certificate-errors': true
  }
});
var fs = require('fs');

var config = require('./config');
var urls = config.urls;//获取订阅号URL列表

console.time("程序运行时间");//开始运行时间
urls.reduce(function(accumulator, url) {
  return accumulator.then(function(categoryList) {
    return nightmare.goto(url)
      .inject('js', 'jquery.min.js')
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
        
        //获取订阅号Id
        var $channelName = $('#c4-primary-header-contents .branded-page-header-title a').attr('href');
        var $channelId = $channelName.match(/channel\/([a-zA-Z0-9_-]+)/);
        
        var category = [];
        $('#browse-items-primary .branded-page-module-title').each(function(){
          var $category = $(this).find('a').first();
          var item = {
            categoryName : $category.text().trim(),
            url : 'https://www.youtube.com' + $category.attr('href')
          };
          //根据URL判断为订阅号还是视频分类
          if(item.url.indexOf('list')!==-1){
            if(Array.isArray($channelId)){
              item.channelId = $channelId[1];
            }           
          }else{
            var s = item.url.match(/channel\/([a-zA-Z0-9_-]+)/);
            if(Array.isArray(s)){
              item.id = s[1];
            }
          }
          //获取youtube某个订阅号下的视频分类
          if(item.categoryName!==''&&item.hasOwnProperty('channelId')){
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
        return nightmare.goto(cate.url)
          .inject('js', 'jquery.min.js')
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
            
            var  video = [];
            //获取视频分类名称
            var $category = $('#pl-header .pl-header-content .pl-header-title').text().trim();
            $('#pl-video-table tr .pl-video-title').each(function(){
              var $video = $(this).find('a');
              var item = {
                categoryName : $category,
                videoName : $video.text().trim(),
                url : 'https://www.youtube.com' + $video.attr('href')
              };
              var s = item.url.match(/index\=(\d+)/);
              if(Array.isArray(s)){
                  item.sequence = s[1];
                  //获取youtube某个订阅号下的某个视频分类下的所有视频列表
                  videoList.push(item);
              }
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
        //将视频列表写入文件
        var filedata = JSON.stringify(videoList);
        fs.writeFile(__dirname+'/videoList.json',filedata+'\n',function(err){
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