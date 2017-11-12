$(function() {




	// popup close
	function popClose(tar){
		tar.removeClass('show')
	}

	$('.popup .btn-close').on('click', function(){
		var page = $(this).parents('.popup');
		console.log(page)
		if ( page.hasClass('show') ){
			popClose(page);
		}

	});

});