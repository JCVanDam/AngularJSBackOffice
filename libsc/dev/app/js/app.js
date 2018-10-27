requirejs.config({
	paths: {
		jquery: 'jquery/jquery.min',
		jqueryjson: 'jquery/jquery.json.min',
		verto: 'verto/verto.min',
		is: 'is/is.min',
		snapcall: 'snapcall/snapcall'
	}
});

requirejs(['jquery'], function($) {
	var baseUrl = 'https://127.0.0.1/libsc/dev/app/';

	/* Snapcall widget */
	$.fn.snapcallwidget = function(options) {
		var self = this;
		var settings = $.extend({
			meta: {
				type: null,
				bid: null,
				sip: null,
				queue: null,
				log: null,
				token: null,
				active: false
			},
			style: {
				button: {
					zIndex: 0,
					width: 50,
					height: 50,
					position: "static",
					top: null,
					right: null,
					bottom: null,
					left: null,
					marginTop: null,
					marginRight: null,
					marginBottom: null,
					marginLeft: null,
					background: "#000000",
					color: "#FFFFFF",
					borderRadius: '999px'
				},
				callbar: {
					inactive: {
						background: "#000000",
						color: "#FFFFFF"
					},
					active: {
						background: "#3B3131",
						color: "#FFFFFF"
					}
				},
				popin: {}
			},
			svg: {
				inactive: null,
				active: null,
				loading: null,
				hangup: null
			}
		}, options);

		function createDOMElements() {
			var type = settings.meta.type;
			var htmldir = baseUrl + 'html/';
			var cssdir = baseUrl + 'css/';

			switch (type) {
				case 'button':
					$.get(htmldir + 'button.html', function(html) {
						self.append(html);
						callback();
					});
					break;

				case 'callbar':
					$.get(htmldir + 'button.html', function(html) {
						self.append(html);
					});

					if ($(document).find('#snapcall-callbar').length === 0) {
						$.get(htmldir + 'callbar.html', function(html) {
							body.prepend(html);
							callback();
						});
					}
					break;

				case 'popin':
					if ($(document).find('#snapcall-popin').length === 0) {
						$.get(htmldir + 'popin.html', function(html) {
							self.append(html);
							callback();
						});
					}
					break;
			}
		};

		(function() {
			settings.meta.bid = self.attr('bid');
			settings.meta.type = self.attr('type');

			createDOMElements();
		})();
	};

	/* Snapcall object */
	function Snapcall(options) {
		this.settings = $.extend({
			credentials: {
		        login: "vertocust@g-test.seampl.io",
		        passwd: "welcome",
		        socketUrl: "wss://g-test.seampl.io:443",
				iceServers: [{
					"urls": "turn:t.seampl.io:80?transport=tcp",
					"credential": "test",
					"username": "test"
				}, {
					"urls": "turns:t.seampl.io:443?transport=tcp",
					"credential": "test",
				 	"username": "test"
				}]
		    },
		    verto: {
		    	call: null,
		    	handle: null,
		    	sessid: null,
		    	cid: null
		    }
		}, options);

		this.widgets = [];
	};

	Snapcall.prototype.init = function() {
		$.get(baseUrl + 'css/snapcall.css', function(css) {
		    if ($(document).find('style').length === 0) {
		        $('head').append('<style type="text/css"></style>');
		    }
			$('style').append(css);
		});
	};

	Snapcall.prototype.initWidgets = function() {
		var self = this;

		$('.snapcall').each(function() {
			$(this).snapcallwidget();
		});
	};

	Snapcall.prototype.customWidget = function(bid, options) {
		$('.snapcall[btn-bid = ' + bid + ']').find('.snapcall-btn').css(options);
	};

	Snapcall.prototype.initVerto = function() {};
	Snapcall.prototype.tryCall = function() {};
	Snapcall.prototype.makeCall = function() {};
	Snapcall.prototype.muteCall = function() {};
	Snapcall.prototype.hangupCall = function() {};

	var snapcall = new Snapcall();
	snapcall.init();
	snapcall.initWidgets();
	snapcall.customWidget('gjkSbDbeHVhAfRfl', {button: {width: '80px', height: '80px', background: 'red', color: 'yellow'}});
	snapcall.customWidget('a3GGdygS7l5uwH1m', {button: {background: 'gray', color: 'green'}});
	// snapcall.createWidgets();

});