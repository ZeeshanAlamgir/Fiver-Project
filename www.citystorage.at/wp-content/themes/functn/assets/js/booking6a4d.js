(function($) {

	/**
	*
	* Toggle Booking Form Step 1
	*
	*/

	$('.toggle-booking-form').live('click', function(e) {

		e.preventDefault();

		var payLoad = $(this).data();

		$.ajax({

			url : location_obj.ajaxUrl, // AJAX handler
			data : {

				action: 'get_booking_form',
				payload: payLoad
			},

			type : 'POST',
			dataType: 'json',
			success : function(data) {

				$('#main-content').append(data);

				// NOTE: this is a FIX! if removed gform sets wrong action
				$('form').attr('action', '#');

			},
			error : function() {

				console.log('error');
			}
		});

		return false;

	});

	/**
	*
	* Prefill Data in Step 2
	*
	*/

	$('.rate-option').live('click', function(e) {

		e.preventDefault();

		var step2Container = $(this).closest('.booking-form').find('.form-step-2');
		var step3Container = $(this).closest('.booking-form').find('.form-step-3');

		var data = $(this).data();

		if (data.type != '') {

			$(step2Container).find('.type').html(data.type);
		}

		if (data.area != '' && data.areaUnit != '') {

			$(step2Container).find('.area').html(data.area + ' ' + data.areaUnit);
		}

		if (data.planId != '') {

			$(step2Container).find('.plan-id').html('(' + data.planId + ')');
			$(step2Container).find('.compartment-id input').val(data.planId);
			$(step2Container).find('.compartment-id input').attr('readonly', 'readonly');
		}

		if (data.price != '' && data.priceCurrency != '') {

			$(step2Container).find('.price').html(data.priceCurrency + ' ' + data.price);
			$(step2Container).find('.compartment-rate input').val(data.priceCurrency + ' ' + data.price);
			$(step2Container).find('.compartment-rate input').attr('readonly', 'readonly');
		}

		if (data.priceBase != '' && data.priceCurrency != '') {
			$(step2Container).find('.compartment-rate-base input').val(data.priceCurrency + ' ' + data.priceBase);
			$(step2Container).find('.compartment-rate-base input').attr('readonly', 'readonly');
		}

		if (data.duration && data.duration != '') {
			$(step2Container).find('.duration').html(data.duration + ', ');

			$(step2Container).find('.compartment-duration input').val(data.duration);
			$(step2Container).find('.compartment-duration input').attr('readonly', 'readonly');

		} else {
			$(step2Container).find('.duration').html('');
		}

		if (data.locationTitle != '') {

			$(step2Container).find('.location-name input').val(data.locationTitle);
		}

		if (data.type != '' && data.area != '' && data.areaUnit != '') {

			$(step2Container).find('.compartment-name input').val(data.type + ' ' + data.area + ' ' + data.areaUnit);
			$(step2Container).find('.compartment-name input').attr('readonly', 'readonly');
		}

		if (data.invoicingcompany != '') {

			$(step2Container).find('.compartment-invoicingcompany input').val(data.invoicingcompany);
			$(step2Container).find('.compartment-invoicingcompany input').attr('readonly', 'readonly');
		}

		setStepActive(2);

	});

	/**
	*
	* Close Overlay
	*
	*/

	$('.booking-form').after().live('click', function(event) {
		if($(event.target).attr('id') == 'booking-form') {
			$('#booking-form').remove();
		}
	});

	$('.close-booking-form').live('click', function(event) {
		$('#booking-form').remove();
	});

	/**
	*
	* Go step back
	*
	*/
	$('.form-step-back').live('click', function(event) {
		setStepActive(1);
	});

	$(document).on('gform_confirmation_loaded', function(event, formId){
		var confirmationMessage = $('#gform_confirmation_wrapper_1').clone();
		var step3Container = $('#booking-form').find('.form-step-3');

		step3Container.append(confirmationMessage);

		setStepActive(3);

	});

	function setStepActive(stepNumber) {

		if(stepNumber == 2) {
			$('.form-step-back').removeAttr('disabled');
		} else {
			$('.form-step-back').attr('disabled', 'true');
		}

		$('.form-step.active').removeClass('active');
		$('.form-step-'+stepNumber).addClass('active');

		$('.progress-heading-step.active').removeClass('active');
		$('.progress-heading-step.step-'+stepNumber).addClass('active');

		$('.booking-form-progress .progress-step').removeClass('active');
		for (var i = 1; i <= stepNumber; i++) {
				$('.booking-form-progress .progress-step-'+i).addClass('active');
		}

	}

})(jQuery);
