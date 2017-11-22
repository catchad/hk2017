$(function() {
	mainLoader.addClass('show');

	// get spot info
  var spotData,
      spotInner = $('#spot_info');
  $.ajax({
    dataType: "json",
    url: '/tc/assets/spot.json',
    success: function(result, status){
      spotData = result;

      // page tour and map
      imgLoading( $('main') );
			google.maps.event.addDomListener(window, 'load', initMap);
    }
  });
	function initMap() {
		// Create a new StyledMapType object, passing it an array of styles,
	  // and the name to be displayed on the map type control.
	  var styledMapType = new google.maps.StyledMapType(
	    [
		    {
		        "featureType": "all",
		        "elementType": "labels.text.fill",
		        "stylers": [
		            {
		                "saturation": "-23"
		            },
		            {
		                "color": "#65594e"
		            }
		        ]
		    },
		    {
		        "featureType": "all",
		        "elementType": "labels.text.stroke",
		        "stylers": [
		            {
		                "visibility": "on"
		            },
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 16
		            }
		        ]
		    },
		    {
		        "featureType": "all",
		        "elementType": "labels.icon",
		        "stylers": [
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 20
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "geometry.stroke",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 17
		            },
		            {
		                "weight": 1.2
		            }
		        ]
		    },
		    {
		        "featureType": "administrative",
		        "elementType": "labels.text",
		        "stylers": [
		            {
		                "color": "#db4c3d"
		            },
		            {
		                "weight": "0.01"
		            }
		        ]
		    },
		    {
		        "featureType": "landscape",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 20
		            }
		        ]
		    },
		    {
		        "featureType": "poi",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 21
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "geometry.fill",
		        "stylers": [
		            {
		                "color": "#231f20"
		            }
		        ]
		    },
		    {
		        "featureType": "road.highway",
		        "elementType": "geometry.stroke",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 29
		            },
		            {
		                "weight": 0.2
		            },
		            {
		                "visibility": "off"
		            }
		        ]
		    },
		    {
		        "featureType": "road.arterial",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#231f20"
		            }
		        ]
		    },
		    {
		        "featureType": "road.local",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 16
		            }
		        ]
		    },
		    {
		        "featureType": "transit",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#000000"
		            },
		            {
		                "lightness": 19
		            }
		        ]
		    },
		    {
		        "featureType": "water",
		        "elementType": "geometry",
		        "stylers": [
		            {
		                "color": "#0e171d"
		            }
		        ]
		    }
		],
	  {name: 'Styled Map'});

	  // Create a map object, and include the MapTypeId to add
	  // to the map type control.
	  var map = new google.maps.Map(document.getElementById('hkmap'), {
	    center: {lat: 22.2880308, lng: 114.1676216},
	    zoom: 14,
	    mapTypeControl: false,
	    language: 'zh-TW',
	    disableDefaultUI: true
	  });

	  //Associate the styled map with the MapTypeId and set it to display.
	  map.mapTypes.set('styled_map', styledMapType);
	  map.setMapTypeId('styled_map');


	  // marker
	  var iconBase = 'https://hkwonderful.discoverhongkong.com/tc/assets/images/';
	  var icons = {
	    member1: {
	      icon: iconBase + 'map-icon1.png'
	    },
	    member2: {
	      icon: iconBase + 'map-icon2.png'
	    },
	    member3: {
	      icon: iconBase + 'map-icon3.png'
	    },
	    member4: {
	      icon: iconBase + 'map-icon4.png'
	    }
	  };

	  var spot_list = ["t1", "t2", "t3", "t4", "t5", "d1", "d2", "d3", "d4", "d5", "m1", "m2", "m3", "m4", "m5", "s1", "s2", "s3", "s4", "s5"]
	  var features = [];
	  for (var i = 0; i < spot_list.length; i++) {
	  	var _marker ={
	  		position: new google.maps.LatLng(spotData[ spot_list[i] ].lat, spotData[ spot_list[i] ].lng),
	      type: spotData[ spot_list[i] ].type,
	      spid: spot_list[i]
	  	}
	  	features.push(_marker);
	  }
	  // Create markers.
	  features.forEach(function(feature) {
	    var marker = new google.maps.Marker({
	      position: feature.position,
	      icon: icons[feature.type].icon,
	      spot: feature.spid,
	      map: map
	    });
	    marker.addListener('click', function() {
		    //after image loaded show popup
		    getSpotinfo(this.spot);

		  });
	  });
	}



  function getSpotinfo(spotId){
    var spot = spotData[spotId];
    pageTrack('page-Spot-'+spotId);

    spotInner.find('h2 .name').text(spot.name);
    spotInner.find('.style').text(spot.style);
    spotInner.find('.location').text(spot.location);
    spotInner.find('.desc').html(spot.desc);

    // set images
    var imgs = '';
    for (var i = 0; i < spot.img_url.length; i++) {
      imgs += "<div class='item' data-img='" + spot.img_url[i] + "'><img src='/tc/assets/images/spot/" + spot.img_url[i] + "' alt='/><p class='name'>" + spot.img_name[i] + "</p></div>"
    }
    $('#img_show .flex').html(imgs);
    $('.btn-linkto').attr('href', spot.links[0]);
    $('.btn-linkto').text( spot.links_name[0]);

    setImgshow();
    imgLoading( spotInner, popShow(spotInner) );
  }
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