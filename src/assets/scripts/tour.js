$(function() {
  var canvas = document.getElementById('bg_tour');
  var snowObj = new Image();

  snowObj.onload = function() {
    makeSnow(canvas, snowObj);
  };
  snowObj.src = '/tc/assets/images/snow.png';

  function makeSnow(el, texture) {
    var ctx = el.getContext('2d');
    var width = 0;
    var height = 0;
    var particles = [];

    var Particle = function() {
      this.x = this.y = this.dx = this.dy = 0;
      this.reset();
    }

    Particle.prototype.reset = function() {
      this.y = Math.random() * height;
      this.x = Math.random() * width;
      this.dx = (Math.random() * 0.4) - 0.2;
      this.dy = (Math.random() * 0.6) + 0.2;
      this.w = this.h = (Math.random() * 30) + 20;
    }

    function createParticles(count) {
      if (count != particles.length) {
        particles = [];
        for (var i = 0; i < count; i++) {
          particles.push(new Particle());
        }
      }
    }

    function ctxResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      el.width = width;
      el.height = height;

      createParticles((width * height) / 50000);
    }

    function updateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(function(particle) {
        particle.y += particle.dy;
        particle.x += particle.dx;

        if (particle.y > height) {
          particle.y = 0;
        }

        if (particle.x > width) {
          particle.reset();
          particle.y = 0;
        }
        ctx.drawImage(texture, particle.x, particle.y, particle.w, particle.h);
      });

      window.requestAnimationFrame(updateParticles);
    }

    ctxResize();
    updateParticles();

    window.addEventListener('resize', ctxResize);
  }


  $('.btn-vote').on('click', function(){
    if ( !isRunning ) {
      isRunning = true;
      pageTrack('page-Tour-vote');
      popShow('#user_data');
    }

  });
  $('.btn-promote').on('click', function(){
    if ( !isRunning ) {
      isRunning = true;
      pageTrack('page-Tour-promote');
      popShow('#promote_code');
    }
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
  function sendUser(){
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
      isRunning = false;
      switch (response.code) {
        case 200:
        case 201:
          console.log('save user data OK');
          pageTrack('page-Tour-savedata');
          alert('參加成功。');
          popClose('#user_data');
          break;
        default:
          alert('發生錯誤。' + response.code);
      }
      console.log(response);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      isRunning = false;
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
  $('#register-form').on('submit', function (e) {
    e.preventDefault();
    if ( !isRunning ) {
      isRunning = true;
      if ( $('#user_agree').is(":checked") ) {
        sendUser();
      }
      else{
        alert('尚未同意相關活動辦法與隱私權政策。')
      }

    }
  });

  // get spot info
  mainLoader.addClass('show');
  var spotData,
      spotInner = $('#spot_info');
  $.ajax({
    dataType: "json",
    url: '/tc/assets/spot.json',
    success: function(result, status){

      spotData = result;
      // page tour and map
      imgLoading( $('main') );
    }
  });

  $('.tour-list .btn').on('click', function(){

    var spotId = $(this).attr('data-spot');
    var spot = spotData[spotId];
    pageTrack('page-Spot-'+spotId);
    // console.log(spot);

    spotInner.find('h2 .name').text(spot.name);
    spotInner.find('.style').text(spot.style);
    spotInner.find('.location').text(spot.location);
    spotInner.find('.desc').html(spot.desc);

    // set images
    var imgs = '';
    for (var i = 0; i < spot.img_url.length; i++) {
      imgs += '<div class="item" data-img="' + spot.img_url[i] + '"><img src="/tc/assets/images/spot/' + spot.img_url[i] + '"/><p class="name">' + spot.img_name[i] + '</p></div>';
    }
    $('#img_show .flex').html(imgs);
    $('.btn-linkto').attr('href', spot.links[0]);
    $('.btn-linkto').text( spot.links_name[0]);

    setImgshow();
    imgLoading( spotInner, popShow(spotInner) );
  });
  $('#img_show .flex').on('click', '.item', function(){
    if ( !isRunning ) {
      isRunning = true;
      var img = $(this).attr('data-img');
      $('#spot_image img').attr('src', '/tc/assets/images/spot/'+img);
      popShow('#spot_image');
    }
  });

  // tour and map page bind pan event
  function setImgshow(){
    var item = $('#img_show .item');
    maxShow_w = (ww * .6) * item.length + ww * .1 * (item.length-1) - ww*.6
  }

  var pan_tar = document.getElementById('img_show');
  var maxShow_w = 0;

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

      TweenMax.set('#img_show .flex', {x: panX})
    });
  }




});

