// set show popup event as global for Page Map
var popShow;

$(function() {
	const header = $('header');

	//popup show
	popShow = function(page){
		page.addClass('show')
	}
	// popup close
	function popClose(page){
		page.removeClass('show')
	}



	// bind event
	$('.popup .btn-close').on('click', function(){
		var page = $(this).parents('.popup');
		console.log(page)
		if ( page.hasClass('show') ){
			popClose(page);
		}
	});

	$('.menu-switch').on('click', ()=>{
		if ( header.hasClass('expend') ) {
			header.removeClass('expend');
		}
		else{
			header.addClass('expend');
		}

	});


});