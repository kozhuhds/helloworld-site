var HelloWorld = (function (){
	var hwSwipe = null,
		pages = ["index","company","projects","contacts"],
		isMobile = jQuery.browser.mobile,
		$slider,
		callFromPopState;

	var Init = {
		events: function (){
			$('.logo a').on('click', navigateToUrl);
			$('nav a').on('click', navigateToUrl);

			window.onpopstate = function (e){
				callFromPopState = history.state.isFirstRender?false:true;
				if (history.state.url == 'index') {
					$('.top-header').removeAttr('style');
					$('html').removeAttr('style');
					setTimeout(function(){$('body').removeAttr('style');}, 200);
				}else{
					highlightMenuItem(pages.indexOf(history.state.url)-1);
					$('body').css('overflow-y','scroll');
				}
				hwSwipe.slide(pages.indexOf(history.state.url));
			};

			$(window).on('resize', function (e){
				if(isMobile)
					setTimeout(function(){changePageHeight($slider.find('.page-item').eq(pages.indexOf(history.state.url)));},100);
			});

			$(document).on('keydown', function(e) {
				var pageNum = pages.indexOf(history.state.url);
				if(e.keyCode == 37 && pageNum != 0){
					hwSwipe.prev();
					if (pages[pageNum-1] == 'index') {
						$('.top-header').removeAttr('style');
						setTimeout(function(){$('body').removeAttr('style');}, 200);
						$('html').removeAttr('style');
					}else{
						highlightMenuItem(pages.indexOf(history.state.url)-1);
						$('html').css('height', 'auto');
					}
				}
				else if(e.keyCode == 39 && pageNum < pages.length-1){
					$('body').css('overflow-y','scroll');
					hwSwipe.next();
					highlightMenuItem(pages.indexOf(history.state.url)-1);
				}
			});
		},
		initSwipe: function (id){
			$slider = $(id);
			hwSwipe = new Swipe($slider[0], {
				speed: 400,
				stopPropagation: false,
				callback: function(index, elem) {
					if (index) {
						changePageHeight(elem);
						if (!callFromPopState) {
							window.history.pushState({url: pages[index]},null, "/"+pages[index]);
						}
					}else{
						if (!callFromPopState) {
							window.history.pushState({url: pages[index]},null, "/");
						}
						$('.swipe-wrap').height('100%');
						$slider.css('height', '100%');
					}
					callFromPopState = false;
				},
				transitionEnd: function(index, elem) {
					if(index){
						$('.top-header').css('z-index',3);
						$slider.css('height', 'auto');
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
		},
		renderForMobile: function ($header){
			$header.addClass('mobile');
			$.each($slider.find('.page-item'), function (key, el){
				if(!$(el).hasClass('mainpage-item')){
					$header.clone()
						.insertBefore($(el).find('.page-wrapper'))
						.find('div nav ul li').eq(key-1).addClass('active');
				}
			});
			$('.page-wrapper').addClass('mobile');
			$header.remove();
		}
	};
	var changePageHeight = function (page){
		if(!$(page).hasClass('mainpage-item')){
			$('.swipe-wrap').height($(page).height());
		}
	};
	var highlightMenuItem = function (item){
		if (!isMobile) {
			$('.inner-page-header nav ul').find('.active').removeClass('active');
			$('.inner-page-header nav ul li').eq(item).addClass('active');
		}
	};
	var navigateToUrl = function (e, url){
		var toURL;
		if (!e.target.getAttribute('href')){
			toURL = e.target.parentNode.getAttribute('href').split('/').pop();
		}else{
			toURL = e.target.getAttribute('href').split('/').pop();
		}

		$('body').css('overflow-y','scroll');
		if (toURL == 'index') {
			$('.top-header').removeAttr('style');
			$('html').removeAttr('style');
			setTimeout(function(){$('body').removeAttr('style');}, 300);
		}else{
			highlightMenuItem(pages.indexOf(toURL)-1);
		}
		hwSwipe.slide(pages.indexOf(toURL));
		e.preventDefault();
	};

	return {
		init: function (){
			$('.top-header').addClass('show');
			window.history.pushState({url:"index", isFirstRender: true},null, "/");
			Init.initSwipe('#slider');
			RetinaImages.init('image-src');
			if (isMobile) {
				Init.renderForMobile($('#main-header'));
			}
			Init.events();

			//Init.initYandexMaps('maparea');
		}
	}
})();

window.onload = function (){
	HelloWorld.init();
}
