var Nightmare = require('nightmare');
var nightmare = new Nightmare({
	show : true,
	waitTimeout : 150000
})

nightmare
	.goto('http://shuju.sxw100.com/search/university.html')
	.wait(function(){
		document.querySelector('.areas .all a').click();
		return true;
	})
	.wait(function(){
		window.universityList=[];
		return true;
	})
	.wait(function(){
		
		var List = document.querySelectorAll('.academy-name a');

		for(var i=0;i<List.length;i++){
			universityList.push(List[i].innerText);
		}

		var nextPage = document.querySelector('.vkopage_next');
		if(/vkopage_disabled/.test(nextPage.classList.value)){
			return true;
		}
		if(nextPage){
			nextPage.click();
			return false;
		}
	})
	.evaluate(function(){
		return universityList;
	})
	.end()
	.then(function(res){
		console.log(res,res.length);
	})
	.catch(function(err){
		console.log('failed',err);
	})
	