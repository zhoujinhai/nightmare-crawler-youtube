var Nightmare = require('nightmare');
var nightmare = Nightmare();


var config = require('./config');
var urls = config.urls;//获取订阅号URL列表

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
      .evaluate(function() {
        
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
            category.push(item);
          }
        });
        return category;
      })
      .then(function(category){
        categoryList.push(category);
        return categoryList;
      })
      .catch(function (error) {
        console.error('Search failed:', error);
      });
  });
}, Promise.resolve([])).then(function(categoryList){
		//重新整理分类列表
    	var newcategoryList = [];
    	for(var i=0;i<categoryList.length;i++){
    		for(var j=0;j<categoryList[i].length;j++){
    			newcategoryList.push(categoryList[i][j]);
    		}
    	}
    	// 获取视频列表;
    	newcategoryList.reduce(function(accumulator, cate) {
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
		      .evaluate(function() {
		        
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
		              video.push(item);
		          }
		        });
		        
		        return video;
		      })
		      .then(function(video){
		        videoList.push(video);
		        return videoList;
		      })
          .catch(function (error) {
            console.error('Search failed:', error);
          });
		  });
		}, Promise.resolve([])).then(function(videoList){
		  // nightmare.end(function(){
		  	//重新整理分类列表
		    var newvideoList = [];
	      for(var i=0;i<videoList.length;i++){
	    		for(var j=0;j<videoList[i].length;j++){
	    			newvideoList.push(videoList[i][j]);
	    		}
	    	}
        newvideoList = config.unique(newvideoList);//分类列表去重处理
		    // console.log(newvideoList);
		    // console.log(newvideoList.length);
        newvideoList.reduce(function(accumulator, video) {
            return accumulator.then(function(informationList) {
              return nightmare.goto(video.url)
                .inject('js', 'jquery.min.js')
                .evaluate(function() {
                  
                var information = {};
                information.url = 'https://www.youtube.com'+$('#playlist-autoscroll-list .currently-playing a').attr('href');
                information.videoName = $('#watch-headline-title').text().trim();
                information.pubTime = $('#watch-uploader-info').text().trim();
                information.intro = $('#watch-description-text').text().trim();
                
                var filmLen = $('#watch-description-extras .watch-extras-section li').text().trim();
                var s = filmLen.match(/(\d+\:\d+\:\d+)/);
                if(Array.isArray(s)){
                  information.filmLen = s[1];
                }
                
                return information;
                  
                })
                .then(function(information){
                  console.log(information);
                  informationList.push(information);
                  return informationList;
                })
                .catch(function (error) {
                  console.error('Search failed:', error);
                });
            });
          }, Promise.resolve([])).then(function(informationList){
             nightmare.end(function(){
                  console.log(informationList);
                  console.log(informationList.length);
             });
          });
		  });
		// });
});