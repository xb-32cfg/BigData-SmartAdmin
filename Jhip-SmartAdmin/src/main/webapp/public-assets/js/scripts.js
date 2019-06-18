(function($) {
	$(document).ready(function() {
		"use strict";
		
		
		
		// HAMBURGER
		$('.mobile-menu').on('click', function(e) {
			$('.header .site-nav').toggleClass('show-me');
		});
		
		
		$('.page-scroll').on('click', function(e) {
			$('.header .site-nav').removeClass('show-me');
		});
		

		
	
	});
	
})(jQuery);
