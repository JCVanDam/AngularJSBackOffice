define(['jquery', 'jqueryjson', 'verto', 'is'], function() {

	$.fn.snapcall = function(options) {
		var self = this;
		var baseUrl = 'https://127.0.0.1/libsc/dev/app/';
		
		var verto = {
			handle: null,
			call: null
		};

		var widgets = [{
			bid: null,
			meta: {
				type: null,
				sip: null,
				queue: null,
				log: null,
				token: null
			},
			style: {
				button: {
					zIndex: 0,
					size: 50,
					positionStyle: "static",
					positionCoords: [null, null, null, null],
					marginCoords: [null, null, null, null],
					backgroundColor: "red",
					foregroundColor: "yellow",
					svg: {
						inactive: null,
						active: null,
						loading: null,
						hangup: null
					}
				},
				callbar: {
					unactiveColor: "#000000",
					activeColor: "#3B3131",
					textColor: "#FFFFFF"
				},
				popin: {}
			},
			dialog: {
				message: {
					service: "Snapcall",
					invite: "Besoin d'informations ? Appelez-nous gratuitement.",
					closed: "Service ferm&eacute;.",
					dialing: "Connection ...",
					rating: "Votre avis nous int&eacute;resse.",
					timer: "00:00"
				},
				error: {
					channel: "Cannaux occup&eacute;s",
					browser: "Pour accéder à cette fonctionnalité il est recommandé d'utiliser les navigateurs suivants ...",
					connect: "Echec de la connection",
					timeout: "Temps d'attente expir&eacute;"
				}
			}
		}];

		var config = {

			caller: {
				navigator: null,
				language: null,
				hostname: null,
				url: null,
				urlTitle: null,
				ip: null,
				location: null
			},
			verto: {
				handle: null,
				call: null,
				callback: null
			},
			etc: {
				timer: null,
				click: null,
				timeout: false,
				state: "inactive",
				mute: false
			}
		};

		console.log(config);

		/* VERTO */

		function bootstrapVerto() {
		    config.verto.handle = new $.verto({
		        login: "vertocust@g-test.seampl.io",
		        passwd: "welcome",
		        socketUrl: "wss://g-test.seampl.io:443",
		        tag: "webcam",
				sessid: config.meta.sessid,
				deviceParams: {
			    	useCamera: "none",
			    	useMic: "any",
		            useSpeak: "any"
				},
				iceServers: [{
					"urls": "turn:t.seampl.io:80?transport=tcp",
					"credential": "test",
					"username": "test"
				},
				{
					"urls": "turns:t.seampl.io:443?transport=tcp",
					"credential": "test",
				 	"username": "test"
				}]
		    }, {
				onDialogState: function(d) {
					config.verto.call = d;

					switch (d.state.name) {
						case 'requesting':
							break;
						
						case 'trying':
							break;
						
						case 'active':
							break;
						
						case 'hangup':
							break;

						case 'destroy':
							config.verto.call = null;
							break;
					}
				},
				onWSLogin: function() {
					$('#callstatus').html('onWSLogin');
					config.verto.call = null;
				},
				onWSLogout: function() {
					$('#callstatus').html('onWSLogout');
				},
				onWSClose: function() {
					if (config.meta.sessid) {
						window.close();
					}
				}
			});
		};

		function initVerto() {
			$.verto.init({skipPermCheck: false}, bootstrapVerto);
		};

		function makeCall() {
			if (config.verto.call) {
				return;
			}

			config.verto.call = config.verto.handle.newCall({
				destination_number: config.meta.bid, // TO BE REPLACED BY REAL BID
				caller_id_name: "vertocust",
				caller_id_number: "vertocust",
				outgoingBandwidth: "default",
				incomingBandwidth: "default",
				useVideo: false,
				useStereo: true,
				useCamera: "none",
				useMic: "any",
				useSpeak: "any",
				dedEnc: false,
				mirrorInput: false
			});
		};

		function hangupCall() {
			if (config.verto.handle) {
				config.verto.handle.hangup();
			}
		};

		/* INFORMATIONS GATHERING */

		function getButtonInfos(callback) {
			$.ajax({
				method: 'POST',
				url: baseUrl + 'php/button.info.php',
				data: { bid: config.meta.bid },
				success: function(res) {
					if (res !== 'null') {
						res = JSON.parse(res);

						$.extend(true, config.meta, res.meta);
						$.extend(true, config.style.button, res.style.button);
						$.extend(true, config.style.callbar, res.style.callbar);
						$.extend(true, config.dialog.message, res.dialog);

						if (callback && typeof(callback) === 'function') {
							callback();
						}
					} else {
						// Display database fetch error ...
					}
				},
				error: function(err) {
					console.log('Error > Could not gather button information');
					console.log(err);
				}
			});
		};

		function getToken() {
			var min = 100000000000000000;
			var max = 999999999999999999;

			return Math.floor(Math.random() * (max - min + 1)) + min;
		};

		function getNavigatorInfos() {
			var navigator = null;

			if (is.chrome()) {
				navigator = 'Chrome';
			} else if(is.firefox()) {
				navigator = 'Firefox';
			} else if(is.ie()) {
				navigator = 'Internet Explorer';
			} else if(is.edge()) {
				navigator = 'Edge';
			} else if(is.opera()) {
				navigator = 'Opera';
			} else if(is.safari()) {
				navigator = 'Safari';
			}

			config.caller.navigator = navigator;
			config.caller.language = window.navigator.language;
			config.caller.hostname = window.location.hostname;
			config.caller.url = encodeURIComponent(window.location.href);
			config.caller.urlTitle = document.title;
		};

		function getGeolocation() {
			$.ajax({
				method: 'GET',
				url: '//freegeoip.net/json/',
				data: null,
				success: function(res) {
					if (res) {
						config.caller.ip = res.ip;
						config.caller.location = res.city + ', ' + res.region_name + ', ' + res.country_name;
					}
				},
				error: function(err) {
					console.log('getGeolocation => error => ' + err);
				}
			});
		};

		/* DOM ELEMENTS */

		function svgToCss(svg) {
			return 'url(\'data:image/svg+xml;base64, ' + window.btoa(svg) + '\')';
		};

		function createDOMElements(callback) {
			var type = config.meta.type;
			var htmldir = baseUrl + 'html/';
			var cssdir = baseUrl + 'css/';

			$.get(cssdir + 'snapcall.css', function(css) {
			    if ($(document).find('style').length === 0) {
			        $('head').append('<style type="text/css"></style>');
			    }
				$('style').append(css);

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
			});
		};

		function setDOMElements() {
			config.style.button.svg.inactive = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve">
				<style type="text/css">.st0{fill:` + config.style.button.backgroundColor + `;}.st1{fill:` + config.style.button.foregroundColor + `;}</style>
				<title>Asset 1</title>
				<g id="Layer_2" transform="translate(0,10)">
					<path id="forme" class="st0" d="M-1211.7,781l-10.1,3.8c-0.4,0.1-0.8-0.1-0.9-0.4c0-0.1,0-0.3,0-0.4l3.7-10.2c-9.6-5.5-21.8-2.3-27.3,7.3c-5.5,9.6-2.3,21.8,7.3,27.3c9.6,5.5,21.8,2.3,27.3-7.3C-1208.1,794.8-1208.1,787.2-1211.7,781z"/>
					<g><path id="telB" class="st1" d="M-1236.9,783.4c-0.4,0.7-0.7,1.5-0.7,2.4c0.5,3.5,2.1,6.6,4.7,9c2.4,2.6,5.5,4.3,9,4.7c0.8,0,1.7-0.2,2.4-0.7c0.7-0.3,1.2-0.8,1.6-1.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.2-0.4-0.4-1-0.7l-0.7-0.4l-0.8-0.4l-0.7-0.4l-0.3-0.2c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0-0.5,0.2-0.6,0.4c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.7,0.8c-0.1,0.2-0.4,0.3-0.6,0.4c-0.1,0-0.2,0-0.3-0.1l-0.3-0.1l-0.3-0.1l-0.2-0.2c-1.1-0.6-2.1-1.4-3-2.2c-0.9-0.9-1.6-1.9-2.2-3l-0.1-0.2l-0.2-0.4c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.2,0.2-0.4,0.4-0.6c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.2-0.2,0.3-0.4,0.4-0.6c0-0.1,0-0.3-0.1-0.4c-0.1-0.2-0.2-0.3-0.3-0.5l-0.2-0.3l-0.5-0.7c-0.1-0.2-0.3-0.5-0.4-0.8l-0.4-0.7c-0.3-0.6-0.5-0.9-0.7-1c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0.1-0.9,0.1c-0.3,0.1-0.6,0.2-0.9,0.3C-1236.1,782.2-1236.6,782.7-1236.9,783.4z"/></g>
				</g>
				</svg>
			`);

			config.style.button.svg.loading = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve">
				<style type="text/css">.st0{fill-opacity:0;}</style>
				<title>Asset 1</title>
				<g id="Layer_2" transform="translate(0,10)">
					<g id="rond"><circle class="st0" cx="-1229" cy="791.1" r="20"/></g>
					<g id="base_point"><circle cx="-1238.5" cy="791.1" r="2.5"/><circle cx="-1229" cy="791.1" r="2.5"/><circle cx="-1219.5" cy="791.1" r="2.5"/></g>
				</g>
				</svg>
			`);

			config.style.button.svg.active = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="50px" viewBox="0 0 50.50 50.73">
					<defs>
						<style>
						.cls-0{fill:` + config.style.button.backgroundColor + `;}
						.cls-1{fill:#fff;}
						.cls-2,.cls-3{fill:none;}
						.cls-3{stroke:` + config.style.button.foregroundColor + `;stroke-linecap:round;stroke-miterlimit:10;stroke-width:1.67px;}
						@-webkit-keyframes ufo-big-lights {
						0% {stroke: #fff}
						50% {stroke: #000}
						100% {stoke: #fff}
						}
						@-moz-keyframes ufo-big-lights {
						0% {stroke: #fff}
						50% {stroke: #000}
						100% {stoke: #fff}
						}
						keyframes ufo-big-lights {
						0% {stroke: #fff}
						50% {stroke: #000}
						100% {stoke: #fff}
						}
						.ufo-big-lights-light {
						-webkit-animation: ufo-big-lights 2.5s ease infinite;
						-moz-animation: ufo-big-lights 2.5s ease infinite;
						animation: ufo-big-lights 2.5s ease infinite;
						}
						.ufo-big-lights-light--1 {
						-webkit-animation-delay: .2s;
						-moz-animation-delay: .2s;
						-animation-delay: .2s;
						}
						.ufo-big-lights-light--2 {
						-webkit-animation-delay: .4s;
						-moz-animation-delay: .4s;
						-animation-delay: .4s;
						}
						.ufo-big-lights-light--3 {
						-webkit-animation-delay: .6s;
						-moz-animation-delay: .6s;
						-animation-delay: .6s;
						}
						.ufo-big-lights-light--4 {
						-webkit-animation-delay: .8s;
						-moz-animation-delay: .8s;
						-animation-delay: .8s;
						}
						.ufo-big-lights-light--5 {
						-webkit-animation-delay: 1s;
						-moz-animation-delay: 1s;
						-animation-delay: 1s;
						}
						</style>
					</defs>
					<title>Asset 3</title>
					<g id="Layer_2" data-name="Layer 2">
						<g id="forme">
							<path class="cls-0" width="40px" height="40px" d="M37.28,20.69l-10.1,3.83a.7.7,0,0,1-.89-.88L30,13.45a20,20,0,1,0,7.23,7.23Z"/>
						</g>
						<g id="base">
							<path class="cls-1" d="M27.05,35a3.9,3.9,0,0,1-.21.66,2.56,2.56,0,0,1-1.17,1,3.29,3.29,0,0,1-1.8.49,11.17,11.17,0,0,1-6.77-3.54h0a11.17,11.17,0,0,1-3.54-6.77,3.31,3.31,0,0,1,.49-1.8,2.55,2.55,0,0,1,1-1.17,4,4,0,0,1,.66-.2,3.19,3.19,0,0,1,.68-.1.63.63,0,0,1,.21,0c.11,0,.29.28.51.73l.29.52.34.61.3.52.17.24a2.81,2.81,0,0,1,.21.34.62.62,0,0,1,.07.28.81.81,0,0,1-.27.48,4.6,4.6,0,0,1-.6.53,6,6,0,0,0-.59.51.73.73,0,0,0-.28.45.61.61,0,0,0,0,.22,1.45,1.45,0,0,0,.08.2l.14.24.11.18a9.51,9.51,0,0,0,3.94,3.94l.18.11.23.13.2.08a.63.63,0,0,0,.22,0c.11,0,.26-.09.44-.27a7.15,7.15,0,0,0,.51-.6,4.79,4.79,0,0,1,.53-.61.82.82,0,0,1,.48-.27.64.64,0,0,1,.28.07,3.13,3.13,0,0,1,.34.21l.24.17.52.3.61.34.52.29c.45.22.7.4.74.51a.59.59,0,0,1,0,.21A3.1,3.1,0,0,1,27.05,35Z"/>
							<path class="cls-1" d="M45.82,18.61a1.09,1.09,0,0,0-.75-1l-9.33-2.65L33,5.6a1.11,1.11,0,0,0-1-.75,1.1,1.1,0,0,0-1,.76L23.4,26a1.1,1.1,0,0,0,1.39,1.38l20.28-7.69A1.09,1.09,0,0,0,45.82,18.61Z"/>
							<path class="cls-2" d="M50.5,15,36.58,20l-8.47,3.14a.46.46,0,0,1-.47-.11.47.47,0,0,1-.11-.47l3.2-8.45L36.09,0Z"/>
							<g class="ufo-big-lights">
								<path class="cls-3 ufo-big-lights-light ufo-big-lights-light--1" d="M28.09,21.14a13.63,13.63,0,0,1,1.49,1.5"/>
								<path class="cls-3 ufo-big-lights-light ufo-big-lights-light--2" d="M33.22,21.28a16.21,16.21,0,0,0-3.76-3.76"/>
								<path class="cls-3 ufo-big-lights-light ufo-big-lights-light--3" d="M30.83,13.92a20.14,20.14,0,0,1,6,6"/>
								<path class="cls-3 ufo-big-lights-light ufo-big-lights-light--4" d="M40.4,18.66a23.75,23.75,0,0,0-8.24-8.27"/>
								<path class="cls-3 ufo-big-lights-light ufo-big-lights-light--5" d="M33.51,6.81A27.62,27.62,0,0,1,44,17.35"/>
							</g>
						</g>
					</g>
				</svg>
			`);

			config.style.button.svg.hangup = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 50 50">
					<defs><style>.cls-1{fill:red;}.cls-2{fill:#fff;}</style></defs>
					<title>Asset 1</title>
					<g id="Layer_2" data-name="Layer 2">
						<g id="Layer_1-2" data-name="Layer 1">
							<circle class="cls-1" cx="25" cy="25" r="25"/>
							<path class="cls-2" d="M11.56,28.27a6.14,6.14,0,0,1-.54-1,4.3,4.3,0,0,1,.18-2.6A5.53,5.53,0,0,1,12.73,22c2.85-2.21,6.49-3.82,12.17-3.81h0c5.68,0,9.32,1.61,12.17,3.81a5.51,5.51,0,0,1,1.53,2.7,4.29,4.29,0,0,1,.18,2.6,7.12,7.12,0,0,1-.54,1,5.49,5.49,0,0,1-.69.91,1,1,0,0,1-.28.21,2.81,2.81,0,0,1-1.47-.27l-1-.27-1.12-.32-1-.26-.48-.09a4.55,4.55,0,0,1-.65-.16,1,1,0,0,1-.41-.25,1.38,1.38,0,0,1-.24-.89,7.75,7.75,0,0,1,.08-1.34,10.63,10.63,0,0,0,.1-1.31,1.2,1.2,0,0,0-.2-.84,1,1,0,0,0-.32-.2l-.32-.14-.44-.12-.35-.08a17.07,17.07,0,0,0-4.65-.7,17.15,17.15,0,0,0-4.66.7l-.35.09-.43.12-.32.14a1,1,0,0,0-.32.2,1.22,1.22,0,0,0-.2.85,11.59,11.59,0,0,0,.1,1.31,7.73,7.73,0,0,1,.09,1.34,1.35,1.35,0,0,1-.25.89,1,1,0,0,1-.41.25,5.47,5.47,0,0,1-.65.16l-.48.09-1,.26-1.12.32-1,.28a2.86,2.86,0,0,1-1.47.26.91.91,0,0,1-.28-.21A5.35,5.35,0,0,1,11.56,28.27Z"/>
						</g>
					</g>
				</svg>
			`);

			// Button styling
			var btn = self.find('.snapcall-btn');
			var btnStyle = config.style.button;

			btn.css({
				'position' : btnStyle.positionStyle,
				'z-index' : btnStyle.zIndex,
				'width' : btnStyle.size + 'px',
				'height' : btnStyle.size + 'px',
				'background' : btnStyle.svg.inactive,
				'background-repeat' : 'no-repeat',
				'background-size' : btnStyle.size + 'px ' + btnStyle.size + 'px',
	            'top' : btnStyle.positionCoords[0],
	            'right' : btnStyle.positionCoords[1],
	            'bottom' : btnStyle.positionCoords[2],
	            'left' : btnStyle.positionCoords[3],
	            'margin-top' : btnStyle.marginCoords[0],
	            'margin-right' : btnStyle.marginCoords[1],
	            'margin-bottom' : btnStyle.marginCoords[2],
	            'margin-left' : btnStyle.marginCoords[3]
			});
		};

		function toggleState() {
			switch (config.etc.state) {
				case 'inactive':
					config.etc.state = 'loading';
					updateDOMElements('callLoading');
					break;

				case 'loading':
					config.etc.state = 'active';
					updateDOMElements('callActive');
					break;

				case 'active':
					config.etc.state = 'inactive';
					updateDOMElements('callInactive');
					break;
			}
		};

		function setDOMInteractions() {
			var btn = self.find('.snapcall-btn');

			switch (config.meta.type) {
				case 'button':
					btn.click(function() {
						toggleState();
					});
					break;
			}
		};

		function updateDOMElements(event) {
			switch (config.meta.type) {
				case 'button':
					var btn = self.find('.snapcall-btn');
					var style = config.style.button;

					switch (event) {
						case 'callLoading':
							btn.css({
								'background' : style.svg.loading,
								'background-size' : style.size + 'px ' + style.size + 'px'
							});
							break;

						case 'callActive':
							btn.css({
								'background' : style.svg.active,
								'background-size' : style.size + 'px ' + style.size + 'px'
							});
							break;

						case 'callInactive':
							btn.css({
								'background' : style.svg.inactive,
								'background-size' : style.size + 'px ' + style.size + 'px'
							});
							break;
					}
					break;
			}
		};

		/* INIT */

		(function() {
			config.meta.type = self.attr('btn-type');
			config.meta.bid = self.attr('btn-bid');

			$.extend(true, config.style, options);

			getButtonInfos(function() {
				createDOMElements(function() {
					setDOMElements();
					setDOMInteractions();
				});
			});
		
			getNavigatorInfos();
			getGeolocation();

			initVerto();
		})();

		return self;
	};
});