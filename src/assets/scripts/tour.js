$(function() {
	// var canvas = $('#bg_home');
	// var app = new PIXI.Application(canvas.width(), canvas.height(), {backgroundColor : 0xf5f1ec});
 //  canvas.append(app.view);


	// PIXI.loader
	//   .add('assets/images/sprite/01m.json')
	//   .load(onAssetsLoaded);



	// function onAssetsLoaded(){
	// 	var frames = [];


	// 	//init

	// 	app.ticker.add(function() {
	// 		// detect over world
	// 	});
	// }

	$('.btn-vote').on('click', function(){
		popShow('#user_data');
	});
	$('.btn-promote').on('click', function(){
		popShow('#promote_code');
	});


  // 參加抽獎
  function getAuthHeaders() {
    var headers = {};
    var csrfToken = $('#csrf-form input[name=__RequestVerificationToken]').val();
    if (csrfToken) {
      headers['X-RVT'] = csrfToken;
    }
    return headers;
  }
  $('#register-form').on('submit', function (e) {
    e.preventDefault();
    var formData = {
      name: $('#user_name').val(),
      email: $('#user_email').val(),
      mobile: $('#user_tel').val()
    };
    // jquery >= 1.9
    var jqxhr = $.ajax({
      url: '/tc/api/users',
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(formData),
      headers: getAuthHeaders(),
      dataType: 'json'
    })
    .done(function (response, textStatus, jqXHR) {
      switch (response.code) {
        case 200:
        case 201:
          console.log('save user data OK');
          alert('參加成功。');
					popClose('#user_data');
          break;
        default:
          alert('發生錯誤。' + response.code);
      }
      console.log(response);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      var response = $.parseJSON(jqXHR.responseText);
      switch (response.code) {
        case 400:
          alert('輸入資料有誤。' + response.message);
          break;
        default:
          alert('發生錯誤。' + response.code);
      }
    });
  });


});