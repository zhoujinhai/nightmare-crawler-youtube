function timer(){

var Nightmare = require('nightmare');
var nightmare = Nightmare({
  switches: {
    'proxy-server': 'http://127.0.0.1:61481',
    'ignore-certificate-errors': true
  }
});
var fs = require('fs');

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
        // categoryList.push(category);
        return categoryList;
      })
      .catch(function (error) {
        console.error('获取categoryList failed:', error);
      });
  });
}, Promise.resolve([])).then(function(categoryList){
    nightmare.end(function(){
        //将视频列表写入文件
        var filedata = JSON.stringify(categoryList);
        // console.log(filedata);
        fs.writeFile(__dirname+'/categoryList.json',filedata,function(err){
            if(err){
              console.log('write categoryList failed!')
              return console.log(err);
            }
            console.log('write categoryList successed!');
        });
       //打印分类列表信息
        console.log(categoryList);
        console.log(categoryList.length);
    });
});

  
}
setInterval(timer,10000);
// var Nightmare = require('nightmare');       
// var nightmare = Nightmare({ show: true });//显示electron窗口

// var arr = [];

// nightmare
// //加载页面
// .goto('http://www.baidu.com')
// //等待选择器加载完毕，可以用数值（表示等待时间，单位毫秒）
// .wait('body')
// //浏览器内页面执行
// .evaluate(function(arr){
//   //这里外部的变量hello以参数的形式传了进来，可以用content获得。
//   var p = document.querySelector('#cp').innerText;
//   arr.push(p);
//   return arr;
// }, arr)
// //结束操作
// .end()
// //前面都是操作队列，需要有then方法才会触发执行上述队列的操作
// .then(function(res){//函数参数为evaluate的返回值
//   console.log(res);
// })
// //处理异常情况
// .catch(function (error) {
//   console.error('failed:', error);
// });