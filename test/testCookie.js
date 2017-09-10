
var Nightmare = require('nightmare');       
var nightmare = Nightmare({ 
	show: true//显示electron窗口
	// waitTimeout : 5000
});

var categoryList =[];
nightmare
	//加载页面
	.header({
            'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch, br',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'cookie':'VISITOR_INFO1_LIVE=p2qkFRD9Xu8; WKcs6.resume=esAwALiiaRs:1626,s89cdtEGQjE:1484,-QIMOYwDbgI:1415,2F0D-9zVIR0:1452; YSC=y__30O_as5A; SID=FgV6XKyTgGHbX2r2EHh2M5EcoYKQhCmSOxLcggp5H2-Oi28JgJVY9QpkmylrskdjEawwKQ.; HSID=AzptDxTftUVsH8VcV; SSID=A0ha2qetTQwg94Xpj; APISID=Z2ceqoFg2WbemZC8/AxxqT5XHGPMQbLkrp; SAPISID=QRl_4F4CRo3llYqm/Ab_SADUbpJGGlyL9O; CONSENT=YES+CN.zh-CN+20170702-09-0; LOGIN_INFO=AHmGWrAwRgIhAMmZgC1Z_bapx_6irVJuwF4VNSSbVlHRvc0SQB7wQ66TAiEA5bavVCzVB9YbhXnk5Jp3AKXcrBn5vB1h3h3LVMbq430:QUIxb0R6S3ZCUDFUNDlGZGRES2I4bHdibzROdG1LQWFLYlRvMmg0Q3VfcVVZYVFzYzUzNnZ2N0xxVmZjRVZ1eGtsdGdfOWpQbXpNNm5fdkdYQ19lSXJtX0ZGTjU4WFNrdExkaDVQLWNOQlgxQUFoeDNRTFVLOWZsZTRHRTVZT1pjZEYwaFdGZHJqRHNzTC1JamNWZVVWUzF3VVRjOU5jdnNCZ2dOdFl4dWtpSVBqM1NHQUhJYi1r; s_gl=1d69aac621b2f9c0a25dade722d6e24bcwIAAABVUw==; _ga=GA1.2.202533372.1500541775; _gid=GA1.2.237175071.1503478057; _gat=1; PREF=f5=20030&f1=50000000&al=zh-CN&gl=US&hl=zh-CN',
        })
    .goto('https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ')
    .inject('js', __dirname+'/jquery.min.js')
    .wait(function() {
        //模拟点击加载更多
        var loadMoreText = document.querySelector('.load-more-text');
        if (loadMoreText === null){
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
    .end()
    .then(function(categoryList){
      console.log(categoryList,categoryList.length);
    })
    .catch(function (error) {
      console.error('获取categoryList failed:', error);
    });


