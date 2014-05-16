var HelloWorld = (function (){
	var hwSwipe = null,
		pages = ["index","company","projects","contacts", "projects/loyalbill"],
		pagesNames = ["Главная", "Компания", "Проекты", "Контакты", "Loyalbill"],

		isMobile = jQuery.browser.mobile,
		isIE = navigator.appVersion.indexOf('MSIE') != -1,
		$slider,
		$swipewrap,
		callFromPopState,
		map,
		officePlacemark,
		socButsFirstOpened = true,
		mapFirstOpened = true;

	var Init = {
		events: function (){
			$('.menu-hider').on('click', this.openMenu);
			$('.top-menu-hider').on('click', this.openMenu);
			$('.logo a').on('click', navigateToUrl);
			$('.bottom-navigation a, .top-navigation a, .project-items .project-item a, .back, .back-960, .back-320').on('click', navigateToUrl);

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
				!isMobile && pageItemsHandler();
				$slider.find('.page-item').css('visibility','hidden');
				if (getCurrentURL() != 'index'){ 
					setTimeout(function(){
						changePageHeight($slider.find('.page-item').eq(pages.indexOf(getCurrentURL())));
						map && map.container.fitToViewport();
						$slider.find('.page-item').css('visibility','visible');
						$('.top-header').show();
					},250);
				}else{
					changePageHeight($slider.find('.page-item').eq(pages.indexOf(getCurrentURL())));
					$('.top-header').hide();
					setTimeout(function(){
						$slider.find('.page-item').css('visibility','visible'); 
						$('.top-header').show();
					}, 250);
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
				else if(e.keyCode == 39 && pageNum < 3){
					hwSwipe.next();
					highlightMenuItem(pages.indexOf(getCurrentURL())-1);
				}
			});
		},

		openMenu: function (e) {
			$('.menu-hider').next().toggleClass('active');
			$('.menu-hider').toggleClass('active');
			$('.top-navigation').toggleClass('active');
			$('.top-menu-hider').toggleClass('active');
			$('.top-header-i .social-buts').toggleClass('active');
			$('.top-header').toggleClass('active');
			$('.page-wrapper').toggleClass('active');
			changePageHeight($('.page-item.active'));
			e.preventDefault();
		},
		initSwipe: function (id, wrap, startSlide){
			$slider = $(id);
			$swipewrap = $(wrap);

			hwSwipe = new Swipe($slider[0], {
				speed: 400,
				stopPropagation: false,
				continuous: false,
				startSlide: startSlide,
				callback: function(index, elem) {
					map && map.geoObjects.remove(officePlacemark);
					$slider.find('.page-item.active').removeClass('active');
					$(elem).addClass('active');
					if (index) {
						$swipewrap.css('max-height', 'none');
						changePageHeight(elem);
						if (socButsFirstOpened ) {
							Init.initSocialButs();
							socButsFirstOpened = false;
						};
						if (index == 3 && mapFirstOpened) {
							Init.initYandexMaps('maparea');
							mapFirstOpened = false;
							changePageHeight(elem);
							//isMobile && $swipewrap.height(663);
						};
						if (!callFromPopState && !isIE) {
							window.history.pushState({url: pages[index]},null, "/"+pages[index]);
						}else if(isIE){
							window.location.href = "#" + pages[index];
						}
						$('html').css('overflow-y','scroll');
						document.title = "HELLO WORLD - " + pagesNames[index];
					}else {
						document.title = "HELLO WORLD";
						changePageHeight(elem);
						if (!callFromPopState && !isIE) {
							window.history.pushState({url: pages[index]},null, "/");
						}else if(isIE){
							window.location.href = "#";
						}
					}
					callFromPopState = false;
				},
				transitionEnd: function(index, elem) {
					!isMobile && pageItemsHandler();
					if(index){
						$('.top-header').css('z-index',3);
						$slider.css('height', 'auto');
					}
        			map&&map.geoObjects.add(officePlacemark);
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
			                //behaviors: ['default', 'scrollZoom']
			            });
			            //map.behaviors.get('scrollZoom')
			            officePlacemark = new ymaps.Placemark([53.855727, 27.451387], { 
	            			hintContent: 'ул. К. Крапивы, 34', 
	            			balloonContent: 'офис HelloWorld' 
	        			});
	        			map&&map.geoObjects.add(officePlacemark);
	        			$('.dimmer').hide();
					});
	 			}, false);
	 			yaMapsScript.src = "https://api-maps.yandex.ru/2.0/?load=package.full&lang=ru-RU";
 			}else{
 				$('#'+id).height('auto');
	        	$('.dimmer').hide();
	        	//changePageHeight($slider.find('.page-item').eq(3));
 			}
		},
		initSocialButs: function (){
			var script = document.createElement('script');
			script.type = 'text/javascript';
			$('head').append(script);
			script.addEventListener('load', function (e) {
				stLight.options({publisher: "1af3a253-f828-450c-b546-b1732ccadb68", doNotHash: false, doNotCopy: false, hashAddressBar: false});
 				var $buts = $('<span class="facebook-like-btn"><iframe src="http://www.facebook.com/plugins/like.php?locale=en_US&app_id=101025366657087&amp;href=http%3A%2F%2Fhelloworld.by&amp;send=false&amp;layout=button_count&amp;width=160&amp;show_faces=false&amp;action=like&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:160px; height:21px;" allowTransparency="true"></iframe></span></span><span class="st_twitter_hcount" displayText="Tweet"></span>');
 				if (!isMobile) {
	 				$buts.appendTo('.social-buts');
	 				$buts.clone().appendTo('.project-social-buts');
 				}else{
					$.each($slider.find('.page-item'), function (key, el){
						if(!$(el).hasClass('mainpage-item')){
							$buts.clone()
	 							.appendTo($(el).find('.social-buts'));
						}
					});
 				}
 			}, false);
			script.src = "http://w.sharethis.com/button/buttons.js";
		},
		renderForMobile: function ($header){
			$header.addClass('mobile');
			$.each($slider.find('.page-item'), function (key, el){
				if(!$(el).hasClass('mainpage-item')){
					var $new_elem = $header.clone();
					$new_elem.insertBefore($(el).find('.page-wrapper'));
					if (key >=4) {
						$new_elem.find('.top-navigation li').eq(1).addClass('active');
					}else{
						$new_elem.find('.top-navigation li').eq(key-1).addClass('active');
					}
						

				}
			});
			$('.page-wrapper').addClass('mobile');
			$header.remove();
			$('html').addClass('mobile-ver');
		},
		initByUrl: function (){
			var url = getCurrentURL(),
				path = url == 'index' ? "/" : "/" + url,
				pageNum = pages.indexOf(url);

			Init.initSwipe('#slider', '.swipe-wrap', pageNum);
			var $page = $slider.find('.page-item').eq(pageNum);

			if(isIE){
 				window.location.href = url == 'index' ? '#' : '#'+url;
 			}else{
 				window.history.pushState({url:url, isFirstRender: true}, null, path);
 			}
			if (path != '/') {
				if (socButsFirstOpened ) {
					Init.initSocialButs();
					socButsFirstOpened = false;
				};
				$('.top-header').css('z-index',3);
				if (pages.indexOf(url) > 3) {
					highlightMenuItem(1);
				}else{
					highlightMenuItem(pages.indexOf(url)-1);
				}
				$slider.css('height', 'auto');
				setTimeout(function () {
					changePageHeight($page);
					!isMobile && pageItemsHandler();
				}, 1000);
			};
			changePageHeight($page);
			if (url == 'contacts') {
				Init.initYandexMaps('maparea');
				mapFirstOpened = false;
			};
			$slider.find('.page-item.active').removeClass('active');
			$page.addClass('active');
			$('.mainpage-item').show();
			
		}
	};
	var	getCurrentURL = function (){
		if (isIE) {
			var hash = window.location.href.toString().split(window.location.host)[1].split('#')[1];
			return !hash ? 'index' : hash;
		}else{
			return window.location.pathname.split('/')[1] == '' ? 'index' : window.location.pathname.replace('/','');
		}
	};
	var changePageHeight = function (page){
		if ($(page).hasClass('mainpage-item')) {
			setTimeout(function () {
				$(page).css('min-height', $(window).height())
				if ($(page).height() < $(window).height()) {
					$swipewrap.css('max-height', $(window).height());
				}else{
					$swipewrap.css('max-height', $(page).height());
			}}, 0);
		}else{
			$swipewrap.height($(page).height());
		}
	};

	var highlightMenuItem = function (item){
		if (!isMobile) {
			$('.top-header-i .top-navigation').find('.active').removeClass('active');
			$('.top-header-i .top-navigation li').eq(item).addClass('active');
		}
	};
	var navigateToUrl = function (e, url){
		var toURL;
		if (url) {
			toURL = !isIE ? url.split('/').pop() : url;
		}else{
			if (!this.getAttribute('href')){
				toURL = this.parentNode.getAttribute('href').split('/').pop();
			}else{
				toURL = this.getAttribute('href').split('/').length == 2 ? this.getAttribute('href').split('/').pop() : this.getAttribute('href').replace("/","");

			}
		}
		if (toURL == 'index') {
			$('.top-header').removeAttr('style');
			$('html').removeAttr('style');
			setTimeout(function(){$('body').removeAttr('style');}, 300);
		}else{
			(!isMobile && pages.indexOf(toURL) <= 3) && highlightMenuItem(pages.indexOf(toURL)-1);
		}
		hwSwipe.slide(pages.indexOf(toURL));
		e && e.preventDefault();
	};

	var pageItemsHandler = function () {
		var items = $('.project-items').children(),
			countInRow = Math.round($('.project-items').width()/items.eq(0).width());
			items.height('auto');
			if ($(window).width() <= 480) {return};
			for (var i = 0; i < items.length; i += countInRow) {
				var row = items.get().slice(i, i+countInRow),
					heights = [];
				$.each(row, function (key, item) {
					heights.push($(item).height());
				});
				$(row).height(Math.max.apply(Math, heights));
			};

	};

	return {
		init: function (){
			$('.top-header').addClass('show');
			Init.initByUrl();
			if (isMobile) {
				Init.renderForMobile($('.top-header'));
			}
			Init.events();
		}
	}
})();

HelloWorld.init();

