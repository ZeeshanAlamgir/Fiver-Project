(function($) {

	/*

		registered ajax actions:

		get_markers_json - will return an json encoded locations array

		get_list_json - will return json encoded html displaying all locations as teasers


		ajax url is:

		locations_obj.ajaxUrl

	*/
	function initSortResults(position) {
		// Grab current position
		var crd = position.coords;
		var userLat = crd.latitude;
		var userLong = crd.longitude;
		var latlon = new google.maps.LatLng(userLat, userLong);

		var locations = document.getElementById('location-results');
		var locationList = locations.querySelectorAll('.location');
		var locationArray = Array.prototype.slice.call(locationList, 0);

		locationArray.sort(function(a,b){
			var locA  = a.getAttribute('data-latlng').split(',');
			var locB  = b.getAttribute('data-latlng').split(',');

			var latLngA = new google.maps.LatLng(locA[0], locA[1]);
			var latLngB = new google.maps.LatLng(locB[0], locB[1]);


			distA = google.maps.geometry.spherical.computeDistanceBetween(latLngA, latlon);
			distB = google.maps.geometry.spherical.computeDistanceBetween(latLngB, latlon);

			return distA - distB;
		});

		//Reorder the list
		locations.innerHTML = "";
		locationArray.forEach(function(el) {
			locations.appendChild(el);
		});
	}

	function showDistanceBetween(userLatLong) {
		$('#location-list li').each(function(){

			const locationLat = $(this).data('latlng');
			var locA  = locationLat.split(',');
			const locationLatLong = new google.maps.LatLng(locA[0], locA[1]);

			const userDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, locationLatLong);
			const userDistanceHTML = (userDistance / 1000).toFixed(1);
			$(this).find('.location-current-distance').text(userDistanceHTML);
		});
	}


	function success(pos) {
	  const crd = pos.coords;
		const userLat = crd.latitude;
		const userLong = crd.longitude;
		const userLatLong = new google.maps.LatLng(userLat, userLong);

		showDistanceBetween(userLatLong);
}


	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	if($('#hero-location-archive').length > 0) {

		navigator.geolocation.getCurrentPosition(initSortResults, error);
		navigator.geolocation.getCurrentPosition(success, error);
	}

})(jQuery);
