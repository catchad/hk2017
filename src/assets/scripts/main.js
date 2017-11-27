// set show popup event as global for Page Map
var popShow, popClose;
var pageTrack, eventTrack;
var imgLoading;
var ww = window.innerWidth;
var imgLoaded = false;
var mainLoader = $('.full_loader'),
		body= $('body');
var isRunning = false;

$(function() {
	var header = $('header');

	// tracking
	pageTrack = function (page){
		// console.log('/tc/'+page);
	  dcsMultiTrack('DCS.dcsuri','/tc/'+page);
	  ga('send', 'pageview', page );
	}
	eventTrack = function(tar){
	  var _cate = tar.attr('data-cate'),
	      _label = tar.attr('data-label');

	  if (_cate){
	    ga('send', 'event', _cate, 'click', _label);
	    // console.log(_cate, _label);
	  }
	}

	//popup show
	popShow = function(page, loaded){
		body.addClass('lock');
		TweenMax.set( page, { className: '+=show'});
		if (loaded)
			TweenMax.set( page, { className: '+=loaded'});

		TweenMax.fromTo( page, .5, { x:'100%' }, { x:'0%' });
		isRunning = false;
	}
	// popup close
	popClose = function(page){
		if ( $('.popup.show').length ==1 ) {
			body.removeClass('lock');
		}
		TweenMax.fromTo( page, .5, { x:'0%' }, { x:'100%' });
		TweenMax.set( page, { className: '-=loaded'});
		TweenMax.set( page, { className: '-=show', delay: .51});
		isRunning = false;
	}
	//resize
	function onResize(){
		ww = window.innerWidth;
		// console.log(ww);
	}

	//image loader
	imgLoading = function (page, cont){
		mainLoader.addClass('show');
		page.imagesLoaded()
		  .always( function( instance ) {
		    console.log('all images loaded');

		    TweenMax.set(page, {className: '+=show', delay: .5, onComplete:function(){
		    	TweenMax.set(mainLoader, {className: '-=show'});
		    	if ( typeof cont === 'function'){
          	cont();
		    	}
		    }});


		  })
	}


	// init


	// bind event
	$(window).on('resize', onResize);
	$('.popup .btn-close').on('click', function(){
		if ( !isRunning ){
			isRunning = true;
			var page = $(this).parents('.popup');
			// console.log(page)
			if ( page.hasClass('show') ){
				popClose(page);
			}
		}
	});

	$('.menu-switch').on('click', function(){
		if ( header.hasClass('expend') ) {
			header.removeClass('expend');
		}
		else{
			header.addClass('expend');
			pageTrack('page-Menu-open');
		}
	});
	$('.poprule, .check_rule').on('click', function(e){
		e.preventDefault();
		popShow('#rules', true);
		pageTrack('page-Rule');
	});

	$('.ga-event').on('click', function(){
		eventTrack( $(this) );
	})
	$('#spot_info').on('click', '.btn-linkto', function(){
		ga('send', 'event', 'tour-info', 'click', 'bnt-link-'+ $(this).attr('href'));
	});








});