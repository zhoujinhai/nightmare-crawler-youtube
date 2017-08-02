var Nightmare = require('nightmare');
// var nightmare = Nightmare({
//   switches: {
//     'proxy-server': 'http://127.0.0.1:61481',
//     'ignore-certificate-errors': true
//   }
// });
var nightmare = Nightmare();
var config = require('./config');
var videos = config.videoList;

videos.reduce(function(accumulator, video) {
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
        informationList.push(information);
        return informationList;
      });
  });
}, Promise.resolve([])).then(function(informationList){
   nightmare.end(function(){
        console.log(informationList);
        console.log(informationList.length);
   });
});