/*
** Snapcall Master Window Object
**
** about	: This library creates a link between jQuery Snapcall plugin and jQuery Verto plugin
** version 	: 1.0.0
** created	: 09/12/2016
** updated	: 15/12/2016
** author	: Razvan Ludosanu
*/

define(['jquery', 'json', 'verto', 'is', 'snapcallwidget', 'ltracker'], function($, json, verto, is, snapcallwidget, _LTracker) {
	function defineSnapcall() {
		// Main object wrapper
		var Snapcall = {};

		Snapcall.baseURL = 'https://sandbox.seampl.io/libsc/dev/app/';
		// Snapcall.baseURL = 'https://127.0.0.1/libsc/dev/app/';

		// Call states
		Snapcall.states = {
			inactive: 1,
			dialing: 2,
			requesting: 3,
			active: 4,
			recovering: 5
		};

		// Stores button and call informations
		Snapcall.meta = {
			wid: null,
			token: null,
			state: Snapcall.states.inactive,
			isCallMuted: false,
			isBrowserSupported: true
		};

		// Stores Verto handlers
		Snapcall.verto = {
			handle: null,
			call: null,
			callbacks: null,
			boostrap: null
		};

		// Stores caller informations
		Snapcall.caller = {
			navigator: null,
			language: null,
			hostname: null,
			url: null,
			urlTitle: null,
			ip: null,
			location: null
		};

		// Stores all the widgets detected in the DOM
		Snapcall.widgets = [];

		// Creates, customizes, logs and stores each widgets matching $('.snapcall') in the DOM
		Snapcall.initWidget = function(options, callback) {
			var count = $('.snapcall').length + 1;
			var wid = 1;
			var wait = function(callback) {
				if (count === wid) {
					if (typeof(callback) === 'function') {
						callback();
					}
				} else {
					setTimeout(function() { wait(callback); }, 100);
				}
			}

			$('.snapcall').each(function() {
				var widget = $(this).snapcallwidget(wid);

				widget.fetchDatas(function() {
					$.ajax({
						method: 'POST',
						url: Snapcall.baseURL + 'php/log.create.php',
						data: {
							bid_id 		: widget.meta.bid,
							navigator 	: Snapcall.caller.navigator,
							language 	: Snapcall.caller.language,
							url 		: Snapcall.caller.url,
							url_title 	: Snapcall.caller.urlTitle
						},
						success: function(res) {
							widget.meta.log = JSON.parse(res);
							
							if (typeof(options) !== 'undefined') {
								for (var x = 0 ; x < options.length ; x++) {
									if (options[x].name === widget.meta.name) {
										widget.customObject(options[x].options);
									}
								}
							}

							widget.createObject();
							Snapcall.widgets.push(widget);

							console.log(widget.meta);
						},
						error: function(err) {
							console.log(err);
						}
					});
				}, function(error) {
					console.log(error);
				});
				wid += 1;
			});

			wait(callback);
		}

		// Returns stored widget object matching it's id
		Snapcall.getWidget = function(wid) {
			if (typeof(wid) !== 'undefined') {
				for (var i = 0 ; i < Snapcall.widgets.length ; i++) {
					if (Snapcall.widgets[i].meta.wid === wid) {
						return Snapcall.widgets[i];
					}
				}
			}
			return null;
		}

		// Gathers informations about user's navigator
		Snapcall.getNavigator = function(callback) {
			var navigator = null;

			if (is.chrome()) {
				navigator = 'Chrome';
			} else if(is.firefox()) {
				navigator = 'Firefox';
			} else if(is.ie()) {
				navigator = 'Internet Explorer';
			} else if(is.edge()) {
				navigator = 'Edge';
				Snapcall.isBrowserSupported = false;
			} else if(is.opera()) {
				navigator = 'Opera';
			} else if(is.safari()) {
				navigator = 'Safari';
				Snapcall.isBrowserSupported = false;
			}

			Snapcall.caller.navigator = navigator;
			Snapcall.caller.language = window.navigator.language;
			Snapcall.caller.hostname = window.location.hostname;
			Snapcall.caller.url = encodeURIComponent(window.location.href);
			Snapcall.caller.urlTitle = document.title;

			if (typeof(callback) === 'function') {
				callback();
			}
		}

		// Callback handlers for Verto
		Snapcall.verto.callbacks = {
			onDialogState: function(d) {
				var wigdet = Snapcall.getWidget(Snapcall.meta.wid);

				Snapcall.verto.call = d;
				switch (d.state.name) {
					case 'requesting':
						Snapcall.meta.state = Snapcall.states.requesting;
						wigdet.updateDOM('requesting');
						break;

					case 'recovering':
						Snapcall.meta.state = Snapcall.states.recovering;
						wigdet.updateDOM('recovering');
						break;
					
					case 'active':
						Snapcall.meta.state = Snapcall.states.active;
						wigdet.updateDOM('active');
						break;
					
					case 'hangup':
						Snapcall.meta.state = Snapcall.states.inactive;
						wigdet.updateDOM('hangup');
						break;

					case 'destroy':
						Snapcall.verto.call = null;
						break;
				}
			},
			onWSLogin: function() {
				Snapcall.verto.call = null;
			},
			onWSLogout: function() {
				//
			},
			onWSClose: function() {
				Snapcall.verto.handle = null;
				Snapcall.verto.call = null;
			}
		}

		// Boostrap function for Verto
		Snapcall.verto.boostrap = function() {
		    Snapcall.verto.call = null;

		    Snapcall.verto.handle = new $.verto({
		        login: "vertocust@g-test.seampl.io",
		        passwd: "welcome",
		        socketUrl: "wss://g-test.seampl.io:443",
		        tag: 'webcam',
				deviceParams: {
			    	useCamera: "none",
			    	useMic: "any",
		            useSpeak: "any"
				},
				iceServers: [{
					'urls': 'turn:t.seampl.io:80?transport=tcp',
					'credential': 'test',
					'username': 'test'
				}, {
					'urls': 'turns:t.seampl.io:443?transport=tcp',
					'credential': 'test',
				 	'username': 'test'
				}],
		    }, Snapcall.verto.callbacks);
		}

		// Initializes connection with FreeSWITCH
		Snapcall.initVerto = function() {
			$.verto.init({skipPermCheck: false}, function() {
				Snapcall.verto.boostrap();
			});
		}

		// Initializes Verto if needed
		// Tries to launch a call
		// Hangs up the current call if already ongoing
		Snapcall.tryCall = function(wid) {
			if (Snapcall.verto.handle !== null) {
				if (Snapcall.verto.call !== null) {
					if (Snapcall.meta.wid === wid) {
						Snapcall.hangupCall();
					}
				} else {
					Snapcall.meta.state = Snapcall.states.dialing;
					Snapcall.makeCall(wid);
				}
			} else {
				var wait = function() {
					if (Snapcall.verto.handle === null) {
						setTimeout(function() {
							wait();
						}, 100);
					} else {
						Snapcall.tryCall(wid);
					}
				};

				Snapcall.meta.state = Snapcall.states.dialing;
				Snapcall.initVerto();
				wait();
			}
		}

		// Launches a new call
		Snapcall.makeCall = function(wid) {
			if (Snapcall.verto.call !== null) {
				return ;
			}

			if (typeof(wid) !== 'undefined') {
				var widget = Snapcall.getWidget(wid);

				Snapcall.meta.wid = wid;
				Snapcall.meta.token = Snapcall.createToken();

				// Updating log
				Snapcall.logUpdate({
					log_id: widget.meta.log,
					token: Snapcall.meta.token
				}, function(res) {
					// Making the call
					if (res !== -1) {
						widget.meta.log = res;

						// var destnum = (widget.meta.sip + widget.meta.queue).toString();
						// var token = Snapcall.meta.token.toString();

						var destnum = '0698550306';
						var token = 'vertocust';

						Snapcall.verto.call = Snapcall.verto.handle.newCall({
							destination_number: destnum,
							caller_id_name: "vertocust",
							caller_id_number: token,
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
					}
				});
			}
		}

		// Mutes the current call
		Snapcall.muteCall = function() {
			if (Snapcall.verto.call !== null) {
				Snapcall.verto.call.setMute('toggle');
				Snapcall.meta.isCallMuted = (Snapcall.meta.isCallMuted === true) ? false : true;
			}
		}

		// Hangs up the current call
		Snapcall.hangupCall = function() {
			if (Snapcall.verto.handle !== null) {
				Snapcall.verto.handle.hangup();
				Snapcall.meta.wid = null;
				Snapcall.meta.state = Snapcall.states.inactive;
			}
		}

		// Updates call log token
		Snapcall.logUpdate = function(datas, callback) {
			$.ajax({
				method: 'POST',
				url: Snapcall.baseURL + 'php/log.update.php',
				data: datas,
				success: function(res) {
					res = JSON.parse(res);

					if (typeof(callback) === 'function') {
						callback(res);
					}
				},
				error: function(err) {
					console.log(err);
				}
			});
		}

		// Updates call log rating
		Snapcall.logRating = function(datas) {
			$.ajax({
				method: 'POST',
				url: Snapcall.baseURL + 'php/log.rating.php',
				data: datas,
				success: function(res) {
					console.log(res);
				},
				error: function(err) {
					console.log(err);
				}
			});
		}

		// Generates a random token
		// Needs to be unique ! Think about it !
		Snapcall.createToken = function() {
			var min = 100000000000000000;
			var max = 999999999999999999;

			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		// States when Snapcall Master Object is ready to be used
		Snapcall.ready = function(callback) {
			// Creates a <style> tag into document's head
			if ($(document).find('style').length === 0) {
				$('head').append('<style type="text/css"></style>');
			}

			// Loads Font-Awesome CSS
			$('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />');
			$('head').append('<link rel="stylesheet" href="' + Snapcall.baseURL + 'css/snapcall.css" />');
			
			// Creates a <video> tag into document's body 
			if ($(document).find('video').length === 0) {
				$('body').prepend('<video id="webcam" autoplay="autoplay" style="display:none;"></video>');
			}
			
			// Gathers informations about user's navigator
			// Executes callback function
			Snapcall.getNavigator(function() {
				if (typeof(callback) === 'function'){
					callback();
				}
			});
		}

		return Snapcall;
	};

	if (typeof(Snapcall) === 'undefined') {
		window.Snapcall = defineSnapcall();
	}

	return window.Snapcall;
});