$.noConflict();

jQuery(document).ready(function($) {

	"use strict";

	[].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
		new SelectFx(el);
	} );

	jQuery('.selectpicker').selectpicker;


	$('#menuToggle').on('click', function(event) {
		$('body').toggleClass('open');
	});

	$('.search-trigger').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').addClass('open');
	});

	$('.search-close').on('click', function(event) {
		event.preventDefault();
		event.stopPropagation();
		$('.search-trigger').parent('.header-left').removeClass('open');
	});

	// $('.user-area> a').on('click', function(event) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	$('.user-menu').parent().removeClass('open');
	// 	$('.user-menu').parent().toggleClass('open');
	// });

	
	//$(".menu-item-has-children a").each()



	$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").closest(".menu-item-has-children").addClass("show");
	$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").closest(".sub-menu").addClass("show");
	$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").parent().css("background","#666666");
	$("#left-panel .menu-item-has-children.show > a").closest("a[aria-expanded]").attr("aria-expanded","ture");
	


	$("#left-panel .sub-menu li").on('click',function(event){
	

		setTimeout(
			function() 
			{
				//remove
				$("#left-panel .menu-item-has-children").removeClass("show");
				$("#left-panel .sub-menu").removeClass("show");
				$("#left-panel a[aria-expanded]").attr("aria-expanded","false");
				$("#left-panel .sub-menu > li").removeAttr("style");

				//add 
				$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").closest(".menu-item-has-children").addClass("show");
				$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").closest(".sub-menu").addClass("show");
				$("#left-panel .menu-item-has-children.show > a").closest("a[aria-expanded]").attr("aria-expanded","ture");
				$("#left-panel a[href='" +window.location.href.substr(window.location.origin.length) + "']").parent().css("background","#666666");
			
			}, 150);

		
	});
});

