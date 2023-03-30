(function($) {

	var customMarkers = [];
	var markerBounds = [];
	var locations = [];
	var map = undefined;

	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	function showDistanceBetween(userLatLong) {

		if($('#location-list').length > 0) {
			$('#location-list li').each(function(){

				const locationLat = $(this).data('latlng');
				var locA  = locationLat.split(',');
				const locationLatLong = new google.maps.LatLng(locA[0], locA[1]);

				const userDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, locationLatLong);
				const userDistanceString = (userDistance / 1000).toFixed(1);

				$(this).find('.location-current-distance').text(userDistanceString);
			});
		} else if($('#hero-location-single').length > 0) {

			const locationLat = $('#hero-location-single').data('latlng');
			var locA  = locationLat.split(',');
			const locationLatLong = new google.maps.LatLng(locA[0], locA[1]);

			const userDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, locationLatLong);
			const userDistanceString = (userDistance / 1000).toFixed(1);

			$('#user-distance').text(userDistanceString);
		}
	}

	function sortResults(position) {
		// Get current position
		if($('#location-list').length <= 0) {
			return;
		}
		var latlon = position;
		var locations = document.getElementById('location-results');
		var locationList = locations.querySelectorAll('.location');
		var locationArray = Array.prototype.slice.call(locationList, 0);

		locationArray.sort(function(a,b){
			var locA  = a.getAttribute('data-latlng').split(',');
			var locB  = b.getAttribute('data-latlng').split(',');

			var latLngA = new google.maps.LatLng(locA[0], locA[1]);
			var latLngB = new google.maps.LatLng(locB[0], locB[1]);

			distA = google.maps.geometry.spherical.computeDistanceBetween(latLngA, position);
			distB = google.maps.geometry.spherical.computeDistanceBetween(latLngB, position);

			return distA - distB;
		});

		//Reorder the list
		locations.innerHTML = "";
		locationArray.forEach(function(el) {
			locations.appendChild(el);
		});
	}

	function getUserPosition(pos) {
			const crd = pos.coords;
			const userLat = crd.latitude;
			const userLong = crd.longitude;

			const userLatLong = new google.maps.LatLng(userLat, userLong)

			return userLatLong
	}

	function getPosition() {
		try {
			return new Promise((res, rej) => {
				navigator.geolocation.getCurrentPosition(res, rej);
			});
		} catch (e) {
			console.warn('Get Position Error: ', e)
		}
	}

	function setMarkerBounds(markerLocation) {

		var customMarkerBounds = [].concat(markerBounds);

		if(markerLocation) {
				customMarkerBounds.push(markerLocation);
		}

		var bounds = new google.maps.LatLngBounds();
		// console.log('marker bounds',customMarkerBounds)
		for (var i = 0; i < customMarkerBounds.length; i++) {
			bounds.extend(customMarkerBounds[i]);
		}

		if(map) {
			map.fitBounds(bounds);
		}

	}

	function setCustomMarker(places) {
		if (places.length == 0) {
			return;
		}

		// Clear out the old customMarkers.
		customMarkers.forEach(function(marker) {
			marker.setMap(null);
		});

		// For each place, get the icon, name and location.
		places.forEach(function(place) {
			if (!place.geometry) {
				console.warn("Returned place contains no geometry");
				return;
			}

			showDistanceBetween(place.geometry.location);
			sortResults(place.geometry.location);

			// Create a marker for each place.
			customMarkers.push(new google.maps.Marker({
				map: map,
				title: place.name,
				position: place.geometry.location,
				icon: {
					anchor: new google.maps.Point(16, 16),
					url: 'data:image/svg+xml;utf-8, \
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \<circle cx="12" cy="12" fill="rgba(31, 46, 84, 1)" r="12"/>\</svg>'
				}
			}));

			setMarkerBounds(place.geometry.location);

			$('.reset-user-location').each(function() {
				// console.log('remoce user location acitve class');
				$(this).removeClass('active');
			})

			// var customInfowindow =  new google.maps.InfoWindow({
			// 	content: place.formatted_address,
			// 	map: map
			// });
			//
			// customMarkers[0].addListener('mouseover', () => customInfowindow.open(map, customMarkers[0]));
			// customMarkers[0].addListener('mouseout', () => customInfowindow.close());
		});
	}

	async function setUserMarker() {

		var position = await getPosition();  // wait for getPosition to complete

		var userPosition = getUserPosition(position);

		if(position && userPosition) {
			var marker = new google.maps.Marker({
				position: userPosition,
				map: map,
				title: 'Ihr Standort',
				icon: {
					anchor: new google.maps.Point(16, 16),
					url: 'data:image/svg+xml;utf-8, \
					<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \<circle cx="12" cy="12" fill="rgba(31, 46, 84, 1)" r="12"/>\</svg>'
				}
			})

			// Clear out the old customMarkers.
			customMarkers.forEach(function(marker) {
				marker.setMap(null);
			});

			customMarkers.push(marker);

			setMarkerBounds(marker.position);
			showDistanceBetween(userPosition);

			$('.reset-user-location').each(function() {
				// console.log('add user location acitve class');
				$(this).addClass('active');
			})

		}
	}

	async function showUserDistanceOnly() {
		var position = await getPosition();
		var userPosition = getUserPosition(position);
		showDistanceBetween(userPosition);
	}

	if ($('#hero-location-single #location-map').length || $('#hero-location-archive #location-map').length || $('#hero-front-page #location-map').length) {

		initMap();

		function initMap(selection) {

			var mapEl = document.getElementById('location-map');

			if(!mapEl){
				return;
			}

			$('.location-marker').each(function() {
				var marker = this;

				var dataLat = marker.getAttribute('data-project-lat');
				var dataLng = marker.getAttribute('data-project-lng');
				var dataAddressHTML = marker.innerHTML;
				var iconUrl = marker.getAttribute('data-project-icon');

				var location = [dataLat, dataLng, iconUrl, dataAddressHTML];

				locations.push(location);
			})

			map = new google.maps.Map(mapEl, {
				// zoom: 16,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scaleControl: false,
				streetViewControl: false,
				mapTypeControl: false,
				scrollwheel: false
			});

			var infowindow = new google.maps.InfoWindow();
			var marker, i;

			// Location customMarkers
			for (i = 0; i < locations.length; i++) {
				marker = new google.maps.Marker({
					position: new google.maps.LatLng(locations[i][0], locations[i][1]),
					map: map,
					// icon: locations[i][2],
					icon: {
						anchor: new google.maps.Point(16, 16),
						url: 'data:image/svg+xml;utf-8, \
						<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \<circle cx="12" cy="12" fill="rgba(223, 1, 111, 1)" r="12"/>\</svg>'
					}
				});

				markerBounds.push(marker.position);

				var listener = google.maps.event.addListener(map, 'idle', function() {
					if (map.getZoom() > 16) map.setZoom(16);
					google.maps.event.removeListener(listener);
				});

				if (selection && i != 0) {

					if (marker.category == selection) {

						marker.setVisible(true);

					} else {

						marker.setVisible(false);
					}
				}

				google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
					return function() {
						infowindow.setContent(locations[i][3]);
						infowindow.open(map, marker);
					}
				})(marker, i));
			}


			setMarkerBounds();

			if(!$('body.single-location') || $('body.single-location').length <= 0) {

				var currentLocationString = localStorage.getItem("currentLocation");

				if(currentLocationString) {
					var currentLocation = JSON.parse(currentLocationString);
					var currentLocationLatLng = new google.maps.LatLng(currentLocation.lat, currentLocation.lng)

					showDistanceBetween(currentLocationLatLng);
					sortResults(currentLocationLatLng);

					// Create a marker for each place.
					customMarkers.push(new google.maps.Marker({
						map: map,
						position: currentLocationLatLng,
						icon: {
							anchor: new google.maps.Point(16, 16),
							url: 'data:image/svg+xml;utf-8, \
							<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"> \<circle cx="12" cy="12" fill="rgba(31, 46, 84, 1)" r="12"/>\</svg>'
						}
					}));

					var customInfowindow =  new google.maps.InfoWindow({
						content: '<div class="location-marker"><div class="location-marker-html"><div class="location-marker-title"><a href="#">'+currentLocation.address+'</a></div></div></div>' ,
						map: map
					});

					customMarkers[0].addListener('mouseover', () => customInfowindow.open(map, customMarkers[0]));
					customMarkers[0].addListener('mouseout', () => customInfowindow.close());

					setMarkerBounds(currentLocationLatLng);
				} else {

					// Set User Marker
					setUserMarker();

				}
			} else {

				var currentLocationString = localStorage.getItem("currentLocation");

				if(currentLocationString) {

					var currentLocation = JSON.parse(currentLocationString);
					var currentLocationLatLng = new google.maps.LatLng(currentLocation.lat, currentLocation.lng);

					showDistanceBetween(currentLocationLatLng);

				} else {

					showUserDistanceOnly();

				}
			}
		}
	}

	// Reset User Location Button
	$('.reset-user-location').each(function() {
		$(this).on('click', function(){
			// console.log('reset user location');

			localStorage.removeItem("currentLocation");
			setUserMarker();

		});
	})

	// Searchboxes
	var searchBoxes = [];

	if($('#navigation-search-input').length && $('#navigation-search-input').length > 0) {
		var input = document.getElementById('navigation-search-input');
		searchBoxes.push(new google.maps.places.SearchBox(input));
	}

	if($('#mobile-navigation-search-input').length > 0) {
		var input = document.getElementById('mobile-navigation-search-input');
		var mobileSearchBox = new google.maps.places.SearchBox(input);

		mobileSearchBox.addListener('places_changed', function() {
			var places = mobileSearchBox.getPlaces();

			if (!places && places.length <= 0) {
				return;
			}

			var currentLocation = {lat: places[0].geometry.location.lat() , lng: places[0].geometry.location.lng(),  address: places[0].formatted_address};
			localStorage.setItem("currentLocation", JSON.stringify(currentLocation));

			window.location.replace("https://www.citystorage.at/standorte/");

		});
	}

	if($('#hero-search-input').length && $('#hero-search-input').length > 0) {
		var input = document.getElementById('hero-search-input');
		searchBoxes.push(new google.maps.places.SearchBox(input));
	}

	searchBoxes.forEach(function(searchBox) {
		searchBox.addListener('places_changed', function() {
			var places = searchBox.getPlaces();

			if (!places || places.length <= 0) {
				return;
			}

			var currentLocation = {lat: places[0].geometry.location.lat() , lng: places[0].geometry.location.lng(),  address: places[0].formatted_address};
			localStorage.setItem("currentLocation", JSON.stringify(currentLocation));

			if (map && $('.post-type-archive-location').length > 0) {
				setCustomMarker(places)
			} else {
				window.location.replace("https://www.citystorage.at/standorte/");
			}

		});
	})


	if($('#footer .districts').length > 0) {
		$('#footer .districts h3').each(function() {
			$(this).on('click', function(){

					var address = $(this).data('district-name') + ', Wien'
					var geocoder = new google.maps.Geocoder();
					var customGeoCode = geocoder.geocode({'address': address}, function(results, status) {

					if (status === 'OK') {
						var currentLocation = {lat: results[0].geometry.location.lat() , lng: results[0].geometry.location.lng(), address: results[0].formatted_address};
						localStorage.setItem("currentLocation", JSON.stringify(currentLocation));
						setCustomMarker(results)
						window.location.replace("https://www.citystorage.at/standorte/");
					} else {
						console.warn('Geocode was not successful for the following reason: ' + status);
					}
					});

			})

		})
	}

})(jQuery);
