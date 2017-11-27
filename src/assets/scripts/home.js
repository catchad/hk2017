$(function() {
	var tips= ['等一下下喔，下載即將完成', '再等一下，正準備在辨識你的名字喔', '小民正在編曲中，等他一下啦', '推機正在緩慢地拿起貝斯，不要催她啦','瑪靡清一下喉嚨，等一下下喔' ,'肚皮正在找他的鼓棒，快要找到了','再10秒鐘，曲子就做好了'];
	if (ww <= 768) {
		var cw = 800,
				ch = 704;
	}
	else{
		var cw = 1920,
				ch = 1013;
	}

	var myMv = new mv();
	var userTicket;

	var canvas = $('#bg_home');
	var app = new PIXI.Application(cw, ch, {backgroundColor : 0xf5f1ec});
	var steps = [];
	var currentPage = '#step1',
			currentAni = 0;
	var countText = $('.full_loader .count');

	var loader = PIXI.loader;
  canvas.append(app.view);
  if (ww <= 768) {
		loader
		  .add('/tc/assets/images/sprite/01m.json')
		  .add('/tc/assets/images/sprite/04m.json')
		  .add('/tc/assets/images/name_input.png')
		  .load(onAssetsLoaded);

	}
	else{
		loader
		  .add('/tc/assets/images/sprite/01.json')
		  .add('/tc/assets/images/sprite/04.json')
		  .add('/tc/assets/images/name_input.png')
		  .load(onAssetsLoaded);
	}

	// loader
	pageTrack('page-Home-loading');
	loader.onProgress.add(function(e){
		countText.text( e.progress.toFixed(0) );
	});

	function onAssetsLoaded(){
		var frames = [],
				frame_num = [8, 10];

		for (var i = 0; i <2; i++) {
			frames = [];
			for (var j = 0; j <frame_num[i]; j++) {
				var val = j < 10 ? '0' + j : j;
				frames.push(PIXI.Texture.fromFrame('0'+(i+1)+'-000' + val + '.jpg'));
			}

			steps.push( new PIXI.extras.AnimatedSprite(frames) );
			steps[i].x = app.renderer.width / 2;
			steps[i].anchor.set(0.5);
			steps[i].animationSpeed = .15;
			steps[i].visible = false;

			if (ww <= 768){
				steps[i].scale.set( app.renderer.width / 800 );
				steps[i].y = app.renderer.height * .5;
			}
			else{
				steps[i].scale.set( app.renderer.width / 1920 );
				steps[i].y = app.renderer.height * .5;
			}

			app.stage.addChild(steps[i]);
		}
		//image loaded
		$('main').addClass('show');
		mainLoader.removeClass('show');
		imgLoaded = true;
		pageTrack('page-Home-enter');

		//init
		if( window.ticket !== undefined ) {
			// 帶ticket進站, 直接顯示影片
			// userTicket = urlValue['t']
	    	pageHide();
			nextAni();
			pageShow('#step3', 0.5);
			checkStatus(window.ticket);
			$('#step5 .btn-share').text("換我，製作我的影片");
		} else {
			steps[0].visible = true;
			// steps[2].loop = false;
			steps[0].play();
		}
	}


	function pageHide(){
		TweenMax.fromTo(currentPage, .3, { alpha: 1 }, { alpha: 0 });
		TweenMax.set(currentPage, { display: 'none', delay: .3 });
	}

	var tipTimer, tipCount = 0;

	function pageShow(page, delay){
		if (page == "#step3") {

			tipTimer = setInterval( function(){
				tipCount = (tipCount >5)? 0 : tipCount+1;
				$('.tips').text( tips[tipCount] );
			}, 2000);
		}
		else{
			clearInterval(tipTimer);
		}

		if( page == "#step5" ) {
			TweenMax.set(page, { display: 'block', visibility:'visible', height:'auto', position:'relative', delay: delay });
		} else {
			TweenMax.set(page, { display: 'block',delay: delay });
		}

		TweenMax.fromTo(page, .3, { alpha: 0 }, { alpha: 1, delay: delay+.05, onComplete:function(){
			isRunning = false;
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
		if (currentAni <= 1) {
			steps[currentAni].visible = true;
			steps[currentAni].gotoAndPlay(0);
		}
	}

	function mvLoader(){
		pageHide();
		pageShow('#step5', .5);
		setTimeout(nextAni, 500);
		// myMv.playVideo();
	}

	// for api
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
      isRunning = false;
      switch (response.code) {
        case 200:
        case 201:
          if (response.data.MusicFile == null) {
            // 等待2秒再次檢查
            setTimeout(function () { checkStatus(ticket); }, 2000);
          }
          else {
          	// 等待影片 音樂下載完畢才顯示下一段
            mvStart(response);

          }
          break;
        default:
          alert('請輸入3個字的中文姓名。' + response.code);
      }
      console.log(response);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      isRunning = false;
      var response = $.parseJSON(jqXHR.responseText);
      switch (response.code) {
        case 400:
          alert(response.message);
          break;
        default:
          alert('請輸入3個字的中文姓名。' + response.code);
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
        	pageTrack('page-Home-videoloading');
        	pageHide();
					nextAni();
					pageShow('#step3', 0.5);
			userTicket = response.data.Ticket;
          if (response.data.MusicFile != null) {
          	// console.log('mp3 return');
          	// console.log(response.data.MusicFile);
          	// 之前產生過 有資料可以直接用
          	// 等待影片 音樂下載完畢才顯示下一段
          	mvStart(response);
          }
          else {
            // 等待2秒然後檢查音樂檔案生成狀態
            setTimeout(function () { checkStatus(response.data.Ticket); }, 2000);
          }
          break;
        default:
          alert('請輸入3個字的中文姓名。' + response.code);
      }
      console.log(response);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      isRunning = false;
      var response = $.parseJSON(jqXHR.responseText);
      switch (response.code) {
        case 400:
          alert( response.message);
          break;
        default:
          alert('請輸入3個字的中文姓名。' + response.code);
      }
    });
  }

  // step1
	$('.step .btn-to_step2').on('click', function(){
		if ( !isRunning ) {
			isRunning = true;
			pageHide();
			pageShow('#step2', 0.5);
			pageTrack('page-Home-inputname');
		}

	});

	// step2
	function getName(){
		if ( !isRunning ) {
			var name = $('#name1').val();
			if ( name.length == 3) {
				isRunning = true;
				apiMusic(name);
			}
			else{
				alert('請輸入3個字的中文姓名');
			}
		}
	}
	$('#name_form').on('submit', function(e){
		e.preventDefault();
		getName();
	});
	$('.step .btn-to_step3').on('click', function(){
		// send name to backend
		getName();
	});

	$('.step .btn-play').on('click', function(){
		if ( !isRunning ) {
			isRunning = true;
			pageHide();
			pageShow('#step5', .5);
			setTimeout( function(){
				steps[currentAni].visible = false;
				steps[currentAni].gotoAndStop(0);
			}, 500);
		}
	});

	// step5
	$('#step5 .btn-share').on('click', function(event) {
		if( window.ticket !== undefined ) {
			location.href = "https://hkwonderful.discoverhongkong.com/tc/";
		} else {
			FB.ui({
				method: 'share',
				href: 'https://hkwonderful.discoverhongkong.com/tc/video/'+userTicket,
			},
			function(response) {

			});
		}

	});

	function mvStart(response) {
		var imgData;
		if( ww > 1024 ) {
			imgData = [response.data.NameFiles[0], response.data.NameFiles[1], response.data.NameFiles[2], response.data.NameFiles[3], response.data.NameFiles[4], response.data.NameFiles[5], response.data.NameFiles[6], response.data.NameFiles[14]];
		} else {
			imgData = [response.data.NameFiles[7], response.data.NameFiles[8], response.data.NameFiles[9], response.data.NameFiles[10], response.data.NameFiles[11], response.data.NameFiles[12], response.data.NameFiles[13], response.data.NameFiles[14]];
		}
		if( userTicket !== undefined ) {
			history.replaceState({}, 'video', '/tc/video/'+userTicket);
		}
		myMv.start({
			img: imgData,
			music: response.data.MusicFile,
			complete: function() {
				pageTrack('page-Home-videoplay');
				mvLoader();
			}
		});
	}


});