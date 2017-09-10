var Nightmare = require('nightmare');
var nightmare = Nightmare();


var config = require('../config');
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
		
   nightmare.end(function(){
        console.log(categoryList);
        console.log(categoryList.length);
   });
     
		// });
});



// .evaluate(function(categoryList) {
          
//           //获取订阅号Id
//           var $channelName = $('#c4-primary-header-contents .branded-page-header-title a').attr('href');
//           if($channelName.indexOf('channel')!==-1){
//             var $channelId = $channelName.match(/channel\/([a-zA-Z0-9_-]+)/);
//           }

//           // var category = [];
//           $('#browse-items-primary .branded-page-module-title').each(function(){
//             var $category = $(this).find('a').first();
//             var item = {
//               categoryName : $category.text().trim(),
//               url : 'https://www.youtube.com' + $category.attr('href')
//             };
//             //根据URL判断为订阅号还是视频分类
//             if(item.url.indexOf('list')!==-1){
              
//               if(Array.isArray($channelId)){
//                 item.channelId = $channelId[1];
//               }           
//             }else{
//               var s = item.url.match(/channel\/([a-zA-Z0-9_-]+)/);
//               if(Array.isArray(s)){
//                 item.id = s[1];
//               }
//             }
//             //获取youtube某个订阅号下的视频分类
//             if(item.categoryName!==''&&item.hasOwnProperty('channelId')){
//               categoryList.push(item);
//             }
//           });
//           return categoryList;
//         },categoryList)