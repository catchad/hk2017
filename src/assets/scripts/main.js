// set show popup event as global for Page Map
var popShow, popClose;
var ww = window.innerWidth;
var imgLoaded = false;
var mainLoader = $('.full_loader'),
		body= $('body');

WebFont.load({
  custom: {
    families: ['cwTeXYen'],
    urls: ['https://fonts.googleapis.com/earlyaccess/cwtexyen.css']
  }

});

$(function() {
	var header = $('header');

	//popup show
	popShow = function(page){
		body.addClass('lock');
		TweenMax.set( page, { className: '+=show'});
		TweenMax.fromTo( page, .5, { x:'-50%', alpha:0 }, { x:'0%', alpha:1 });
	}
	// popup close
	popClose = function(page){
		body.removeClass('lock');
		TweenMax.fromTo( page, .5, { x:'0%', alpha:1 }, { x:'-50%', alpha:0 });
		TweenMax.set( page, { className: '-=show', delay: .51});
	}
	//resize
	function onResize(){
		ww = window.innerWidth;
		console.log(ww);
	}

	//image loader
	function imgLoading(page, cont){
		mainLoader.addClass('show');
		page.imagesLoaded()
		  .always( function( instance ) {
		    console.log('all images loaded');
		    mainLoader.removeClass('show');
		    page.addClass('show');

		    if ( typeof cont === 'function')
            cont();
		  })
	}


	// init


	// bind event
	$(window).on('resize', onResize);
	$('.popup .btn-close').on('click', function(){
		var page = $(this).parents('.popup');
		// console.log(page)
		if ( page.hasClass('show') ){
			popClose(page);
		}
	});

	$('.menu-switch').on('click', function(){
		if ( header.hasClass('expend') ) {
			header.removeClass('expend');
		}
		else{
			header.addClass('expend');
		}

	});


	// tour and map page bind pan event
	var pan_tar = document.getElementById('img_show');
	var maxShow_w = 0;
	if ( pan_tar !== null ) {
		// page tour and map
		imgLoading( $('main') );

		if (ww <= 768) {
			// bind hammer js
			var hammertime = new Hammer(pan_tar);
			var panX = 0;
			hammertime.on('pan', function(ev) {
				// console.log(ev.deltaX)
				panX = panX + ev.deltaX/8;

				if ( panX > 0) {
					panX = 0;
				}
				else if( panX < -maxShow_w ){
					panX = -maxShow_w;
				}

				// console.log(panX);
				TweenMax.set('#img_show .flex', {x: panX})

			});

			// set image show width
			setImgshow();
		}

	}

	function setImgshow(){
		var item = $('#img_show .item');
		maxShow_w = item.width() * item.length + ww * .1 * (item.length-1) - ww*.6
		console.log('img_show move area: '+maxShow_w);
	}




});