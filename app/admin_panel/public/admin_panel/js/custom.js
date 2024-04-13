jQuery(document).ready(function($) {
    "use strict"


    // PrettyPhoto Start
    if ($('.gallery').length) {
        $("area[data-rel^='prettyPhoto']").prettyPhoto();
        $(".gallery a[data-rel^='prettyPhoto']").prettyPhoto({
            animation_speed: 'normal',
            theme: 'facebook',
            slideshow: 3000,
            autoplay_slideshow: false,
        });
    }
    // PrettyPhoto End



    // News Ticker Start
    if ($('#newsticker').length) {
        $("#newsticker").newsticker({
            effect: "slide-h",
            autoplay: true,
            timer: 3000,
        });
    }
    // News Ticker End


    // Featured Slider Start
    if ($('#featured-slider').length) {
        $('#featured-slider').owlCarousel({
            loop: true,
            items: 1,
            margin: 0,
            dots: false,
            nav: true,
            single: true,
        });
    }
    // Featured Slider End


    // Blog Slider
    if ($('#blog-slider').length) {
        $('#blog-slider').owlCarousel({
            loop: true,
            items: 1,
            margin: 0,
            dots: true,
            nav: false,
            single: true,
        });
    }
    // Blog Slider End


    // Featured Slider Start
    if ($('#sidenews-slider').length) {
        $('#sidenews-slider').owlCarousel({
            loop: true,
            items: 1,
            margin: 0,
            dots: false,
            nav: true,
            single: true,
        });
    }
    // Featured Slider End



    // League Schedule Start
    if ($('#ls-slider').length) {
        $('#ls-slider').owlCarousel({
            loop: true,
            margin: 10,
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 2,
                    nav: false
                },
                1000: {
                    items: 3,
                    nav: true,
                    loop: false
                },
				
				1300: {
                    items: 4,
                    nav: true,
                    loop: false
                }
				
				
            }
        })
    }
    // League Schedule End




    // League Schedule Start
    if ($('#authors-slider').length) {
        $('#authors-slider').owlCarousel({
            loop: true,
			margin: 10,
            dots: false,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                    nav: true
                },
                600: {
                    items: 2,
                    nav: false
                },
                1000: {
                    items: 3,
                    nav: true,
                    loop: false
                }
				
            }
        })
    }
    // League Schedule End


    // League Schedule Start
    if ($('#experts-slider').length) {
        $('#experts-slider').owlCarousel({
            loop: true,
            nav: false,
            margin: 15,
            dots: true,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 1,
                },
                600: {
                    items: 2,
                },
                1000: {
                    items: 3,
                }
            }
        })
    }
    // League Schedule End


    if ($('audio').length) {
        $('audio').audioPlayer();
    }


    // Circle Chart Start
    if ($('.circlechart').length) {
        $('.circlechart').circlechart();
    }
    // Circle Chart End



    // Gallery Details Script
    if ($('.gallery-slide').length) {
        $('.gallery-slide').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            fade: true,
            asNavFor: '.gallery-nav'
        });
    }

    if ($('.gallery-nav').length) {
        $('.gallery-nav').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            asNavFor: '.gallery-slide',
            dots: true,
            centerMode: false,
            focusOnSelect: true,
        });
    }
    // Gallery Details Script End
	
	
	
	// Gallery Details Script
    if ($('.pro-slide').length) {
        $('.pro-slide').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false,
            fade: true,
            asNavFor: '.pro-nav'
        });
    }

    if ($('.pro-nav').length) {
        $('.pro-nav').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            asNavFor: '.pro-slide',
            dots: false,
            centerMode: false,
            focusOnSelect: true,
        });
    }
    // Gallery Details Script End
	



    // Show Hide Start
	if ($('.map-toggle').length) {
			$('.map-toggle').on("click", function() {
			var collapse_content_selector = $(this).attr('href');
			var toggle_switch = $(this);
			$(collapse_content_selector).toggle(function() {
				if ($(this).css('display') == 'none') {
					toggle_switch.html('Show Map');
				} else {
					toggle_switch.html('Hide Map');
				}
			});
		});
	}
    // Show Hide End
	
	
	 // Counter Start
	 if ($('#defaultCountdown').length) {
	var austDay = new Date();
	austDay = new Date(austDay.getFullYear() + 1, 1 - 1, 26);
	$('#defaultCountdown').countdown({until: austDay});
	$('#year').text(austDay.getFullYear());
	 }
	 // Counter End


    // ------- Main Banner ------- //
    if ($('#main-slide').length) {
        jQuery('#main-slide').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
            infinite: false,
            asNavFor: '#slides-thumnail',
        });
    }
    if ($('#slides-thumnail').length) {
        jQuery('#slides-thumnail').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            asNavFor: '#main-slide',
            dots: false,
            infinite: false,
            focusOnSelect: true,
            arrows: false,
            responsive: [{
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 481,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                }
            ]
        });
    }
	
	
	
	
	
	
	
	
    // ------- Price Rangge Slider ------- //
	if ($('#ranged-value').length) {
	 var s3 = $("#ranged-value").freshslider({
			range: true,
			step:1,
			value:[4, 60],
			onchange:function(low, high){
				console.log(low, high);
			}
		});
	}
		
	
	// if ($('.logo-nav').length) {
    // var $navbar = $(".logo-nav"),
    //     y_pos = $navbar.offset().top,
    //     height = $navbar.height();
    // $(document).on("scroll", function() {
    //     var scrollTop = $(this).scrollTop();
    //     if (scrollTop > y_pos + height) {
    //         $navbar.addClass("navbar-fixed").animate({
    //             top: 0
    //         });
    //     } else if (scrollTop <= y_pos) {
    //         $navbar.removeClass("navbar-fixed").clearQueue().animate({
    //             top: "-48px"
    //         }, 0);
    //     }
    // });
	// }

	
	
	
	
    // ------- Main Banner ------- //


    if ($('#map').length) {
        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            var mapOptions = {
                zoom: 11,
                center: new google.maps.LatLng(40.6700, -73.9400), // New York
                styles: [{
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#e9e9e9"
                    }, {
                        "lightness": 17
                    }]
                }, {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f5f5f5"
                    }, {
                        "lightness": 20
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 17
                    }]
                }, {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 29
                    }, {
                        "weight": 0.2
                    }]
                }, {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 18
                    }]
                }, {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#ffffff"
                    }, {
                        "lightness": 16
                    }]
                }, {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f5f5f5"
                    }, {
                        "lightness": 21
                    }]
                }, {
                    "featureType": "poi.park",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#dedede"
                    }, {
                        "lightness": 21
                    }]
                }, {
                    "elementType": "labels.text.stroke",
                    "stylers": [{
                        "visibility": "on"
                    }, {
                        "color": "#ffffff"
                    }, {
                        "lightness": 16
                    }]
                }, {
                    "elementType": "labels.text.fill",
                    "stylers": [{
                        "saturation": 36
                    }, {
                        "color": "#333333"
                    }, {
                        "lightness": 40
                    }]
                }, {

                    "elementType": "labels.icon",
                    "stylers": [{
                        "visibility": "off"
                    }]
                }, {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [{
                        "color": "#f2f2f2"
                    }, {
                        "lightness": 19
                    }]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.fill",
                    "stylers": [{
                        "color": "#fefefe"
                    }, {
                        "lightness": 20
                    }]
                }, {
                    "featureType": "administrative",
                    "elementType": "geometry.stroke",
                    "stylers": [{
                        "color": "#fefefe"
                    }, {
                        "lightness": 17
                    }, {
                        "weight": 1.2
                    }]
                }]
            };
            var mapElement = document.getElementById('map');
            var map = new google.maps.Map(mapElement, mapOptions);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(40.6700, -73.9400),
                map: map,
                title: 'Snazzy!'
            });
        }
    }













}); //End