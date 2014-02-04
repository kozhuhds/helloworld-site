var HelloWorld = (function (){
	var hwSwipe = null,
		prevUrl = 'index',
		pages = ["index","company","projects","contacts"];

	var Init = {
		events: function (){
			$('.logo').on('click', function(){alert(1)});
			$('nav a').on('click', navigateToUrl);

			window.onpopstate = function (e){
				if (history.state.url == 'index') {
					$('.top-header').removeAttr('style');
					$('html').removeAttr('style');
					$('body').removeAttr('style');
				}else{
					highlightMenuItem(pages.indexOf(history.state.url)-1);
					$('body').css('overflow-y','scroll');
				}
				hwSwipe.slide(pages.indexOf(history.state.url));
			};

			$(document).on('keydown', function(e) {
				var pageNum = pages.indexOf(history.state.url);
				if(e.keyCode == 37 && pageNum != 0){
					hwSwipe.prev();
					if (pages[pageNum-1] == 'index') {
						$('.top-header').removeAttr('style');
						$('body').removeAttr('style');
						$('html').removeAttr('style');
						window.history.pushState({url: pages[pageNum-1]},null, "/");
					}else{
						window.history.pushState({url: pages[pageNum-1]},null, "/"+pages[pageNum-1]);
						highlightMenuItem(pages.indexOf(history.state.url)-1);
					}
				}
				else if(e.keyCode == 39 && pageNum < pages.length-1){
					$('body').css('overflow-y','scroll');
					window.history.pushState({url: pages[pageNum+1]},null, "/"+pages[pageNum+1]);
					hwSwipe.next();
					highlightMenuItem(pages.indexOf(history.state.url)-1);
				}

			});
		},
		initSwipe: function (el){
			hwSwipe = new Swipe(document.getElementById(el), {
				speed: 1000,
				disableScroll: true,
				stopPropagation: false,
				callback: function(index, elem) {},
				transitionEnd: function(index, elem) {
					if(prevUrl == 'index' && history.state.url != 'index'){
						$('.top-header').css('z-index',3);
						$('html').css('height', 'auto');
					}
				}
			});
		},
		initYandexMaps: function (id){
			var yaMapsScript = document.createElement('script');
 			yaMapsScript.type = 'text/javascript';
 			$('head').append(yaMapsScript);
 			yaMapsScript.addEventListener('load', function (e) {
 				ymaps.ready(function (){
					var map = new ymaps.Map(id, {
		                center: [53.855727,27.451387], // Default city
		                zoom: 16,
		                behaviors: ['default', 'scrollZoom']
		            });
		            var office = new ymaps.Placemark([53.855727, 27.451387], { 
            			hintContent: 'ул. К. Крапивы, 34', 
            			balloonContent: 'офис HelloWorld' 
        			});
        			map.geoObjects.add(office);
				});
 			}, false);
 			yaMapsScript.src = "https://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU";
		}
	};
	var highlightMenuItem = function (item){
		$('.inner-page-header nav ul').find('.active').removeClass('active');
		$('.inner-page-header nav ul li').eq(item).addClass('active');
	};
	var navigateToUrl = function (e, url){
		var toURL = e.target.getAttribute('href').split('/').pop();
		highlightMenuItem(pages.indexOf(toURL)-1);
		$('body').css('overflow-y','scroll');
		if (toURL == 'index') {
			$('top-header').removeAttr('style');
			$('html').removeAttr('style');
			$('body').removeAttr('style');
		};
		prevUrl = history.state.url;
		window.history.pushState({url: toURL},null, "/"+toURL);
		hwSwipe.slide(pages.indexOf(toURL));
		e.preventDefault();
	};
	return {
		init: function (){
			window.history.pushState({url:"index"},null, "/");
			Init.events();
			Init.initSwipe('slider');
			RetinaImages.init('image-src');
			//Init.initYandexMaps('maparea');
		}
	}
})();

window.onload = function (){
	HelloWorld.init();
}
