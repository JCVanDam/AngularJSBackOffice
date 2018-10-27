/*
** Snapcall Main
**
** about	: This file is the main entry point for Snapcall widget based on RequireJS
** version 	: 1.0.0
** created	: 09/12/2016
** updated	: 14/12/2016
** author	: Razvan Ludosanu
**
**
** To embed Snapcall widget into any website, copy-paste the two HTML lines below :
**
** <div class="snapcall" btn-type="popin" btn-bid="sdf751W21df" btn-name=""></div>
** <script data-main="https://snapcall.io/js/main.js" src="https://snapcall.io/js/require.js"></script>
**
** class	: [mandatory] the selector for DOM matching
** btn-type : [mandatory] the type of the widget (button, buttontxt, callbar or popin)
** btn-bid 	: [mandatory] the button ID ; needed to load related informations
** btn-name	: [optional]  the button name for widget customization
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
	},
	shim: {
		snapcall: ['jquery']
	}
});

requirejs(['snapcall'], function(Snapcall) {
	Snapcall.ready(function() {
		Snapcall.initWidget();
	});
});