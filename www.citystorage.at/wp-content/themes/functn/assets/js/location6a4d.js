(function($) {


// ##########################################
// 				GET USER DISTANCE TO LOCATION
// ##########################################

	function success(pos) {
	  const crd = pos.coords;
		const locationLat = $('#hero-location-single').data('location-lat');
		const locationLng = $('#hero-location-single').data('location-lng');
		const locationLatLong = new google.maps.LatLng(locationLat, locationLng)
		const userLat = crd.latitude;
		const userLong = crd.longitude;
		const userLatLong = new google.maps.LatLng(userLat, userLong)

		const userDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLong, locationLatLong);
		const userDistanceHTML = (userDistance / 1000).toFixed(1);
		$('#user-distance').text(userDistanceHTML);
	}

	function error(err) {
	  console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	if($('#hero-location-single').length > 0 && $('#hero-location-single').data('location-lat'))  {
		navigator.geolocation.getCurrentPosition(success, error);
	}

	// Prefill queue request form if no compartments are available

	if ($('.queue-form-wrapper').length > 0) {

		// Get address data from localized object

		var locationValue = location_obj.address.streetNumber;

		$('.queue-form-wrapper').each(function() {

			// Prefill hidden field with location

			$(this).find('.location-name input').attr('value', locationValue);

		});
	}

	// ##########################################
	// 								LOCATION MAP
	// ##########################################

	// Set active compartments from compartment list
	$('.compartment-list li a').each(function() {
		var planID = $(this).data('plan-id');
		$('#compartment-plan svg #'+planID).addClass('active');
	})

	// Mark hovered compartment from plan
	$('#compartment-plan svg .csunit').on('hover', function() {
		event.stopPropagation();
		var compartmentID = $(this).attr('id');
		$('.compartment-list li a[data-plan-id="'+ compartmentID +'"]').parent().toggleClass('active');
	});

	$('#compartment-plan svg .csunit').on('click', function () {
		event.stopPropagation();
		var compartmentID = $(this).attr('id');
		var $compartmentListItem = $('.compartment-list li a[data-plan-id="'+ compartmentID +'"]').parent();

		if($compartmentListItem.length) {
			$('.compartment-list li.selected').removeClass('selected');
			$compartmentListItem.addClass('selected');

			$('#compartment-plan svg .csunit.selected').removeClass('selected')
			$(this).addClass('selected')

			$('html, body').animate({scrollTop: $compartmentListItem.offset().top - 73}, 1000, function () {

					// location.hash = compartmentID;

					$compartmentListItem.focus();

					if ($compartmentListItem.is(":focus")) { //checking if the target was focused

						return false;

					} else {

						$compartmentListItem.attr('tabindex','-1'); //Adding tabindex for elements not focusable
						$compartmentListItem.focus(); //Setting focus
					};
				});
		}
	})

	$('.compartment-list li').on('mouseover', function() {
		var compartmentID = $(this).find('a').data('plan-id');
		$('#'+compartmentID).addClass('selected');
	})

	$('.compartment-list li').on('mouseout', function() {
		var compartmentID = $(this).find('a').data('plan-id');

		if($(this).hasClass('selected') == false) {
				$('#'+compartmentID).removeClass('selected');
		}

	})

	if($('#compartment-plan').length > 0 && $(window).width() > 767) {

		var containerMinHeight = $('#compartment-plan .compartment-plan-wrapper').height();
		$('#compartment-plan').css('min-height', containerMinHeight);

		$(window).on('scroll', function() {

			var offsetBottom = ($('#compartment-plan').offset().top + $('#compartment-plan').height()) - $('#compartment-plan .compartment-plan-wrapper').height();
			var offsetTop = $('#compartment-plan').offset().top;
			var currentScrollPosition = $(this).scrollTop() + 57;

			if(currentScrollPosition >= offsetTop && currentScrollPosition <= offsetBottom) {
				$('#compartment-plan').removeClass('absolute');
				$('#compartment-plan').addClass('fixed');
			} else if( currentScrollPosition >= offsetBottom) {
				$('#compartment-plan').removeClass('fixed');
				$('#compartment-plan').addClass('absolute');
			} else {
				$('#compartment-plan').removeClass('fixed');
				$('#compartment-plan').removeClass('absolute');
			}

		})
	}
})(jQuery);
