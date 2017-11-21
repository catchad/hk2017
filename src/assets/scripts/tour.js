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
  $('#register-form').on('submit', function (e) {
    e.preventDefault();
    if ( !isRunning ) {
      isRunning = true;
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
  });


});