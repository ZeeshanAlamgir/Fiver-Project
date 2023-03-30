/*!
  * https://github.com/PrestaShop/jquery.live-polyfill
  *
  * Released under the MIT license
  */
;(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {

  var oldInit = $.fn.init

  $.fn.init = function(selector) {
    var args = Array.prototype.slice.call(arguments);

    if (typeof selector === 'string' && selector === '#') {
      // JQuery( "#" ) is a bogus ID selector, but it returned an empty set before jQuery 3.0
      migrateWarn('jQuery(\'#\') is not a valid selector');
      args[0] = [];
    }

    var ret = oldInit.apply(this, arguments);
    ret.selector = typeof selector === 'string' ? selector : '';

    return ret;
  };

  $.fn.init.prototype = $.fn;

  if (typeof $.fn.live == 'undefined' || !($.isFunction($.fn.live))) {
    $.fn.extend({
      live: function (types, data, callback) {
        if (this.selector) {
          $(document).on(types, this.selector, data, callback);
        }

        console.warn('jQuery.live() has been removed since jquery v1.9, please use jQuery.on() instead.');
        return this;
      }
    });
  }
}));

(function($) {

	var current_screen_width = get_screen_width();

	var stagger_duration_in = 50;
	var stagger_duration_out = 70;

	$(window).scroll(set_scroll_class());

	$('.style-guide-preview.staggered').on('mouseenter', function(e) {

		var $toggle_targets = $('.style-guide-preview.staggered ul li');

		add_stagger_class($toggle_targets);

	});

	$('.style-guide-preview.staggered').on('mouseleave', function(e) {

		var $toggle_targets = $('.style-guide-preview.staggered ul li');

		remove_stagger_class($toggle_targets);

	});

	$('.animated-label input[type="text"], .animated-label input[type="number"], .animated-label input[type="email"], .animated-label input[type="password"], .animated-label input[type="tel"], .animated-label input[type="url"], .animated-label input[type="search"]').each(function() {

		var input_value = $(this).val();
		var field_wrap = $(this).closest('.field-wrap');

		if (!$(field_wrap).hasClass('form-error')) {

			if (input_value != '') {

				$(this).parent().addClass('field-has-value');

			}

			$(this).on('focus', function() {

				input_value = $(this).val();

				$(field_wrap).addClass('field-focused');

				if (input_value != '') {

					$(field_wrap).addClass('field-has-value');

				} else {

					$(field_wrap).removeClass('field-has-value');

				}

			});

			$(this).on('blur', function() {

				input_value = $(this).val();

				$(field_wrap).removeClass('field-focused');

				if (input_value != '') {

					$(field_wrap).addClass('field-has-value');

				} else {

					$(field_wrap).removeClass('field-has-value');

				}

			});
		}
	});

	/**
	*
	* Video Lightbox
	*
	*/

	$('.video-lightbox-trigger').magnificPopup({

		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false

	});

	/**
	*
	* Handle elements having data-permalink
	*
	*/

	$('*[data-permalink]').each(function() {

		var target_url = $(this).data('permalink');

		$(this).on('click', function(e) {

			e.preventDefault();

			location.href = target_url;

		});
	});


	/**
	*
	* Handle toggles having data-toggles
	*
	*/

	$('*[data-toggles]').each(function() {

		var toggle_target = $(this).data('toggles');

		$(this).on('click', function(e) {

			e.preventDefault();
			$(this).toggleClass('active');
			$('#' + toggle_target).toggleClass('active');
			// $('#' + toggle_target).fadeToggle();

		});
	});


	/**
	*
	* Owl Carousel
	*
	*/

	$('.owl-carousel').each(function() {
		$(this).owlCarousel({
			items: 2,
			responsiveClass:true,
			// center: true,
			mouseDrag : true,
			loop: false,
			dots: false,
			nav: false,
			// navText: ['<span class="prev-inner"></span>', '<span class="next-inner"></span>'],
			// animateIn: 'fadeIn',
			// animateOut: 'fadeOut',
			// autoplay: true,
			// autoplayHoverPause: true,
			// autoplaySpeed: 4000,
			// autoplayTimeout: 4000
			responsive : {
				0 : {
					items: 2,
				},
				767 : {
					items: 3,
				},
				991 : {
					items: 4,
				},
			}

		});
	})

	/**
	*
	* Carousel Popup
	*
	*/

	$('#gallery-carousel').magnificPopup({

		disableOn: 700,
		type: 'image',
		// mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false,
		gallery:{enabled:true},
		disableOn: 0,
		delegate: 'a', // child items selector, by clicking on it popup will open
	});

	/**
	*
	* Mobile Menu Toggle
	*
	*/

	$('.navbar-toggle-wrap').on('click', function() {
		$('#navigation-main-mobile').toggleClass('active');
	})

	/**
	*
	* Frequently used functions
	*
	*/

	function get_screen_width() {
		var window_width = $(window).width();
		return window_width;
	}

	function set_scroll_class() {

		var current_position = $(window).scrollTop();
		var trigger_position = 0;

		if (current_position > trigger_position) {

			$('body').addClass('scrolled');

		} else {

			$('body').removeClass('scrolled');

		}
	}

	/**
	*
	* Staggered Animation
	*
	*/

	function add_stagger_class($toggle_targets, duration = stagger_duration_in) {

		$toggle_targets.each(function(index) {

			var that = this;

			var t = setTimeout(function() {
				$(that).addClass('stagger');

			}, duration * index);

		});
	}

	function remove_stagger_class($toggle_targets, duration = stagger_duration_out) {

		$toggle_targets.each(function(index) {

			var that = this;
			var t = setTimeout(function() {

				$(that).removeClass('stagger');

			}, duration * index);

		});
	}

})(jQuery);
