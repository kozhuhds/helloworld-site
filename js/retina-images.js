var RetinaImages = (function (){
	var images = [];
	var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;

	var setSrc = function (attr){
		if (pixelRatio == 1){
			for(var i=0; i < images.length; i++){
				if(images[i].getAttribute(attr)){
					images[i].src = images[i].getAttribute(attr)
						.replace('.', '@2x.');
					images[i].setAttribute('class', 'retina-image');
				}
			}
		}else{
			for(var i=0; i < images.length; i++){
				images[i].src = images[i].getAttribute(attr);
			}
		}
	};

	var Init = {
		loadImages: function (){
			images = document.getElementsByTagName('img');
		}
	};

	return {
		init: function (attr){
			Init.loadImages();
			setSrc(attr);
		}
	}
})();