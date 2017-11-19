$(function() {
	var canvas = $('#bg_home');
	var app = new PIXI.Application(canvas.width(), canvas.height(), {backgroundColor : 0xf5f1ec});
	var steps = [];
	var currentPage = '#step1',
			currentAni = 0;
	var doOnce = false;

	var imgCount = 0,
			imgMax = 5,
			countText = $('.full_loader .count');

	var loader = PIXI.loader;
  canvas.append(app.view);
  if (ww <= 768) {
		loader
		  .add('/tc/assets/images/sprite/01m.json')
		  .add('/tc/assets/images/sprite/02m.json')
		  .add('/tc/assets/images/sprite/03m.json')
		  .add('/tc/assets/images/sprite/04m.json')
		  .add('/tc/assets/images/sprite/05m.json')
		  .load(onAssetsLoaded);
	}
	else{
		loader
		  .add('/tc/assets/images/sprite/01.json')
		  .add('/tc/assets/images/sprite/02.json')
		  .add('/tc/assets/images/sprite/03.json')
		  .add('/tc/assets/images/sprite/04.json')
		  .add('/tc/assets/images/sprite/05.json')
		  .load(onAssetsLoaded);
	}

	// loader
	loader.onProgress.add((e) => {
		countText.text( e.progress );
	});

	function onAssetsLoaded(){
		var frames = [],
				frame_num = [8, 6, 11, 10, 8];

		for (var i = 0; i <5; i++) {
			frames = [];
			for (var j = 0; j <frame_num[i]; j++) {
				var val = j < 10 ? '0' + j : j;
				frames.push(PIXI.Texture.fromFrame('0'+(i+1)+'-000' + val + '.jpg'));
			}

			steps.push( new PIXI.extras.AnimatedSprite(frames) );
			steps[i].x = app.renderer.width / 2;
			steps[i].anchor.set(0.5);
			steps[i].animationSpeed = .2;
			steps[i].visible = false;

			if (ww <= 768){
				steps[i].scale.set( app.renderer.width / 800 );
				steps[i].y = app.renderer.height * .55;
			}
			else{
				steps[i].scale.set( app.renderer.width / 1920 );
				steps[i].y = app.renderer.height * .65;
			}

			app.stage.addChild(steps[i]);

			//image loaded
			$('main').addClass('show');
			mainLoader.removeClass('show');
			imgLoaded = true;

		}

		//init
		steps[0].visible = true;
		steps[2].loop = false;
		steps[0].play();


		app.ticker.add(function() {

			if (currentAni == 2 && !doOnce){
				if ( steps[currentAni].currentFrame == frame_num[currentAni]-1) {
					doOnce = true;
					setTimeout(nextAni, 100);
					pageShow('#step3', 0.5);
				}
			}

		});
	}


	function pageHide(){
		TweenMax.fromTo(currentPage, .3, { alpha: 1 }, { alpha: 0 });
		TweenMax.set(currentPage, { display: 'none', delay: .3 });

	}
	function pageShow(page, delay){
		TweenMax.set(page, { display: 'block',delay: delay });
		TweenMax.fromTo(page, .3, { alpha: 0 }, { alpha: 1, delay: delay+.05, onComplete:()=>{
			if (page == '#step2') {
				$('#name1').focus();
			}
		} });
		currentPage = page;

	}

	function nextAni(){
		steps[currentAni].visible = false;
		steps[currentAni].gotoAndStop(0);

		currentAni++;
		doOnce = false;

		steps[currentAni].visible = true;
		steps[currentAni].gotoAndPlay(0);
	}
	function mvLoader(){
		pageHide();
		pageShow('#step4', .5);
		nextAni();
	}

	function getAuthHeaders() {
    var headers = {};
    var csrfToken = $('#csrf-form input[name=__RequestVerificationToken]').val();
    if (csrfToken) {
      headers['X-RVT'] = csrfToken;
    }
    return headers;
  }
  function checkStatus(ticket) {
    var jqxhr = $.ajax({
      url: '/tc/api/music/' + ticket,
      method: 'GET',
      headers: getAuthHeaders(),
      dataType: 'json'
    })
    .done(function (response, textStatus, jqXHR) {
      switch (response.code) {
        case 200:
        case 201:
          if (response.data.MusicFile == null) {
            // 等待2秒再次檢查
            setTimeout(function () { checkStatus(ticket); }, 2000);
          }
          else {
          	// 等待影片 音樂下載完畢才顯示下一段
						mvLoader();
          }
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
  }
  function apiMusic(name){
  	var formData = { name: name};
  	var jqxhr = $.ajax({
      url: '/tc/api/music/',
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
        	pageHide();
					nextAni();

          if (response.data.MusicFile != null) {
          	console.log('mp3 return');
          	console.log(response.data.MusicFile);
          	// 之前產生過 有資料可以直接用
          	// 等待影片 音樂下載完畢才顯示下一段
						mvLoader();
          }
          else {
            // 等待2秒然後檢查音樂檔案生成狀態
            setTimeout(function () { checkStatus(response.data.Ticket); }, 2000);
          }
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
  }

	$('.step .btn-to_step2').on('click', function(){
		pageHide();
		setTimeout(nextAni, 200);
		pageShow('#step2', 0.5);

	});
	$('.step .btn-to_step3').on('click', function(){


		// send name to backend
		var name = $('#name1').val()+$('#name2').val()+$('#name3').val();
		console.log(name);
		if ( name.length == 3) {
			apiMusic(name);
		}
		else{
			alert('姓名輸入錯誤');
		}


	});
	$('.step .btn-play').on('click', function(){
		pageHide();
		pageShow('#step5', .5);
		setTimeout( function(){
			steps[currentAni].visible = false;
			steps[currentAni].gotoAndStop(0);
		}, 500);
	});

	// fake finished loading event
	$('.step .btn-to_step4').on('click', function(){
		pageHide();
		pageShow('#step4', .5);
		nextAni();
	});



});