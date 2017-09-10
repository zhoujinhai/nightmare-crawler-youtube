var Nightmare = require('nightmare');       
var nightmare = Nightmare({ 
	show: true//显示electron窗口
	// waitTimeout : 5000
});

nightmare
	//加载页面
	.header({
		'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    	'Accept-Encoding':'gzip, deflate, sdch, br',
    	'Accept-Language':'en,zh-CN,zh;q=0.8'
	})
	.goto('https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ')
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
        
        var category = [];
        $('#browse-items-primary .branded-page-module-title').each(function(){
          var $category = $(this).find('a').first();
          var item = {
            categoryName : $category.text().trim(),
            url : 'https://www.youtube.com' + $category.attr('href')
          };
          //根据URL判断为订阅号还是视频分类
          if(item.url.indexOf('list')!==-1){
            category.push(item);
          }
          
        });
        return category;
      })
      
	
	.then(function(res){
	  console.log(res,res.length);
	})
	.catch(function (error) {
	  console.error('failed:', error);
	});
