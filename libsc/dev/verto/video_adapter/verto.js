'use strict';
var cur_call = null;
var vid_width = 1280;
var vid_height = 720;
var outgoingBandwidth;
var incomingBandwidth;
var vqual;
var sessid = null;
var vertoHandle = null;
var video_screen = "webcam"

var callbacks = {
    onDialogState: function(d) {
		if (!cur_call) {
            cur_call = d;
		}

        switch (d.state) {
        	case $.verto.enum.state.destroy:
            	cur_call = null;
	    		
	    		if (sessid) {
					setTimeout(function() {
		    			delete $.verto.warnOnUnload;
		    			window.close();
					}, 500);
	    		}
            	break;

        	default:
            	break;
        }
    },
    onWSLogin: function(v, success) {
		cur_call = null;
    },
    onWSClose: function(v, success) {
		if (sessid) {
	    	window.close();
		}
    },
};

function docall() {
    if (cur_call) {
        return;
    }

    cur_call = vertoHandle.newCall({
        destination_number: $("#ext").val(),
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
}

$("#callbtn").click(function() {
    docall();
});

function init() {
    cur_call = null;

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
    },callbacks);
}

$(window).load(function() {
	setTimeout(function() {
		$.verto.init({skipPermCheck: false}, init);
	}, 1000);
});