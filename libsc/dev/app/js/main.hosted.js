/*
** Snapcall Main for hosted call transfert page
**
** about	: This file is the main entry point for Snapcall widget based on RequireJS
** version 	: 1.0.0
** created	: 09/12/2016
** updated	: 14/12/2016
** author	: Razvan Ludosanu
*/

requirejs.config({
	paths: {
		jquery: 'jquery/jquery.min',
		json: 'jquery/jquery.json.min',
		verto: 'verto/verto.min',
		is: 'is/is.min',
		snapcall: 'snapcall/master.snapcall',
		snapcallwidget: 'snapcall/jquery.snapcallwidget',
		sublimrate: 'snapcall/jquery.sublimrate',
		ltracker: 'loggly.tracker'
	}
});

requirejs(['jquery', 'snapcall'], function($, Snapcall) {
	Snapcall.ready(function() {
		Snapcall.meta.wid = 1;
		Snapcall.initWidget([
			{
				name: 'hosted-custom',
				options: {
					css: {
						position: 'fixed',
						zIndex: '3',
						top: '130px',
						left: '50%',
						margin: '0px 0px 0px -100px',
						width: '200px',
						height: '200px',
						textColor: '#333333'
					}
				}
			}
		], function() {
			Snapcall.initVerto();
		});
	});
});