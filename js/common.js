var HelloWorld = (function (){
	var hwSwipe = null,
		pages = ["index","company","projects","contacts"],
		pagesNames = ["Главная", "Компания", "Проекты", "Контакты"],
		isMobile = jQuery.browser.mobile,
		isIE = navigator.appVersion.indexOf('MSIE') != -1,
		$slider,
		callFromPopState,
		map,
		officePlacemark,
		yMapsReady = false,
		socButsReady = false;

	var Init = {
		events: function (){
			$('.logo a').on('click', navigateToUrl);
			$('nav a').on('click', navigateToUrl);

			window.onpopstate = function (e){
				if (window.history.state) {
					callFromPopState = window.history.state.isFirstRender?false:true;
				};
				if (getCurrentURL() == 'index') {
					$('.top-header').removeAttr('style');
					$('html').removeAttr('style');
					setTimeout(function(){$('body').removeAttr('style');}, 200);
				}else{
					highlightMenuItem(pages.indexOf(getCurrentURL())-1);
				}
				hwSwipe.slide(pages.indexOf(getCurrentURL()));
			};
			if (isIE) {
				window.onhashchange = function (){
					navigateToUrl(null, getCurrentURL());
				};
			}
			$(window).on('resize', function (e){
				$slider.find('.page-item').css('visibility','hidden');
				if (getCurrentURL() != 'index'){ 
					setTimeout(function(){
						changePageHeight($slider.find('.page-item').eq(pages.indexOf(getCurrentURL())));
						map&&map.container.fitToViewport();
						$slider.find('.page-item').css('visibility','visible');
						$('.top-header').show();
					},250);
				}else{
					$('.top-header').hide();
					setTimeout(function(){
						$slider.find('.page-item').css('visibility','visible'); 
						$('.top-header').show();
					}, 300)
				}
			});

			$(document).on('keydown', function(e) {
				var pageNum = pages.indexOf(getCurrentURL());
				if(e.keyCode == 37 && pageNum != 0){
					hwSwipe.prev();
					if (pages[pageNum-1] == 'index') {
						$('.top-header').removeAttr('style');
						setTimeout(function(){$('body').removeAttr('style');}, 200);
						$('html').removeAttr('style');
					}else{
						highlightMenuItem(pages.indexOf(getCurrentURL())-1);
						$('html').css('height', 'auto');
					}
				}
				else if(e.keyCode == 39 && pageNum < pages.length-1){
					hwSwipe.next();
					highlightMenuItem(pages.indexOf(getCurrentURL())-1);
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
					map && map.geoObjects.remove(officePlacemark);
					$slider.find('.page-item.active').removeClass('active');
					$(elem).addClass('active');
					if (index) {
						changePageHeight(elem);
						if (!callFromPopState && !isIE) {
							window.history.pushState({url: pages[index]},null, "/"+pages[index]);
						}else if(isIE){
							window.location.href = "#" + pages[index];
						}
						$('body').css('overflow-y','scroll');
						document.title = "HELLO WORLD - " + pagesNames[index];
					}else {
						document.title = "HELLO WORLD";
						if (isMobile) {
							$('.swipe-wrap').height(542);
						}else{
							$('.swipe-wrap').height('100%');
							$slider.height('100%');
						}
						if (!callFromPopState && !isIE) {
							window.history.pushState({url: pages[index]},null, "/");
						}else if(isIE){
							window.location.href = "#" + pages[index];
						}

					}
					callFromPopState = false;
				},
				transitionEnd: function(index, elem) {
					if(index){
						$('.top-header').css('z-index',3);
						$slider.css('height', 'auto');
					}
        			map&&map.geoObjects.add(officePlacemark);
				},
				beforeTransitionStart: function(index, elem){

				}
			});
		},
		initYandexMaps: function (id){
			if (!isMobile) {
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
			            officePlacemark = new ymaps.Placemark([53.855727, 27.451387], { 
	            			hintContent: 'ул. К. Крапивы, 34', 
	            			balloonContent: 'офис HelloWorld' 
	        			});
	        			yMapsReady = true;
						if (socButsReady)
							$('.ui.dimmer').hide();
					});
	 			}, false);
	 			yaMapsScript.src = "https://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU";
 			}else{
	        	yMapsReady = true;
				if (socButsReady)
					$('.ui.dimmer').hide();
 				$('<a href="http://maps.yandex.ru/?text=%D0%91%D0%B5%D0%BB%D0%B0%D1%80%D1%83%D1%81%D1%8C%2C%20%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%2C%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9A%D0%BE%D0%BD%D0%B4%D1%80%D0%B0%D1%82%D0%B0%20%D0%9A%D1%80%D0%B0%D0%BF%D0%B8%D0%B2%D1%8B%2C%2034&sll=27.451347%2C53.855728&ll=27.451996%2C53.855735&spn=0.016952%2C0.005804&z=17&l=map"><img image-src="http://helloworld.by/new/images/map.png" alt="Map"/></a>').appendTo('#'+id);
 				$('#'+id).height('auto');
 			}
		},
		initSocialButs: function (){
			var addthis_config = {"data_track_addressbar":false};
			var script = document.createElement('script');
			script.type = 'text/javascript';
			$('head').append(script);
			script.addEventListener('load', function (e){
				socButsReady = true;
				if (yMapsReady)
					$('.ui.dimmer').hide();
			});
			script.src = "https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-524c09124504d34d";
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
			$('.swipe-wrap').height(542);

		},
		initUrl: function (){
			if (isIE && !getCurrentURL()){
				window.location.href = '#';
			}else if (isIE){
			 	navigateToUrl(null, getCurrentURL());
			}else if (getCurrentURL() == 'index' || !getCurrentURL()){
				window.history.pushState({url:"index", isFirstRender: true},null, "/");
			}else{
				navigateToUrl(null, getCurrentURL());
			}
		}
	};
	var	getCurrentURL = function (){
		var activeURL;
		if (!window.history.state && !isIE) {
			activeURL = 'index';
		}else{
			activeURL = isIE?window.location.href.toString().split(window.location.host)[1].split('#')[1]:window.history.state.url;
		}
		activeURL = activeURL == ''? 'index':activeURL;
		return activeURL;
	};
	var changePageHeight = function (page){
		if(!$(page).hasClass('mainpage-item')){
			$('.swipe-wrap').height($(page).height());
		}
	};
	var highlightMenuItem = function (item){
		if (!isMobile) {
			$('.top-header-i nav ul').find('.active').removeClass('active');
			$('.top-header-i nav ul li').eq(item).addClass('active');
		}
	};
	var navigateToUrl = function (e, url){
		var toURL;
		if (url) {
			toURL = !isIE ? url.split('/').pop():url;
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
		if (e)
			e.preventDefault();
		
	};

	return {
		init: function (){
			$('.ui.dimmer').show();
			$('.top-header').addClass('show');
			Init.initSwipe('#slider');
			Init.initUrl();
			if (isMobile) {
				Init.renderForMobile($('.top-header'));
			}
			Init.events();
			Init.initYandexMaps('maparea');
			Init.initSocialButs();
			RetinaImages.init('image-src');
		}
	}
})();

window.onload = function (){
	HelloWorld.init();
}
