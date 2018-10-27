/*
** jQuery Snapcall Widget Plugin
**
** about	: This plugin defines interactions between Snapcall object, the DOM document and jQuery Verto library
** version 	: 1.0.0
** created	: 09/12/2016
** updated	: 15/12/2016
** author	: Razvan Ludosanu
*/

define(['jquery', 'sublimrate'], function($, sublimrate) {
	$.fn.snapcallwidget = function(wid) {
		var self = this;

		// Stores the CSS
		var css = {
			button: {
				position: 'static',
				top: null,
				bottom: null,
				left: null,
				right: null,
				width: '70px',
				height: '70px',
				background: 'black',
				foreground: 'white',
				margin: '0px auto',
				textColor: 'black',
				textSize: '15px',
				textAlign: 'center',
				svg: {}
			},
			callbar: {
				position: 'fixed',
				top: '0px',
				left: '0px',
				width: '100%',
				height: '70px',
				background: 'black',
				backgroundActive: 'gray',
				color: 'white',
				fontFamily: 'Arial, sans-serif'
			},
			popin: {
				color: 'black',
				logo: 'https://sandbox.seampl.io/libsc/dev/sncf/img/sncf_logo.png'
			}
		};

		// Stores informations about the button
		var meta = {
			type: self.attr('btn-type'),
			wid: wid,
			bid: self.attr('btn-bid'),
			name: self.attr('btn-name'),
			sip: null,
			queue: null,
			log: null,
			timer: null
		};

		// Stores the dialogs
		var dialog = {
			message: {
				service: "Snapcall",
				invite: "Besoin d'informations ? Appelez-nous gratuitement.",
				closed: "Service ferm&eacute;.",
				dialing: "Connection ...",
				ongoing: "En relation avec un conseiller ...",
				recovering: "Recuperation de l'appel ...",
				rating: "Votre avis nous int&eacute;resse.",
				timer: "00:00"
			},
			error: {
				channel: `Tous nos op&eacute;rateurs sont en ligne, nous vous invitons &agrave; renouveler votre appel.`,
				navigator: `
					Pour acc&eacute;der &agrave; cette fonctionnalit&eacute; il est recommand&eacute; d'utiliser les navigateurs suivants&nbsp;&nbsp;
					<a href="https://www.google.com/chrome/browser/desktop/index.html" target="_blank"><span class="fa fa-chrome"></span></a>&nbsp;&nbsp;
					<a href="https://www.mozilla.org/en-US/firefox/products/" target="_blank"><span class="fa fa-firefox"></span></a>
				`,
				connect: `Echec de la connection au service, nous vous invitons &agrave; renouveler votre appel.`,
				timeout: `Votre temps d'attente est expir&eacute;, nous vous invitons &agrave; renouveler votre appel.`,
				unsafe: `<span class="fa fa-unlock-alt"></span>&nbsp;&nbsp;Impossible d'&eacute;tablir une connection s&eacute;curis&eacute;e, passez en https`
			}
		};

		// Customize plugin CSS and Dialogs
		function customObject(options) {
			switch (meta.type) {
				case 'button':
				case 'buttontxt':
				case 'callbar':
					if (typeof(options.css) !== 'undefined') {
						$.extend(true, css.button, options.css);
					}
					break;

				case 'popin':
					if (typeof(options.css) !== 'undefined') {
						$.extend(true, css.popin, options.css);
					}
					break;

				default:
					break;
			}

			if (typeof(options.dialog) !== 'undefined') {
				$.extend(true, dialog, options.dialog);
			}
		}

		// Creates DOM elements
		function createObject() {
			switch (meta.type) {
				case 'button':
					createObjectButton();
					break;

				case 'buttontxt':
					createObjectButtontxt();
					break;

				case 'callbar':
					createObjectCallbar();
					break;

				case 'popin':
					createObjectPopin();
					break;
			}
			updateObject();
		}

		function createObjectButton() {
			// Html 
			self.append('<div class="snapcall-btn" ></div>');
			self.append('<div class="rating"></div>');

			// Events 
			self.find('.snapcall-btn').click(function() {
				if (Snapcall.meta.state === Snapcall.states.inactive) {
					updateDOM('dialing');
				}
				Snapcall.tryCall(meta.wid);
			});

			var bsize = css.button.width + ' ' + css.button.height;
			self.find('.snapcall-btn').hover(function() {
				if (Snapcall.meta.state === Snapcall.states.requesting || Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.hangup,
						backgroundSize: bsize
					});
				}
			}, function() {
				if (Snapcall.meta.state === Snapcall.states.requesting) {
					$(this).css({
						background: css.button.svg.requesting,
						backgroundSize: bsize
					});
				} else if (Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.active,
						backgroundSize: bsize
					});
				}
			});

			self.find('.rating').sublimrate({
				callback: function(rate) {
					Snapcall.logRating({
						log_id: meta.log,
						rating: rate
					});
					updateDOM('reset');
				}
			});
		}

		function createObjectButtontxt() {
			// Html 
			self.append('<div class="snapcall-btn"></div>');
			self.append('<div class="rating"></div>');
			self.append('<div class="dialog">' + dialog.message.invite + '</div>');

			// Events 
			self.find('.snapcall-btn').click(function() {
				if (Snapcall.isBrowserSupported === false) {
					updateDOM('errorNavigator');
				} else {
					if (Snapcall.meta.state === Snapcall.states.inactive) {
						updateDOM('dialing');
					}
					Snapcall.tryCall(meta.wid);
				}
			});

			var bsize = css.button.width + ' ' + css.button.height;
			self.find('.snapcall-btn').hover(function() {
				if (Snapcall.meta.state === Snapcall.states.requesting || Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.hangup,
						backgroundSize: bsize
					});
				}
			}, function() {
				if (Snapcall.meta.state === Snapcall.states.requesting) {
					$(this).css({
						background: css.button.svg.requesting,
						backgroundSize: bsize
					});
				} else if (Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.active,
						backgroundSize: bsize
					});
				}
			});

			self.find('.rating').sublimrate({
				callback: function(rate) {
					Snapcall.logRating({log_id: meta.log, rating: rate});
					updateDOM('reset');
				}
			});
		}

		function createObjectCallbar() {
			// HTML
			self.append('<div class="snapcall-btn"></div>');

			if ($(document).find('#snapcall-callbar').length === 0) {
				$('body').prepend(`
					<div id="snapcall-pushbar"></div>
					<div id="snapcall-callbar">
						<div class="logo"><img src="` + Snapcall.baseURL + `img/svg/snapcall_white.svg" /></div>
						<div class="service"></div>
						<div class="dialog"></div>
						<div class="rating"></div>
						<div class="mute"><img src="` + Snapcall.baseURL + `img/svg/mic_on.svg" /></div>
						<div class="detach"><img src="` + Snapcall.baseURL + `img/svg/upload.svg" /></div>
						<div class="hangup"><img src="` + Snapcall.baseURL + `img/svg/phone_hangup.svg" /></div>
					</div>
				`);

				$('#snapcall-callbar .rating').sublimrate({
					color: {
						inactive: 'white',
						active: 'yellow'
					},
					size: '20px',
					callback: function(rate) {
						Snapcall.logRating({
							log_id: meta.log,
							rating: rate
						});
						updateDOM('hide');
					}
				});
			}

			// Events
			self.find('.snapcall-btn').click(function() {
				updateDOM('reset');
				if (Snapcall.isBrowserSupported === false) {
					updateDOM('errorNavigator');
				}
				updateDOM('show');
			});
		}

		function createObjectPopin() {
			// HTML
			if ($(document).find('#snapcall-popin').length === 0) {
				self.append(`
					<div id="snapcall-popin">
						<div class="header">
							<div class="logo"></div>
							<div class="invite">` + dialog.message.service + `</div>
							<div class="controls">
								<span class="fa fa-chevron-up toggle-popin"></span>
								<span class="fa fa-expand detach-popin"></span>
							</div>
						</div>
						<div class="body">
							<div class="snapcall-btn"></div>
							<div class="rating"></div>
							<div class="dialog">` + dialog.message.invite + `</div>
						</div>
					</div>
				`);
			}

			// Events
			self.find('.snapcall-btn').click(function() {
				if (Snapcall.isBrowserSupported === false) {
					updateDOM('errorNavigator');
				} else {
					if (Snapcall.meta.state === Snapcall.states.inactive) {
						updateDOM('dialing');
					}
					Snapcall.tryCall(meta.wid);
				}
			});

			var bsize = css.button.width + ' ' + css.button.height;
			self.find('.snapcall-btn').hover(function() {
				if (Snapcall.meta.state === Snapcall.states.requesting || Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.hangup,
						backgroundSize: bsize
					});
				}
			}, function() {
				if (Snapcall.meta.state === Snapcall.states.requesting) {
					$(this).css({
						background: css.button.svg.requesting,
						backgroundSize: bsize
					});
				} else if (Snapcall.meta.state === Snapcall.states.active) {
					$(this).css({
						background: css.button.svg.active,
						backgroundSize: bsize
					});
				}
			});

			self.find('#snapcall-popin .rating').sublimrate({
				callback: function(rate) {
					Snapcall.logRating({log_id: meta.log, rating: rate});
					updateDOM('reset');
				}
			});

			self.find('#snapcall-popin .controls .toggle-popin').click(function() {
				updateDOM('toggle');
			});

			self.find('#snapcall-popin .controls .detach-popin').click(function() {
				updateDOM('transfering');
			});
		}

		// Updates CSS of existing DOM elements
		function updateObject() {
			var svgToCss = function(svg) {
				return 'url(\'data:image/svg+xml;base64, ' + window.btoa(svg) + '\')';
			};

			css.button.svg.inactive = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve">
				<style type="text/css">.st0{fill:` + css.button.background + `;}.st1{fill:` + css.button.foreground + `;}</style>
				<title>Asset 1</title>
				<g id="Layer_2" transform="translate(0,10)">
					<path id="forme" class="st0" d="M-1211.7,781l-10.1,3.8c-0.4,0.1-0.8-0.1-0.9-0.4c0-0.1,0-0.3,0-0.4l3.7-10.2c-9.6-5.5-21.8-2.3-27.3,7.3c-5.5,9.6-2.3,21.8,7.3,27.3c9.6,5.5,21.8,2.3,27.3-7.3C-1208.1,794.8-1208.1,787.2-1211.7,781z"/>
					<g><path id="telB" class="st1" d="M-1236.9,783.4c-0.4,0.7-0.7,1.5-0.7,2.4c0.5,3.5,2.1,6.6,4.7,9c2.4,2.6,5.5,4.3,9,4.7c0.8,0,1.7-0.2,2.4-0.7c0.7-0.3,1.2-0.8,1.6-1.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.2-0.4-0.4-1-0.7l-0.7-0.4l-0.8-0.4l-0.7-0.4l-0.3-0.2c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0-0.5,0.2-0.6,0.4c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.7,0.8c-0.1,0.2-0.4,0.3-0.6,0.4c-0.1,0-0.2,0-0.3-0.1l-0.3-0.1l-0.3-0.1l-0.2-0.2c-1.1-0.6-2.1-1.4-3-2.2c-0.9-0.9-1.6-1.9-2.2-3l-0.1-0.2l-0.2-0.4c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.2,0.2-0.4,0.4-0.6c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.2-0.2,0.3-0.4,0.4-0.6c0-0.1,0-0.3-0.1-0.4c-0.1-0.2-0.2-0.3-0.3-0.5l-0.2-0.3l-0.5-0.7c-0.1-0.2-0.3-0.5-0.4-0.8l-0.4-0.7c-0.3-0.6-0.5-0.9-0.7-1c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0.1-0.9,0.1c-0.3,0.1-0.6,0.2-0.9,0.3C-1236.1,782.2-1236.6,782.7-1236.9,783.4z"/></g>
				</g>
				</svg>
			`);

			css.button.svg.requesting = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve">
				<style type="text/css">.st0{fill-opacity:0;}</style>
				<title>Asset 1</title>
				<g id="Layer_2" transform="translate(0,10)">
					<g id="rond"><circle class="st0" cx="-1229" cy="791.1" r="20"/></g>
					<g id="base_point"><circle cx="-1238.5" cy="791.1" r="2.5"/><circle cx="-1229" cy="791.1" r="2.5"/><circle cx="-1219.5" cy="791.1" r="2.5"/></g>
				</g>
				</svg>
			`);

			css.button.svg.active = svgToCss(`
				<svg xmlns="http://www.w3.org/2000/svg"  width="50px" height="50px" viewBox="0 0 50.50 50.73">
					<defs>
						<style>
						.cls-0{fill:` + css.button.background + `;}
						.cls-1{fill:#fff;}
						.cls-2,.cls-3{fill:none;}
						.cls-3{stroke:` + css.button.foreground + `;stroke-linecap:round;stroke-miterlimit:10;stroke-width:1.67px;}
						@-webkit-keyframes ufo-big-lights {0% {stroke: #fff}50% {stroke: #000}100% {stoke: #fff}}
						@-moz-keyframes ufo-big-lights {0% {stroke: #fff} 50% {stroke: #000} 100% {stoke: #fff} }
						keyframes ufo-big-lights {0% {stroke: #fff} 50% {stroke: #000} 100% {stoke: #fff} }
						.ufo-big-lights-light {-webkit-animation: ufo-big-lights 2.5s ease infinite;-moz-animation: ufo-big-lights 2.5s ease infinite;animation: ufo-big-lights 2.5s ease infinite;}
						.ufo-big-lights-light--1 {-webkit-animation-delay: .2s;-moz-animation-delay: .2s;-animation-delay: .2s;}
						.ufo-big-lights-light--2 {-webkit-animation-delay: .4s;-moz-animation-delay: .4s;-animation-delay: .4s;}
						.ufo-big-lights-light--3 {-webkit-animation-delay: .6s;-moz-animation-delay: .6s;-animation-delay: .6s;}
						.ufo-big-lights-light--4 {-webkit-animation-delay: .8s;-moz-animation-delay: .8s;-animation-delay: .8s;}
						.ufo-big-lights-light--5 {-webkit-animation-delay: 1s;-moz-animation-delay: 1s;-animation-delay: 1s;}
						</style>
					</defs>
					<title>Asset 3</title>
					<g id="Layer_2" data-name="Layer 2">
						<g id="forme"><path class="cls-0" width="40px" height="40px" d="M37.28,20.69l-10.1,3.83a.7.7,0,0,1-.89-.88L30,13.45a20,20,0,1,0,7.23,7.23Z"/></g>
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

			css.button.svg.hangup = svgToCss(`
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

			// Button
			self.find('.snapcall-btn').css({
				position: css.button.position,
				zIndex: css.button.zIndex,
				top: css.button.top,
				bottom: css.button.bottom,
				left: css.button.left,
				right: css.button.right,
				width: css.button.width,
				height: css.button.height,
				margin: css.button.margin,
				background: css.button.svg.inactive
			});

			// Buttontxt
			self.find('.dialog').css({
				color: css.button.textColor,
				textAlign: css.button.textAlign,
				fontSize: css.button.textSize
			});

			// Popin
			self.find('#snapcall-popin').css({
				color: css.popin.color
			});

			self.find('#snapcall-popin .logo').css({
				backgroundImage: 'url(\'' + css.popin.logo + '\')'
			});
		}

		// Fetch object datas
		function fetchDatas(success, failure) {
			$.ajax({
				method: 'POST',
				url: Snapcall.baseURL + 'php/button.info.php',
				data: {
					bid: meta.bid
				},
				success: function(res) {
					if (res !== 'null') {
						res = JSON.parse(res);

						$.extend(true, css, res.css);
						$.extend(true, meta, res.meta);
						$.extend(true, dialog, res.dialog);

						if (typeof(success) === 'function') {
							success('Datas retreived for bid: ' + meta.bid);
						}
					} else {
						if (typeof(failure) === 'function') {
							failure('Nothing to retreive for bid: ' + meta.bid);
						}
					}
				},
				error: function(err) {
					if (typeof(failure) === 'function') {
						failure(err);
					}
				}
			});
		}

		// Updates dialogs and actions
		function updateDOM(event) {
			switch (meta.type) {
				case 'button':
					var button = self.find('.snapcall-btn');
					var divrating = self.find('.rating');
					var svg = css.button.svg;
					var size = css.button.width + ' ' + css.button.height;

					switch (event) {
						case 'dialing':
							button.css({
								background: svg.requesting,
								backgroundSize: size
							});
							break;

						case 'active':
							button.css({
								background: svg.active,
								backgroundSize: size
							});
							break;

						case 'hangup':
							button.css({
								background: svg.inactive,
								backgroundSize: size
							}).hide();
							divrating.show();
							break;

						case 'reset':
							button.css({
								background: svg.inactive,
								backgroundSize: size
							}).show();
							divrating.hide();
							break;
					}
					break;

				case 'buttontxt':
					var button = self.find('.snapcall-btn');
					var divrating = self.find('.rating');
					var divdialog = self.find('.dialog');
					var svg = css.button.svg;
					var size = css.button.width + ' ' + css.button.height;

					switch (event) {
						case 'dialing':
							button.css({
								background: svg.requesting,
								backgroundSize: size
							});
							divdialog.html(dialog.message.dialing);
							break;

						case 'active':
							button.css({
								background: svg.active,
								backgroundSize: size
							});
							divdialog.html(dialog.message.ongoing);
							break;

						case 'hangup':
							button.css({
								background: svg.inactive,
								backgroundSize: size
							}).hide();
							divdialog.html(dialog.message.rating);
							divrating.show();
							break;

						case 'reset':
							button.css({
								background: svg.inactive,
								backgroundSize: size
							}).show();
							divrating.hide();
							divdialog.html(dialog.message.invite);
							break;
					}
					break;

				case 'callbar':
					var callbar = $('#snapcall-callbar');
					var pushbar = $('#snapcall-pushbar');
					var divrating = $('#snapcall-callbar .rating');
					var divservice = $('#snapcall-callbar .service');
					var divdialog = $('#snapcall-callbar .dialog');
					var cmdmute = $('#snapcall-callbar .mute img');
					var cmdhangup = $('#snapcall-callbar .hangup img');
					var cmddetach = $('#snapcall-callbar .detach img');

					switch (event) {
						case 'show':
							if (Snapcall.verto.call === null) {
								if (callbar.css('display') === 'none') {
									pushbar.slideDown();
									callbar.slideDown();
								}
							}
							break;

						case 'hide':
							if (Snapcall.verto.call === null) {
								if (callbar.css('display') !== 'none') {
									pushbar.slideUp();
									callbar.slideUp();
								}
							}
							break;

						case 'dialing':
							divdialog.html(dialog.message.dialing);
							break;

						case 'requesting':
							cmdmute.show().click(function() {
								var img = $('#snapcall-callbar .mute img');
								
								if (Snapcall.meta.isCallMuted === true) {
									img.attr('src', Snapcall.baseURL + 'img/svg/mic_on.svg');
								} else {
									img.attr('src', Snapcall.baseURL + 'img/svg/mic_off.svg');
								}
								Snapcall.muteCall();
							});
							
							cmddetach.show().click(function() {
								updateDOM('transfering');
							});

							cmdhangup.show().click(function() {
								Snapcall.hangupCall();
							});
							break;

						case 'transfering':
							resetCallTimer();
							if (callbar.css('display') !== 'none') {
								pushbar.slideUp();
								callbar.slideUp();
							}
							window.open(Snapcall.baseURL + 'hosted.php?bid=' + meta.bid);
							break;

						case 'recovering':
							if (callbar.css('display') === 'none') {
								pushbar.slideDown();
								callbar.slideDown();
							}
							divdialog.show().html(dialog.message.recovering);
							cmdmute.show().click(function() {
								Snapcall.muteCall();
							});
							cmdhangup.show().click(function() {
								Snapcall.hangupCall();
							});
							break;

						case 'active':
							startCallTimer();
							callbar.css({
								background: css.callbar.backgroundActive
							});
							break;

						case 'hangup':
							resetCallTimer();
							cmdmute.hide();
							cmddetach.hide();
							cmdhangup.hide();
							divdialog.hide();
							divrating.show();
							if ($(window).width() >= 600) {
								divrating.prepend(dialog.message.rating);
							}
							break;

						case 'reset':
							if (Snapcall.verto.call === null) {
								callbar.css({
									background: css.callbar.background
								});
								divservice.html(dialog.message.service);
								divdialog.html(dialog.message.invite + '<span class="cmd-call">OK</span><span class="cmd-cancel">Annuler</span>');
								divrating.hide();
								divdialog.show();
								divdialog.find('.cmd-call').click(function() {
									updateDOM('dialing');
									Snapcall.tryCall(meta.wid);
								});
								divdialog.find('.cmd-cancel').click(function() {
									updateDOM('hide');
								});
							}
							break;

						case 'errorChannel':
							divdialog.html(dialog.error.channel + '<span class="cmd-cancel">Fermer</span>');
							divdialog.find('.cmd-cancel').click(function() {
								updateDOM('hide');
							});
							break;

						case 'errorNavigator':
							divdialog.html(dialog.error.navigator + '<span class="cmd-cancel">Fermer</span>');
							divdialog.find('.cmd-cancel').click(function() {
								updateDOM('hide');
							});
							break;

						case 'errorTimeout':
							divdialog.html(dialog.error.timeout + '<span class="cmd-cancel">Fermer</span>');
							divdialog.find('.cmd-cancel').click(function() {
								updateDOM('hide');
							});
							break;

						case 'errorConnect':
							divdialog.html(dialog.error.connect + '<span class="cmd-cancel">Fermer</span>');
							divdialog.find('.cmd-cancel').click(function() {
								updateDOM('hide');
							});
							break;

						case 'errorUnsafe':
							divdialog.html(dialog.error.unsafe + '<span class="cmd-cancel">Fermer</span>');
							divdialog.find('.cmd-cancel').click(function() {
								updateDOM('hide');
							});
							break;

						default:
							break;
					}
					break;

				case 'popin':
					var button = self.find('.snapcall-btn');
					var divrating = self.find('#snapcall-popin .rating');
					var divdialog = self.find('#snapcall-popin .dialog');

					switch (event) {
						case 'toggle':
							var div = self.find('#snapcall-popin .body');

							if (div.css('display') !== 'none') {
								div.slideUp();
								self.find('#snapcall-popin .controls .fa-chevron-down').removeClass('fa-chevron-down').addClass('fa-chevron-up');
							} else {
								div.slideDown();
								self.find('#snapcall-popin .controls .fa-chevron-up').removeClass('fa-chevron-up').addClass('fa-chevron-down');
							}
							break;

						case 'requesting':
							button.css({
								background: css.button.svg.requesting,
								backgroundSize: css.button.width + ' ' + css.button.height
							});
							divdialog.html(dialog.message.dialing);
							break;

						case 'transfering':
							self.find('#snapcall-popin').hide();
							window.open(Snapcall.baseURL + 'hosted.php?bid=' + meta.bid);
							break;

						case 'active':
							button.css({
								background: css.button.svg.active,
								backgroundSize: css.button.width + ' ' + css.button.height
							});
							divdialog.html(dialog.message.ongoing);
							break;

						case 'hangup':
							button.css({
								background: css.button.svg.inactive,
								backgroundSize: css.button.width + ' ' + css.button.height
							}).hide();
							divdialog.html(dialog.message.rating);
							divrating.show();
							break;

						case 'reset':
							button.css({
								background: css.button.svg.inactive,
								backgroundSize: css.button.width + ' ' + css.button.height
							}).show();
							divdialog.html(dialog.message.invite);
							divrating.hide();
							break;

						case 'errorChannel':
							divdialog.html(dialog.error.channel);
							break;

						case 'errorNavigator':
							divdialog.html(dialog.error.navigator);
							break;

						case 'errorTimeout':
							divdialog.html(dialog.error.timeout);
							break;

						case 'errorConnect':
							divdialog.html(dialog.error.connect);
							break;

						case 'errorUnsafe':
							divdialog.html(dialog.error.unsafe);
							break;
					}
					break;
			}
		}

		function startCallTimer() {
			var cmpt = 0;
			var mins = 0;
			var secs = 0;

			meta.timer = setInterval(function() {
				cmpt += 1;
				mins = Math.floor(cmpt / 60);
				secs = cmpt - Math.floor(cmpt / 60) * 60;
				if (mins < 10)
					mins = '0' + mins;
				if (secs < 10)
					secs = '0' + secs;
				$('#snapcall-callbar .dialog').html(mins + ':' + secs);
			}, 1000);
		}

		function resetCallTimer() {
			clearInterval(meta.timer);
			$('#snapcall-callbar .dialog').html('00:00');
		}

		return {
			css: css,
			meta: meta,
			dialog: dialog,
			customObject: customObject,
			createObject: createObject,
			updateObject: updateObject,
			fetchDatas: fetchDatas,
			updateDOM: updateDOM,
			startCallTimer: startCallTimer,
			resetCallTimer: resetCallTimer
		};
	};
});