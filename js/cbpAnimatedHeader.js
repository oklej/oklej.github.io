/**
 * cbpAnimatedHeader.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
var cbpAnimatedHeader = (function() {

	var docElem = document.documentElement,
		header = document.querySelector( '.navbar-default' ),
        siteName = document.querySelector( '.site-name'),
        siteSlogan = document.querySelector( '.site-slogan'),
        logo = document.querySelector( '.logo'),
		didScroll = false,
		changeHeaderOn = 100;

	function init() {
		window.addEventListener( 'scroll', function( event ) {
			if( !didScroll ) {
				didScroll = true;
				setTimeout( scrollPage, 250 );
			}
		}, false );
        classie.add(siteName,'navbar-full')
        classie.add(siteSlogan,'navbar-full')
        classie.add(header,'navbar-full')
        classie.add(logo,'navbar-full')
	}

	function scrollPage() {
		var sy = scrollY();
		if ( sy >= changeHeaderOn ) {
			classie.add( header, 'navbar-shrink' );
            classie.remove( siteName, 'navbar-full');
            classie.remove( siteSlogan, 'navbar-full');
            classie.remove( header, 'navbar-full');
            classie.remove(logo,'navbar-full');
		}
		else {
			classie.remove( header, 'navbar-shrink' );
            classie.add( siteName, 'navbar-full');
            classie.add( siteSlogan, 'navbar-full');
            classie.add( header, 'navbar-full');
            classie.add( logo, 'navbar-full');
		}
		didScroll = false;
	}

	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}

	init();

})();