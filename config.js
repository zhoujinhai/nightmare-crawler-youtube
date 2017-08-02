exports.urls = [
  'https://www.youtube.com/channel/UCYfdidRxbB8Qhf0Nx7ioOYw',//news
  'https://www.youtube.com/channel/UC-9-kyTW8ZkZNDHQJ6FgpwQ',//musics
  'https://www.youtube.com/channel/UCEgdi0XIXXZ-qJOFPf4JSKw',//physical
  'https://www.youtube.com/channel/UClgRkhTL3_hImCAmdLfDE4g',//movies
  'https://www.youtube.com/channel/UCOpNcN46UbXVtpKMrmU4Abg' //games
];

exports.videoList = 
[{  sequence: '1',
    url: 'https://www.youtube.com/watch?v=sjhbO8lIc2s&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=1',
    videoName: '君の名は。' },
  { categoryName: '最卖座电影',
    sequence: '2',
    url: 'https://www.youtube.com/watch?v=K3mKsAuYdAo&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=2',
    videoName: 'ミニオンズ (吹替版)' },
  { categoryName: '最卖座电影',
    sequence: '3',
    url: 'https://www.youtube.com/watch?v=TLWNfXEFx7A&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=3',
    videoName: 'キングコング：髑髏島の巨神(吹替版)' },
  { categoryName: '最卖座电影',
    sequence: '4',
    url: 'https://www.youtube.com/watch?v=xHTCTR-hdR4&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=4',
    videoName: 'シン・ゴジラ' },
  { categoryName: '最卖座电影',
    sequence: '5',
    url: 'https://www.youtube.com/watch?v=cHMfW5gpNIo&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=5',
    videoName: 'モアナと伝説の海 (吹替版)' },
  { categoryName: '最卖座电影',
    sequence: '6',
    url: 'https://www.youtube.com/watch?v=Mst0hELyBFI&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=6',
    videoName: '怪盗グルーの月泥棒 (吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '7',
    url: 'https://www.youtube.com/watch?v=oh8ycI84KP4&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=7',
    videoName: 'キングコング：髑髏島の巨神(字幕版)' },
  { categoryName: '最卖座电影',
    sequence: '8',
    url: 'https://www.youtube.com/watch?v=cIgFiJoneNM&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=8',
    videoName: '怪盗グルーのミニオン危機一発 (吹替版)' },
  { categoryName: '最卖座电影',
    sequence: '9',
    url: 'https://www.youtube.com/watch?v=jJcMEgP1bEc&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=9',
    videoName: 'カーズ (日本語吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '10',
    url: 'https://www.youtube.com/watch?v=24nAhuK-TXk&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=10',
    videoName: 'ジュラシック・ワールド  （吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '11',
    url: 'https://www.youtube.com/watch?v=N9ykdWHueL0&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=11',
    videoName: 'パイレーツ・オブ・カリビアン／生命の泉 （日本語吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '12',
    url: 'https://www.youtube.com/watch?v=RdfBkztPp1w&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=12',
    videoName: 'トランスフォーマー/ ロストエイジ (日本語吹替版)' },
  { categoryName: '最卖座电影',
    sequence: '13',
    url: 'https://www.youtube.com/watch?v=YnZuD89gLY4&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=13',
    videoName: 'カーズ２ （日本語吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '14',
    url: 'https://www.youtube.com/watch?v=8afiX3ieV58&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=14',
    videoName: 'xXxトリプルX：再起動（吹替版）' },
  { categoryName: '最卖座电影',
    sequence: '15',
    url: 'https://www.youtube.com/watch?v=tcaSVaJS1WU&list=PLHPTxTxtC0iaN9kA37m6MRrxFkgby2CDR&index=15',
    videoName: 'この世界の片隅に' }];


//去重函数
exports.unique = function(arr){
  var ret=[];
  var hash={};
  for(var i=0;i<arr.length;i++){
    var item=arr[i];
    var s = item.url.match(/v\=([a-zA-Z0-9_-]+)/);
    var key = typeof(item)+s[1];
    if(hash[key]!==1){
      ret.push(item);
      hash[key] =1;
    }
  }
  return ret;
};