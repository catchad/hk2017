$(function() {

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
	    mamber1: {
	      icon: iconBase + 'map-icon1.png'
	    },
	    mamber2: {
	      icon: iconBase + 'map-icon2.png'
	    },
	    mamber3: {
	      icon: iconBase + 'map-icon3.png'
	    },
	    mamber4: {
	      icon: iconBase + 'map-icon4.png'
	    }
	  };

	  var features = [
	    {
	      position: new google.maps.LatLng(22.2991332,114.1770699),
	      type: 'mamber1',
	      title: '推機'
	    }, {
	      position: new google.maps.LatLng(22.2833326,114.1738553),
	      type: 'mamber2',
	      title: '肚皮'
	    }, {
	      position: new google.maps.LatLng(22.2930678,114.1708626),
	      type: 'mamber3',
	      title: 'Mami'
	    }, {
	      position: new google.maps.LatLng(22.2789112,114.1819145),
	      type: 'mamber4',
	      title: '小民'
	    }
	  ];

	  // Create markers.
	  features.forEach(function(feature) {
	    var marker = new google.maps.Marker({
	      position: feature.position,
	      icon: icons[feature.type].icon,
	      spot: feature.title,
	      map: map
	    });
	    marker.addListener('click', function() {
		    // get spot name and replace data
		    console.log( this.spot )

		    //after image loaded show popup
		    // $('#spot_info').addClass('show');
		    popShow('#spot_info')

		  });
	  });
	}
	google.maps.event.addDomListener(window, 'load', initMap);



});