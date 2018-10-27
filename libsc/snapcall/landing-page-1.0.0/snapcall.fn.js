(function() {
	var domain = 'sandbox.seampl.io';

	var makeCallback = function(func, param) {
		if (typeof(func) === 'function') {
			if (param) {
				func(param);
			} else {
				func();
			}
		}
	};

	var getTimestamp = function() {
		return (Math.round(Date.now() / 1000));
	};

	var snapcall = {

		button: {
			token: null,
			bid_id: null,
			sip_id: null,
			queue_id: null,
			log_id: null,
			open: null,
			brand: null
		},

		style: {
			callbarActive: '#6C7A89',
			callbarUnactive: '#19B5FE',
			buttonBackground: '#000000',
			buttonForeground: '#FFFFFF',
			width: 70,
			height: 70
		},

		dialog: {
			buttonName: null,
			callInvite: null,
			callClosed: null,
			callRate: null,
			callInitiate: 'Appel en cours ...',
			errorChannel: 'Tous nos conseillers sont deja en ligne, merci de r&eacute;essayer',
			errorBrowser: 'Votre navigateur n\'est pas encore compatible, merci d\'utiliser',
			errorConnect: 'Oups, une erreur est survenue',
			errorTimeout: 'Impossible d\'&eacute;tablir l\'appel, merci de r&eacute;essayer'
		},

		call: {
			isMuted: false,
			state: 0,
			requestTimestamp: null,
			isRequestTimedOut: false,
			rate: 0,
			timer: 0
		},

		caller: {
			navigator: null,
			navigator_abbr: null,
			language: null,
			hostname: null,
			url: null,
			url_title: null,
			ip: null,
			location: null,
			mouseclick: null
		},

		verto: {
			handle: null,
			call: null,
			callbacks: {
				onDialogState: function(d) {
					switch (d.state.name) {
						case 'requesting':
							snapcall.call.state = 2;
							$('.commands-icons').show();
							break;
						
						case 'trying':
							snapcall.call.state = 3;
							snapcall.call.requestTimestamp = getTimestamp();
							break;
						
						case 'active':
							snapcall.call.state = 4;
							snapcall.startCallTimer();
							snapcall.updateDOM('callActive');
							break;
						
						case 'hangup':
							snapcall.hangupCall();
							snapcall.stopCallTimer();
							break;
					}
				}
			}
		},

		getToken: function(callback) {
			console.log('Getting snapcall call token');

			$.ajax({
				method: 'POST',
				url: 'https://'+ domain +'/libsc/snapcall/php/token.php',
				data: null,
				success: function(res) {
					snapcall.button.token = res;
					makeCallback(callback);
				},
				error: function(res) {
					console.log(res);
				}
			});
		},

		getButtonInfo: function(callback) {
			console.log('Getting snapcall button infos, styles and dialogs');

			$.ajax({
				method: 'POST',
				url: 'https://' + domain + '/libsc/snapcall/php/button.php',
				data: { bid_id: snapcall.button.bid_id },
				success: function(res) {
					if (res !== 'null') {
						res = JSON.parse(res);

						snapcall.button.sip_id = res.sip_id;
						snapcall.button.queue_id = res.queue_id;
						snapcall.button.name = res.name;
						snapcall.button.open = res.open;
						snapcall.button.brand = res.brand;

						snapcall.style.callbarUnactive = res.clr_off;
						snapcall.style.callbarActive = res.clr_on;
						snapcall.style.buttonBackground = res.clr_btn_bg;
						snapcall.style.buttonForeground = res.clr_btn_fg;

						snapcall.dialog.buttonName = res.msg_on;
						snapcall.dialog.callInvite = res.msg_off;
						snapcall.dialog.callClosed = res.msg_close;
						snapcall.dialog.callRate = res.msg_rate;

						snapcall.updateDOM('buildCallbar');
					} else {
						snapcall.call.state = 0;
						snapcall.updateDOM('buildCallbar');
						snapcall.updateDOM('errorConnect');
					}

					makeCallback(callback);
				},
				error: function(res) {
					console.log(res);
				}
			});
		},

		getCallerInfo: function(callback) {
			console.log('Getting current user informations');

			var nav = null;
			var nav_abbr = null;

			if (is.chrome()) {
				nav = 'Chrome';
				nav_abbr = 'ch';
			} else if(is.firefox()) {
				nav = 'Firefox';
				nav_abbr = 'ff';
			} else if(is.ie()) {
				nav = 'Internet Explorer';
				nav_abbr = 'ie';
			} else if(is.edge()) {
				nav = 'Edge';
				nav_abbr = 'eg';
			} else if(is.opera()) {
				nav = 'Opera';
				nav_abbr = 'op';
			} else if(is.safari()) {
				nav = 'Safari';
				nav_abbr = 'sf';
			}

			snapcall.caller.navigator = nav;
			snapcall.caller.navigator_abbr = nav_abbr;
			snapcall.caller.language = window.navigator.language;
			snapcall.caller.hostname = window.location.hostname;
			snapcall.caller.url = encodeURIComponent(window.location.href);
			snapcall.caller.url_title = document.title;

			makeCallback(callback);
		},

		getCallerLocation: function(callback) {
			$.ajax({
				method: 'GET',
				url: '//freegeoip.net/json/',
				data: null,
				success: function(res) {
					if (res) {
						snapcall.caller.ip = res.ip;
						snapcall.caller.location = res.city + ', ' + res.region_name + ', ' + res.country_name;
					}
					
					$('.snapcall-btn').each(function() {
						var btn = $(this);

						snapcall.updateLog({
							action: 'locate',
							log_id: btn.attr('log-id'),
							ip: snapcall.caller.ip,
							location: snapcall.caller.location
						});
					});
				},
				error: function(res) {
					console.log(res);
				}
			});
		},

		initLog: function(callback) {
			console.log('Looping through each snapcall buttons, creating a log an getting back the log database id');

			$('.snapcall-btn').each(function() {
				var btn = $(this);

				snapcall.createLog(btn.attr('bid-id'), function(res) {
					btn.attr('log-id', res);
				});
			});

			makeCallback(callback);
		},

		createLog: function(bid_id, callback) {
			console.log('Snapcall log creation');

			$.ajax({
				method: 'POST',
				url: 'https://' + domain + '/libsc/snapcall/php/log.php',
				data: {
					action: 'create',
					bid_id: bid_id,
					token: null,
					ip: snapcall.caller.ip,
					location: snapcall.caller.location,
					navigator: snapcall.caller.navigator,
					language: snapcall.caller.language,
					url: snapcall.caller.url,
					url_title: snapcall.caller.url_title
				},
				success: function(res) {
					callback(JSON.parse(res));
				},
				error: function(res) {
					callback(JSON.parse(null));
				}
			});
		},

		updateLog: function(data, callback) {
			console.log('Snapcall log update');

			$.ajax({
				method: 'POST',
				url: 'https://' + domain + '/libsc/snapcall/php/log.php',
				data: data,
				success: function(res) {
	            	if (data.action == 'start') {
	            		snapcall.button.log_id = JSON.parse(res);
	            	}
					
					makeCallback(callback);
				},
				error: function(res) {
					console.log(res);
				}
			});
		},

		initVerto: function() {
			console.log('Verto init');

			if (snapcall.verto.handle == null) {
				$.verto.init({}, function() {
					snapcall.verto.handle = new $.verto({
						login: 'vertocust@g-test.seampl.io',
						passwd: 'welcome',
						socketUrl: 'wss://g-test.seampl.io:443',
						tag: 'webcam',
						iceServers: [{
							'urls': 'turn:t.seampl.io:80?transport=tcp',
							'credential': 'test',
							'username': 'test'
						},{
							'urls': 'turns:t.seampl.io:443?transport=tcp',
							'credential': 'test',
							'username': 'test'
						}]
					}, snapcall.verto.callbacks);
					
					if (snapcall.verto.handle != null) {
						snapcall.makeCall();
					}
				});
			}
		},

		tryCall: function() {
			console.log('Try to launch call');

			if (snapcall.call.state == 1) {
				snapcall.updateDOM('callRequesting');

				if (snapcall.verto.handle == null) {
					snapcall.initVerto();
				} else {
					snapcall.makeCall();
				}
			}
		},

		makeCall: function() {
			console.log('Making the actual call');

			var ringtone = new Audio('https://contact-ter.com/pays-de-la-loire/dial.mp3');
			ringtone.play();
			ringtone.onended = function() {
				snapcall.getToken(function() {
					snapcall.updateLog({
						action: 'start',
						token: snapcall.button.token,
						log_id: snapcall.button.log_id
					}, function() {
						snapcall.verto.call = snapcall.verto.handle.newCall({
							destination_number: snapcall.button.sip_id + snapcall.button.queue_id,
							caller_id_name: 'verto',
							caller_id_number: snapcall.button.token,
							useVideo: false,
							useStereo: true,
							useMic: true,
							useCamera: false
						});
					});
				});
			}
		},

		hangupCall: function() {
			console.log('Hanging up the current call');

			if (snapcall.call.isRequestTimedOut == true) {
				snapcall.updateDOM('errorTimeout');
			} else {
				snapcall.updateDOM('callHangup');
			}

			snapcall.call.state = 0;
			if (snapcall.verto.handle != null) {
				snapcall.verto.call.hangup();
			}
		},

		muteCall: function() {
			if (snapcall.verto.call != null) {
				if (snapcall.call.isMuted == false) {
					snapcall.call.isMuted = true;
					snapcall.verto.call.setMute('mute');
					snapcall.updateDOM('callMute');
				} else {
					snapcall.call.isMuted = false;
					snapcall.verto.call.setMute('unmute');
					snapcall.updateDOM('callUnmute');
				}
			}
		},

		startCallTimer: function() {
			var cmpt = 0;
			var mins = 0;
			var secs = 0;

			snapcall.call.timer = setInterval(function() {
				cmpt += 1;
				mins = Math.floor(cmpt / 60);
				secs = cmpt - Math.floor(cmpt / 60) * 60;
				if (mins < 10)
					mins = '0' + mins;
				if (secs < 10)
					secs = '0' + secs;
				$('.snapcall .dialog-timer-text').html(mins + ':' + secs);
			}, 1000);
		},

		stopCallTimer: function() {
			clearInterval(snapcall.call.timer);
			$('.snapcall .dialog-timer-text').html('00:00');
		},

		updateDOM: function(state) {
			console.log('Updating DOM document');

			switch (state) {
				case 'buildCallbar':
					$('.snapcall .callbar').css({'background' : snapcall.style.callbarUnactive});
					$('.info-text').html(snapcall.dialog.buttonName);
					$('.dialog-invite-text').html(snapcall.dialog.callInvite);
					$('.dialog-initiate-text').html(snapcall.dialog.callInitiate);
					$('.dialog-closed-text').html(snapcall.dialog.callClosed);
					$('.dialog-rate-text').html(snapcall.dialog.callRate);
					$('.dialog-connect-text').html(snapcall.dialog.errorConnect);
					$('.dialog-channel-text').html(snapcall.dialog.errorChannel);
					$('.dialog-browser-text').html(snapcall.dialog.errorBrowser);
					$('.dialog-timeout-text').html(snapcall.dialog.errorTimeout);
					break;

				case 'hideCallbar':
					$('.snapcall .pushbar').slideUp();
					$('.snapcall .callbar').slideUp();
					$('.snapcall').slideUp();
					break;
				
				case 'callReset':
					$('.snapcall .callbar').css({'background' : snapcall.style.callbarUnactive});
					$('.snapcall .pushbar').slideUp();
					$('.snapcall .callbar').slideUp();
					$('.snapcall').slideUp(function() {
						$('.dialog-rate').hide();
						if (snapcall.button.open == false) {
							$('.snapcall .dialog-closed').show();
						} else {
							$('.snapcall .dialog-invite').show();
						}
					});
					break;
				
				case 'callRequesting':
					$('.info-text').show();
					$('.dialog-invite').hide();
					$('.dialog-initiate').show();
					break;
				
				case 'callActive':
					$('.snapcall .callbar').css({'background' : snapcall.style.callbarActive});
					$('.dialog-initiate').hide();
					$('.dialog-timer').show();
					break;
				
				case 'callHangup':
					$('.dialog-initiate').hide();
					$('.dialog-timer').hide();
					$('.commands-icons').hide();
					$('.dialog-rate').show();
					break;

				case 'callMute':
					$('.snapcall .commands-icons .mute').css({
						'margin-left': '70px',
						'width': '30px',
						'height': '30px',
						'background-image': 'url(\'https://' + domain + '/libsc/snapcall/landing-page-1.0.0/mic_off.png\')',
						'background-size': '30px 30px',
						'background-repeat': 'no-repeat',
						'background-position': 'center center',
						'border': '2px solid white',
						'border-radius': '999px',
						'padding': '8px 8px'
					});
					break;

				case 'callUnmute':
					$('.snapcall .commands-icons .mute').css({
						'margin-left': '70px',
						'width': '30px',
						'height': '30px',
						'background-image': 'url(\'https://' + domain + '/libsc/snapcall/landing-page-1.0.0/mic_on.png\')',
						'background-size': '30px 30px',
						'background-repeat': 'no-repeat',
						'background-position': 'center center',
						'border': '2px solid white',
						'border-radius': '999px',
						'padding': '8px 8px'
					});
					break;
				
				case 'errorBrowser':
					$('.dialog-invite').hide();
					$('.dialog-browser').show();
					break;
				
				case 'errorConnect':
					$('.dialog-invite').hide();
					$('.dialog-connect').show();
					break;
				
				case 'errorTimeout':
					$('.dialog-invite').hide();
					$('.dialog-initiate').hide();
					$('.dialog-timeout').show();
					setTimeout(function() {
						$('.dialog-timeout').hide();
						$('.dialog-invite').show();
					}, 3000);
					break;

				case 'errorChannel':
					$('.dialog-invite').hide();
					$('.dialog-channel').show();
					break;
			}
		},

		loadCSS: function(callback) {
			$.get('https://' + domain + '/libsc/snapcall/landing-page-1.0.0/snapcall.fn.css', function(res) {
				$('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />');
				$('head').append('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Ubuntu" />');
				$('head').append('<style type="text/css"></style>');
				$('style').append(res);

				makeCallback(callback);
			});
		},

		loadHTML: function(callback) {
			$.get('https://' + domain + '/libsc/snapcall/landing-page-1.0.0/snapcall.fn.html', function(res) {
				$('body').prepend(res);

				makeCallback(callback);
			});
		}
	};

	snapcall.getCallerInfo(function() {
		snapcall.initLog(function() {
			snapcall.getCallerLocation();
		});
	});

	snapcall.loadCSS(function() {
		snapcall.loadHTML(function() {
			DetectRTC.load(function() {
				if (!DetectRTC.isWebRTCSupported) {
					snapcall.updateDOM('errorBrowser');
				}

				$('.snapcall-btn').click(function() {
					var btn = $(this);

					if (snapcall.call.state == 0) {
						console.log('snapcall.button.bid_id => ' + btn.attr('bid-id'));
						console.log('snapcall.button.log_id => ' + btn.attr('log-id'));

						snapcall.button.bid_id = btn.attr('bid-id');
						snapcall.button.log_id = btn.attr('log-id');

						snapcall.getButtonInfo(function() {
							if ($('.snapcall').css('display') === 'none') {
								if (snapcall.button.open == false) {
									$('.snapcall .dialog-invite').hide();
									$('.snapcall .dialog-closed').show();
								} else {
									$('.snapcall .dialog-invite').show();
									$('.snapcall .dialog-closed').hide();
								}
								$('.snapcall .pushbar').slideDown();
								$('.snapcall .callbar').slideDown();
								$('.snapcall').slideDown();
							}
						});

						snapcall.updateLog({
							action: 'click',
							log_id: snapcall.button.log_id
						});

						setInterval(function() {
							if (snapcall.call.state == 3) {
								if (getTimestamp() - snapcall.call.requestTimestamp > 20) {
									snapcall.call.isRequestTimedOut = true;
									snapcall.hangupCall();
								}
							}
						}, 1000);
					}
				});

				$('.snapcall .dialog-command-launch').click(function() {
					if (snapcall.call.state == 0) {
						snapcall.call.state = 1;
						snapcall.tryCall();
					}
				});

				$('.snapcall .dialog-command-cancel').click(function() {
					snapcall.updateDOM('hideCallbar');
				});

				$('.snapcall .commands-icons .hangup').click(function() {
					snapcall.hangupCall();
				});

				$('.snapcall .commands-icons .mute').click(function() {
					snapcall.muteCall();
				});

				$('.snapcall-rating-star').hover(
					function() {
						var rating = $(this).attr('value');

						$('.snapcall-rating-star').each(function() {
							if ($(this).attr('value') <= rating) {
								$(this).css({'color' : '#FDD017'});
							}
						})
					},
					function() {
						$('.snapcall-rating-star').css({'color' : 'white'});
					}
				);

				$('.snapcall-rating-star').click(function() {
					var rating = $(this).attr('value');

					snapcall.updateDOM('callReset');
					
					snapcall.updateLog({
						action: 'rate',
						log_id: snapcall.button.log_id,
						rating: rating
					});
				});
			});
		});
	});
})();