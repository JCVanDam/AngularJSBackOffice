(function(){
	var bid_id = null;
	var sip_id = null;
	var queue_id = null;
	var token = null;
	var sessid = null;

	var vertoHandle = null;
	var vertoCall = null;
	var vertoCallbacks = null;
	var vertoBoostrap = null;

	var outgoingBandwidth = null;
	var incomingBandwidth = null;

	var video_screen = "webcam";
	var vid_width = 1280;
	var vid_height = 720;

	vertoCallbacks = {
		onDialogState: function(d) {
			vertoCall = d;

			switch (d.state.name) {
				case 'requesting':
					$('#callstatus').html('requesting');
					break;
				
				case 'trying':
					$('#callstatus').html('trying');
					break;
				
				case 'active':
					$('#callstatus').html('active');
					break;
				
				case 'hangup':
					$('#callstatus').html('hangup');
					break;

				case 'destroy':
					$('#callstatus').html('destroy');
					vertoCall = null;

					// TO BE DELETED ??
		    		if (sessid) {
						setTimeout(function() {
			    			delete $.verto.warnOnUnload;
			    			window.close();
						}, 500);
		    		}
					break;
			}
		},
		onWSLogin: function() {
			$('#callstatus').html('onWSLogin');
			vertoCall = null;
		},
		onWSLogout: function() {
			$('#callstatus').html('onWSLogout');
		},
		onWSClose: function() {
			if (sessid) {
				window.close();
			}
		}
	};

	vertoBoostrap = function() {
	    vertoCall = null;

	    var tmp = $.cookie("verto_demo_vid_checked") || "true";
	    $.cookie("verto_demo_vid_checked", tmp, { expires: 365 });

	    $("#use_vid").prop("checked", tmp === "true").change(function(e) {
	        tmp = $("#use_vid").is(':checked');
	        $.cookie("verto_demo_vid_checked", tmp ? "true" : "false", { expires: 365 });
	    });

	    outgoingBandwidth = $.cookie("verto_demo_outgoingBandwidth") || "default";
	    $.cookie("verto_demo_outgoingBandwidth", outgoingBandwidth, { expires: 365 });

	    incomingBandwidth = $.cookie("verto_demo_incomingBandwidth") || "default";
	    $.cookie("verto_demo_incomingBandwidth", incomingBandwidth, { expires: 365 });

	    vqual = $.cookie("verto_demo_vqual") || "hd";
	    $.cookie("verto_demo_vqual", vqual, { expires: 365 });

	    vertoHandle = new $.verto({
	        login: "vertocust@g-test.seampl.io",
	        passwd: "welcome",
	        socketUrl: "wss://g-test.seampl.io:443",
	        tag: video_screen,
	        ringFile: "sounds/bell_ring2.wav",
			sessid: sessid,
	        videoParams: {
	            "minWidth": vid_width,
	            "minHeight": vid_height,
		    	"maxWidth": vid_width,
		    	"maxHeight": vid_height,
		    	"minFrameRate": 15,
		    	"vertoBestFrameRate": 30
	        },
			deviceParams: {
		    	useCamera: "none",
		    	useMic: "any",
	            useSpeak: "any"
			},
			iceServers: [
				{
					'urls': 'turn:t.seampl.io:80?transport=tcp',
					'credential': 'test',
					'username': 'test'
				},
				{
					'urls': 'turns:t.seampl.io:443?transport=tcp',
					'credential': 'test',
				 	'username': 'test'
				}]
	    }, vertoCallbacks);
	};

	function makeCall() {
		$('#callstatus').html('making call');

		if (vertoCall) {
			return;
		}

		/*
		 * Ceci est la methode standard utilisee pour les boutons de la sandbox et de la production
		 * L'appel est automatiquement reprit mais le micro cote client (PC) est perdu
		 */

		createLog(function() {
			vertoCall = vertoHandle.newCall({
				destination_number: sip_id + queue_id,
				caller_id_name: "verto",
				caller_id_number: JSON.stringify(token),
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
		});
		
		/*
		 * Ceci est la methode utilisee dans ton script video_adapter/verto.js
		 * Tout fonctionne
		 */

		// vertoCall = vertoHandle.newCall({
		// 	destination_number: $('#dest').val(),
		// 	caller_id_name: "vertocust",
		// 	caller_id_number: "vertocust",
		// 	outgoingBandwidth: "default",
		// 	incomingBandwidth: "default",
		// 	useVideo: false,
		// 	useStereo: true,
		// 	useCamera: "none",
		// 	useMic: "any",
		// 	useSpeak: "any",
		// 	dedEnc: false,
		// 	mirrorInput: false
		// });
	};

	function hangupCall() {
		if (vertoHandle) {
			vertoHandle.hangup();
		}
	};

	function createLog(callback) {
		$('#callstatus').html('loggin call');
		
		$.ajax({
			url: 'verto.php',
			method: 'POST',
			data: {
				bid_id: $('#dest').val()
			},
			success: function(res) {
				res = JSON.parse(res);

				console.log(res);

				sip_id = res.sip_id;
				queue_id = res.queue_id;
				token = res.token;

				callback();
			}
		});
	};

	$.verto.init({skipPermCheck: false}, vertoBoostrap);

	$('#btncall').click(function() {
		makeCall();
	});

	$('#btnhangup').click(function() {
		hangupCall();
	});
})();