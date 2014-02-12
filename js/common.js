var HelloWorld = (function (){
	var hwSwipe = null,
		pages = ["index","company","projects","contacts"],
		isMobile = jQuery.browser.mobile,
		$slider,
		callFromPopState,
		map;

	var Init = {
		events: function (){
			$('.logo a').on('click', navigateToUrl);
			$('nav a').on('click', navigateToUrl);

			window.onpopstate = function (e){
				callFromPopState = window.history.state.isFirstRender?false:true;
				if (window.history.state.url == 'index') {
					$('.top-header').removeAttr('style');
					$('html').removeAttr('style');
					setTimeout(function(){$('body').removeAttr('style');}, 200);
				}else{
					highlightMenuItem(pages.indexOf(window.history.state.url)-1);
				}
				hwSwipe.slide(pages.indexOf(window.history.state.url));
			};

			$(window).on('resize', function (e){
				if (window.history.state.url != 'index') 
					setTimeout(function(){
						changePageHeight($slider.find('.page-item').eq(pages.indexOf(window.history.state.url)));
						map.container.fitToViewport();
					},100);
			});

			$(document).on('keydown', function(e) {
				var pageNum = pages.indexOf(window.history.state.url);
				if(e.keyCode == 37 && pageNum != 0){
					hwSwipe.prev();
					if (pages[pageNum-1] == 'index') {
						$('.top-header').removeAttr('style');
						setTimeout(function(){$('body').removeAttr('style');}, 200);
						$('html').removeAttr('style');
					}else{
						highlightMenuItem(pages.indexOf(window.history.state.url)-1);
						$('html').css('height', 'auto');
					}
				}
				else if(e.keyCode == 39 && pageNum < pages.length-1){
					hwSwipe.next();
					highlightMenuItem(pages.indexOf(window.history.state.url)-1);
				}
			});
		},
		initSwipe: function (id){
			$slider = $(id);
			hwSwipe = new Swipe($slider[0], {
				speed: 400,
				stopPropagation: false,
				continuous: false,
				callback: function(index, elem) {
					if (index) {
						changePageHeight(elem);
						if (!callFromPopState) {
							window.history.pushState({url: pages[index]},null, "/"+pages[index]);
						}
						$('body').css('overflow-y','scroll');
						document.title = "HELLO WORLD - " + pages[index].charAt(0).toUpperCase() + pages[index].slice(1);
					}else {
						document.title = "HELLO WORLD";
						if (isMobile) {
							$('.swipe-wrap').height(662);
						}else{
							$('.swipe-wrap').height('100%');
							$slider.height('100%');
						}
						if (!callFromPopState) {
							window.history.pushState({url: pages[index]},null, "/");
						}

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
					map = new ymaps.Map(id, {
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
			$('html').addClass('mobile-ver');
			$('.swipe-wrap').height(662);

		},
		initUrl: function (){
			// var curURL = window.location.href.toString().split(window.location.host)[1];
			// if(curURL == '/'){
				window.history.pushState({url:"index", isFirstRender: true},null, "/");
			// }else{
			// 	navigateToUrl(curURL);
			// }
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
		if (url) {
			toURL = url.split('/').pop();
		}else{
			if (!e.target.getAttribute('href')){
				toURL = e.target.parentNode.getAttribute('href').split('/').pop();
			}else{
				toURL = e.target.getAttribute('href').split('/').pop();
			}
		}

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
			Init.initUrl();
			Init.initSwipe('#slider');
			RetinaImages.init('image-src');
			if (isMobile) {
				Init.renderForMobile($('#main-header'));
			}
			Init.events();
			Init.initYandexMaps('maparea');
		}
	}
})();

window.onload = function (){
	HelloWorld.init();
}
