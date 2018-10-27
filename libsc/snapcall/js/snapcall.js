/****************************************************************************************
 *                                                                                      *
 *                                                                                      *
 * File:        snapcall.js                                                             *
 * Author:      Razvan LUDOSANU                                                         *
 * Content:     SnapCall widget                                                         *
 *                                                                                      *
 *                                                                                      *
 ***************************************************************************************/

(function(){

	/******************************************************
	 *
	 * FUNCTIONS
	 *
	 ******************************************************/

	/* Callback */

	function makeCallback(fnc, prm) {
		if (typeof(fnc) === 'function') {
			if (prm) {
				fnc(prm);
			} else {
				fnc();
			}
		}
	};

	/* CORS Request */

    function makeCORSrequest(req) {
        var xhr = new XMLHttpRequest();
        var url;

        if (req.data != null) {
        	url = req.url + '?data=' + JSON.stringify(req.data);
        } else {
        	url = req.url;
        }

        if ("withCredentials" in xhr) {
            xhr.open(req.method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(req.method, url);
        } else {
            xhr = null;
        }

        if (!xhr) {
            return ;
        } else {
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            xhr.setRequestHeader('Access-Control-Allow-Credentials', true);
            xhr.send();
        }

        xhr.onload = function() {
            if (typeof req.callback === 'function') {
                req.callback(xhr.responseText);
            }
        };
    };

    /* Load script */

	function loadScript(url, callback) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
		script.onload = function() {
			makeCallback(callback);
		};
	};

	// Load javascript files

	var domain = 'sandbox.seampl.io';
	// var domain = '127.0.0.1';

	loadScript('https://' + domain + '/libsc/jquery/dist/jquery.min.js', function() {
		loadScript('https://cdn.webrtc-experiment.com/DetectRTC.js');
		loadScript('https://webrtc.github.io/adapter/adapter-latest.js');
		loadScript('https://' + domain + '/libsc/jquery-json/dist/jquery.json.min.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.FSRTC.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.jsonrpcclient.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.verto.js');
		loadScript('https://' + domain + '/libsc/is/is.min.js');
	});

	// Document has finished loading

	window.onload = function() {

		if (window.jQuery) {

			/******************************************************
			 *
			 * SNAPCALL OBJECT
			 *
			 ******************************************************/

			function snapcall() {
				this.caller = {
					ip: null,
					location: null,
					navigator: null,
					navigator_abbr: null,
					language: null,
					hostname: null,
					url: null,
					url_title: null
				};

				this.info = {
					token: null,
					bid_id: null,
					sip_id: null,
					queue_id: null,
					log_id: null
				};

				this.display = {
					open: false,
					navigator: null,
					clr_off: null,
					clr_on: null,
					msg_off: null,
					msg_on: null,
					msg_close: null,
					msg_rate: null
				};

				this.state = {
					state: 0,
					mute: false
				};

				this.timer = {
					id: null
				}
				
				this.verto = {
					handle: null,
					call: null,
					callbacks: {
						onDialogState: function(d) {
							switch (d.state.name) {
								case 'requesting':
									console.log('-- verto state is now requesting');
									break;
								
								case 'trying':
									console.log('-- verto state is now trying');
									snapcall.updateDOM('trying');
									break;
								
								case 'answering':
									console.log('-- verto state is now answering');
									break;
								
								case 'active':
									console.log('-- verto state is now active');
									snapcall.startTimer();
									snapcall.updateDOM('active');
									break;
								
								case 'hangup':
									console.log('-- verto state is now hangup');
									snapcall.hangupCall();
									break;
								
								case 'destroy':
									console.log('-- verto state is now destroy');
									break;
							}
						}
					}
				};

				this.button = {
					unactive: 'url(\'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgPg0KICA8ZGVmcz4NCiAgICA8c3R5bGU+DQogICAgICAuY2xzLTF7ZmlsbDojZmZmO30NCg0KICAgIDwvc3R5bGU+DQogIDwvZGVmcz4NCiAgPHRpdGxlPg0KICAgIEFzc2V0IDENCiAgPC90aXRsZT4NCiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxMCkiPg0KICAgIDxwYXRoIGQ9Ik0zNy4yOCAxMGwtMTAuMSAzLjgzYS43LjcgMCAwIDEtLjg5LS44OEwzMCAyLjczQTIwIDIwIDAgMSAwIDM3LjI4IDEweiIgaWQ9ImZvcm1lIi8+DQogICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIuMSAxMi40MmE0LjQxIDQuNDEgMCAwIDAtLjY2IDIuMzkgMTQuODkgMTQuODkgMCAwIDAgNC43MiA5IDE0Ljg5IDE0Ljg5IDAgMCAwIDkgNC43MiA0LjQyIDQuNDIgMCAwIDAgMi4zOS0uNjYgMy40MiAzLjQyIDAgMCAwIDEuNTctMS4zNyA1LjE3IDUuMTcgMCAwIDAgLjI3LS44OCA0LjQyIDQuNDIgMCAwIDAgLjEzLS45MS43NS43NSAwIDAgMCAwLS4yN2MtLjA1LS4xNS0uMzgtLjM4LTEtLjY4bC0uNy0uMzlMMjcgMjNsLS42OS0uNC0uMzEtLjI1YTMuODYgMy44NiAwIDAgMC0uNDYtLjI4Ljg0Ljg0IDAgMCAwLS4zNC0uMDcgMS4xIDEuMSAwIDAgMC0uNjQuMzYgNi4yIDYuMiAwIDAgMC0uNzEuODEgOC4zIDguMyAwIDAgMS0uNjguNzkgMSAxIDAgMCAxLS41OS4zNi43NS43NSAwIDAgMS0uMjktLjA3bC0uMjYtLjEtLjMyLS4xNS0uMjQtLjE1YTEzLjY2IDEzLjY2IDAgMCAxLTMtMi4yNCAxMy42MyAxMy42MyAwIDAgMS0yLjIzLTNsLS4xNS0uMjQtLjIxLS4zN2EyLjMgMi4zIDAgMCAxLS4xLS4yNi43Ny43NyAwIDAgMS0uMDctLjI5IDEgMSAwIDAgMSAuMzctLjU5IDguMTEgOC4xMSAwIDAgMSAuNzktLjY4IDYuMjEgNi4yMSAwIDAgMCAuODEtLjcxIDEuMDkgMS4wOSAwIDAgMCAuMzYtLjY0Ljg0Ljg0IDAgMCAwLS4wOS0uMzcgMy45MSAzLjkxIDAgMCAwLS4yOC0uNDZsLS4yMi0uMzJMMTcgMTNjLS4xNC0uMjUtLjI5LS41MS0uNDUtLjgxbC0uMzktLjdjLS4zLS42LS41My0uOTMtLjY4LTFhLjczLjczIDAgMCAwLS4yNyAwIDQuMzUgNC4zNSAwIDAgMC0uOTEuMTMgNS4yMSA1LjIxIDAgMCAwLS44OC4yNyAzLjQyIDMuNDIgMCAwIDAtMS4zMiAxLjUzeiIgaWQ9InRlbEIiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K\')',
					unactive_bounce: 'url(\'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgPg0KICA8ZGVmcz4NCiAgICA8c3R5bGU+DQogICAgICAuY2xzLTF7ZmlsbDojZmZmO30NCg0KICAgICAgQC13ZWJraXQta2V5ZnJhbWVzIGFuaW1fem9vbSB7DQogICAgICAgIDAlIHstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKX0NCiAgICAgICAgNTAlIHstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKX0NCiAgICAgICAgNzUlIHstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoMjBweCwgMTlweCkgc2NhbGUoMCl9DQogICAgICAgIDEwMCUgey13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwcHgsIDBweCkgc2NhbGUoMSl9DQogICAgICB9DQogICAgICAuZ3JvdyB7LXdlYmtpdC1hbmltYXRpb246IGFuaW1fem9vbSA1cyBlYXNlLW91dCBpbmZpbml0ZTt9DQoNCiAgICA8L3N0eWxlPg0KICA8L2RlZnM+DQogIDx0aXRsZT4NCiAgICBBc3NldCAxDQogIDwvdGl0bGU+DQogIDxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMTApIj4NCiAgICA8cGF0aCBkPSJNMzcuMjggMTBsLTEwLjEgMy44M2EuNy43IDAgMCAxLS44OS0uODhMMzAgMi43M0EyMCAyMCAwIDEgMCAzNy4yOCAxMHoiIGlkPSJmb3JtZSIvPg0KICAgIDxnPg0KICAgIDxwYXRoIGNsYXNzPSJjbHMtMSBncm93IiBkPSJNMTIuMSAxMi40MmE0LjQxIDQuNDEgMCAwIDAtLjY2IDIuMzkgMTQuODkgMTQuODkgMCAwIDAgNC43MiA5IDE0Ljg5IDE0Ljg5IDAgMCAwIDkgNC43MiA0LjQyIDQuNDIgMCAwIDAgMi4zOS0uNjYgMy40MiAzLjQyIDAgMCAwIDEuNTctMS4zNyA1LjE3IDUuMTcgMCAwIDAgLjI3LS44OCA0LjQyIDQuNDIgMCAwIDAgLjEzLS45MS43NS43NSAwIDAgMCAwLS4yN2MtLjA1LS4xNS0uMzgtLjM4LTEtLjY4bC0uNy0uMzlMMjcgMjNsLS42OS0uNC0uMzEtLjI1YTMuODYgMy44NiAwIDAgMC0uNDYtLjI4Ljg0Ljg0IDAgMCAwLS4zNC0uMDcgMS4xIDEuMSAwIDAgMC0uNjQuMzYgNi4yIDYuMiAwIDAgMC0uNzEuODEgOC4zIDguMyAwIDAgMS0uNjguNzkgMSAxIDAgMCAxLS41OS4zNi43NS43NSAwIDAgMS0uMjktLjA3bC0uMjYtLjEtLjMyLS4xNS0uMjQtLjE1YTEzLjY2IDEzLjY2IDAgMCAxLTMtMi4yNCAxMy42MyAxMy42MyAwIDAgMS0yLjIzLTNsLS4xNS0uMjQtLjIxLS4zN2EyLjMgMi4zIDAgMCAxLS4xLS4yNi43Ny43NyAwIDAgMS0uMDctLjI5IDEgMSAwIDAgMSAuMzctLjU5IDguMTEgOC4xMSAwIDAgMSAuNzktLjY4IDYuMjEgNi4yMSAwIDAgMCAuODEtLjcxIDEuMDkgMS4wOSAwIDAgMCAuMzYtLjY0Ljg0Ljg0IDAgMCAwLS4wOS0uMzcgMy45MSAzLjkxIDAgMCAwLS4yOC0uNDZsLS4yMi0uMzJMMTcgMTNjLS4xNC0uMjUtLjI5LS41MS0uNDUtLjgxbC0uMzktLjdjLS4zLS42LS41My0uOTMtLjY4LTFhLjczLjczIDAgMCAwLS4yNyAwIDQuMzUgNC4zNSAwIDAgMC0uOTEuMTMgNS4yMSA1LjIxIDAgMCAwLS44OC4yNyAzLjQyIDMuNDIgMCAwIDAtMS4zMiAxLjUzeiIgaWQ9InRlbEIiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K\')',
					requesting: 'url(\'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgY2xhc3M9ImdlbiI+DQoJPGRlZnM+DQoJCTxzdHlsZT4uY2xzLTF7ZmlsbDojMDAwO30NCgkJCUAtd2Via2l0LWtleWZyYW1lcyB1Zm8tYmlnLWxpZ2h0cyB7DQoJCQkgIDAlICAgICAgICB7ZmlsbDogIzAwMH0NCgkJCSAgNTAlICAgICAgIHtmaWxsOiAjZmZmfQ0KCQkJICAxMDAlIHtmaWxsOiAjMDAwfQ0KCQkJfQ0KCQkJQC1tb3ota2V5ZnJhbWVzIHVmby1iaWctbGlnaHRzIHsNCgkJCSAgMCUgICAgICAgIHtmaWxsOiAjMDAwfQ0KCQkJICA1MCUgICAgICAge2ZpbGw6ICNmZmZ9DQoJCQkgIDEwMCUge2ZpbGw6ICMwMDB9DQoJCQl9DQoJCQlrZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgew0KCQkJICAwJSAgICAgICAge2ZpbGw6ICMwMDB9DQoJCQkgIDUwJSAgICAgICB7ZmlsbDogI2ZmZn0NCgkJCSAgMTAwJSB7ZmlsbDogIzAwMH0NCgkJCX0NCg0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0IHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbjogdWZvLWJpZy1saWdodHMgMi41cyBlYXNlIGluZmluaXRlOw0KCQkJCS1tb3otYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7DQoJCQkJYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7DQoJCQl9DQoNCgkJCS51Zm8tYmlnLWxpZ2h0cy1saWdodC0tMSB7DQoJCQkJLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IC4yczsNCgkJCQktbW96LWFuaW1hdGlvbi1kZWxheTogLjJzOw0KCQkJCWFuaW1hdGlvbi1kZWxheTogLjJzOw0KCQkJfQ0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0LS0yIHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjRzOw0KCQkJCS1tb3otYW5pbWF0aW9uLWRlbGF5OiAuNHM7DQoJCQkJYW5pbWF0aW9uLWRlbGF5OiAuNHM7DQoJCQl9DQoJCQkudWZvLWJpZy1saWdodHMtbGlnaHQtLTMgew0KCQkJCS13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAuNnM7DQoJCQkJLW1vei1hbmltYXRpb24tZGVsYXk6IC42czsNCgkJCQlhbmltYXRpb24tZGVsYXk6IC42czsNCgkJCX0NCgkJPC9zdHlsZT4NCgk8L2RlZnM+DQoJPHRpdGxlPkFzc2V0IDE8L3RpdGxlPg0KCTxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMTApIj4NCgkJPGcgaWQ9InJvbmQiPg0KCQkJPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiLz4NCgkJPC9nPg0KCQk8ZyBpZD0iYmFzZV9wb2ludCIgY2xhc3M9InVmby1iaWctbGlnaHRzIj4NCgkJCTxjaXJjbGUgY2xhc3M9ImNscy0xIHVmby1iaWctbGlnaHRzLWxpZ2h0IHVmby1iaWctbGlnaHRzLWxpZ2h0LS0xIiBjeD0iMTAuNDciIGN5PSIyMC4wMyIgcj0iMi41Ii8+DQoJCQk8Y2lyY2xlIGNsYXNzPSJjbHMtMSB1Zm8tYmlnLWxpZ2h0cy1saWdodCB1Zm8tYmlnLWxpZ2h0cy1saWdodC0tMiIgY3g9IjE5Ljk3IiBjeT0iMjAuMDMiIHI9IjIuNSIvPg0KCQkJPGNpcmNsZSBjbGFzcz0iY2xzLTEgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTMiIGN4PSIyOS40NyIgY3k9IjIwLjAzIiByPSIyLjUiLz4NCgkJPC9nPg0KCTwvZz4NCjwvc3ZnPg==\')',
					active: 'url(\'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgNTAuNTAgNTAuNzMiPg0KCTxkZWZzPg0KCQk8c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0yLC5jbHMtM3tmaWxsOm5vbmU7fS5jbHMtM3tzdHJva2U6I2ZmZjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDtzdHJva2Utd2lkdGg6MS42N3B4O30NCgkJCUAtd2Via2l0LWtleWZyYW1lcyB1Zm8tYmlnLWxpZ2h0cyB7DQoJCQkgIDAlICAgICAgICB7c3Ryb2tlOiAjZmZmfQ0KCQkJICA1MCUgICAgICAge3N0cm9rZTogIzAwMH0NCgkJCSAgMTAwJSAJCXtzdG9rZTogI2ZmZn0NCgkJCX0NCgkJCUAtbW96LWtleWZyYW1lcyB1Zm8tYmlnLWxpZ2h0cyB7DQoJCQkgIDAlICAgICAgICB7c3Ryb2tlOiAjZmZmfQ0KCQkJICA1MCUgICAgICAge3N0cm9rZTogIzAwMH0NCgkJCSAgMTAwJSB7c3Rva2U6ICNmZmZ9DQoJCQl9DQoJCQlrZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgew0KCQkJICAwJSAgICAgICAge3N0cm9rZTogI2ZmZn0NCgkJCSAgNTAlICAgICAgIHtzdHJva2U6ICMwMDB9DQoJCQkgIDEwMCUge3N0b2tlOiAjZmZmfQ0KCQkJfQ0KDQoJCQkudWZvLWJpZy1saWdodHMtbGlnaHQgew0KCQkJICAgIC13ZWJraXQtYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7DQoJCQkJLW1vei1hbmltYXRpb246IHVmby1iaWctbGlnaHRzIDIuNXMgZWFzZSBpbmZpbml0ZTsNCgkJCQlhbmltYXRpb246IHVmby1iaWctbGlnaHRzIDIuNXMgZWFzZSBpbmZpbml0ZTsNCgkJCX0NCg0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0LS0xIHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjJzOw0KCQkJCS1tb3otYW5pbWF0aW9uLWRlbGF5OiAuMnM7DQoJCQkJLWFuaW1hdGlvbi1kZWxheTogLjJzOw0KCQkJfQ0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0LS0yIHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjRzOw0KCQkJCS1tb3otYW5pbWF0aW9uLWRlbGF5OiAuNHM7DQoJCQkJLWFuaW1hdGlvbi1kZWxheTogLjRzOw0KCQkJfQ0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0LS0zIHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjZzOw0KCQkJCS1tb3otYW5pbWF0aW9uLWRlbGF5OiAuNnM7DQoJCQkJLWFuaW1hdGlvbi1kZWxheTogLjZzOw0KCQkJfQ0KCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0LS00IHsNCgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjhzDQoJCQkJLW1vei1hbmltYXRpb24tZGVsYXk6IC44czsNCgkJCQktYW5pbWF0aW9uLWRlbGF5OiAuOHM7DQoJCQl9DQoJCQkudWZvLWJpZy1saWdodHMtbGlnaHQtLTUgew0KCQkJCS13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAxczsNCgkJCQktbW96LWFuaW1hdGlvbi1kZWxheTogMXM7DQoJCQkJLWFuaW1hdGlvbi1kZWxheTogMXM7DQoJCQl9DQoJCTwvc3R5bGU+DQoJPC9kZWZzPg0KCTx0aXRsZT5Bc3NldCAzPC90aXRsZT4NCgk8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIj4NCgkJPGcgaWQ9ImZvcm1lIj4NCgkJCTxwYXRoIHdpZHRoPSI0MHB4IiBoZWlnaHQ9IjQwcHgiIGQ9Ik0zNy4yOCwyMC42OWwtMTAuMSwzLjgzYS43LjcsMCwwLDEtLjg5LS44OEwzMCwxMy40NWEyMCwyMCwwLDEsMCw3LjIzLDcuMjNaIi8+DQoJCTwvZz4NCgkJPGcgaWQ9ImJhc2UiPg0KCQkJPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjcuMDUsMzVhMy45LDMuOSwwLDAsMS0uMjEuNjYsMi41NiwyLjU2LDAsMCwxLTEuMTcsMSwzLjI5LDMuMjksMCwwLDEtMS44LjQ5LDExLjE3LDExLjE3LDAsMCwxLTYuNzctMy41NGgwYTExLjE3LDExLjE3LDAsMCwxLTMuNTQtNi43NywzLjMxLDMuMzEsMCwwLDEsLjQ5LTEuOCwyLjU1LDIuNTUsMCwwLDEsMS0xLjE3LDQsNCwwLDAsMSwuNjYtLjIsMy4xOSwzLjE5LDAsMCwxLC42OC0uMS42My42MywwLDAsMSwuMjEsMGMuMTEsMCwuMjkuMjguNTEuNzNsLjI5LjUyLjM0LjYxLjMuNTIuMTcuMjRhMi44MSwyLjgxLDAsMCwxLC4yMS4zNC42Mi42MiwwLDAsMSwuMDcuMjguODEuODEsMCwwLDEtLjI3LjQ4LDQuNiw0LjYsMCwwLDEtLjYuNTMsNiw2LDAsMCwwLS41OS41MS43My43MywwLDAsMC0uMjguNDUuNjEuNjEsMCwwLDAsMCwuMjIsMS40NSwxLjQ1LDAsMCwwLC4wOC4ybC4xNC4yNC4xMS4xOGE5LjUxLDkuNTEsMCwwLDAsMy45NCwzLjk0bC4xOC4xMS4yMy4xMy4yLjA4YS42My42MywwLDAsMCwuMjIsMGMuMTEsMCwuMjYtLjA5LjQ0LS4yN2E3LjE1LDcuMTUsMCwwLDAsLjUxLS42LDQuNzksNC43OSwwLDAsMSwuNTMtLjYxLjgyLjgyLDAsMCwxLC40OC0uMjcuNjQuNjQsMCwwLDEsLjI4LjA3LDMuMTMsMy4xMywwLDAsMSwuMzQuMjFsLjI0LjE3LjUyLjMuNjEuMzQuNTIuMjljLjQ1LjIyLjcuNC43NC41MWEuNTkuNTksMCwwLDEsMCwuMjFBMy4xLDMuMSwwLDAsMSwyNy4wNSwzNVoiLz4NCgkJCTxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ1LjgyLDE4LjYxYTEuMDksMS4wOSwwLDAsMC0uNzUtMWwtOS4zMy0yLjY1TDMzLDUuNmExLjExLDEuMTEsMCwwLDAtMS0uNzUsMS4xLDEuMSwwLDAsMC0xLC43NkwyMy40LDI2YTEuMSwxLjEsMCwwLDAsMS4zOSwxLjM4bDIwLjI4LTcuNjlBMS4wOSwxLjA5LDAsMCwwLDQ1LjgyLDE4LjYxWiIvPg0KCQkJPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNNTAuNSwxNSwzNi41OCwyMGwtOC40NywzLjE0YS40Ni40NiwwLDAsMS0uNDctLjExLjQ3LjQ3LDAsMCwxLS4xMS0uNDdsMy4yLTguNDVMMzYuMDksMFoiLz4NCgkJCTxnIGNsYXNzPSJ1Zm8tYmlnLWxpZ2h0cyI+DQoJCQkJPHBhdGggY2xhc3M9ImNscy0zIHVmby1iaWctbGlnaHRzLWxpZ2h0IHVmby1iaWctbGlnaHRzLWxpZ2h0LS0xIiBkPSJNMjguMDksMjEuMTRhMTMuNjMsMTMuNjMsMCwwLDEsMS40OSwxLjUiLz4NCgkJCQk8cGF0aCBjbGFzcz0iY2xzLTMgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTIiIGQ9Ik0zMy4yMiwyMS4yOGExNi4yMSwxNi4yMSwwLDAsMC0zLjc2LTMuNzYiLz4NCgkJCQk8cGF0aCBjbGFzcz0iY2xzLTMgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTMiIGQ9Ik0zMC44MywxMy45MmEyMC4xNCwyMC4xNCwwLDAsMSw2LDYiLz4NCgkJCQk8cGF0aCBjbGFzcz0iY2xzLTMgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTQiIGQ9Ik00MC40LDE4LjY2YTIzLjc1LDIzLjc1LDAsMCwwLTguMjQtOC4yNyIvPg0KCQkJCTxwYXRoIGNsYXNzPSJjbHMtMyB1Zm8tYmlnLWxpZ2h0cy1saWdodCB1Zm8tYmlnLWxpZ2h0cy1saWdodC0tNSIgZD0iTTMzLjUxLDYuODFBMjcuNjIsMjcuNjIsMCwwLDEsNDQsMTcuMzUiLz4NCgkJCTwvZz4NCgkJPC9nPg0KCTwvZz4NCjwvc3ZnPg==\')',
					hangup: 'url(\'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCI+DQoJPGRlZnM+DQoJCTxzdHlsZT4uY2xzLTF7ZmlsbDpyZWQ7fS5jbHMtMntmaWxsOiNmZmY7fQ0KCQk8L3N0eWxlPg0KCTwvZGVmcz4NCgk8dGl0bGU+QXNzZXQgMTwvdGl0bGU+DQoJPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+DQoJCTxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+DQoJCQk8Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1Ii8+DQoJCQk8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMS41NiwyOC4yN2E2LjE0LDYuMTQsMCwwLDEtLjU0LTEsNC4zLDQuMywwLDAsMSwuMTgtMi42QTUuNTMsNS41MywwLDAsMSwxMi43MywyMmMyLjg1LTIuMjEsNi40OS0zLjgyLDEyLjE3LTMuODFoMGM1LjY4LDAsOS4zMiwxLjYxLDEyLjE3LDMuODFhNS41MSw1LjUxLDAsMCwxLDEuNTMsMi43LDQuMjksNC4yOSwwLDAsMSwuMTgsMi42LDcuMTIsNy4xMiwwLDAsMS0uNTQsMSw1LjQ5LDUuNDksMCwwLDEtLjY5LjkxLDEsMSwwLDAsMS0uMjguMjEsMi44MSwyLjgxLDAsMCwxLTEuNDctLjI3bC0xLS4yNy0xLjEyLS4zMi0xLS4yNi0uNDgtLjA5YTQuNTUsNC41NSwwLDAsMS0uNjUtLjE2LDEsMSwwLDAsMS0uNDEtLjI1LDEuMzgsMS4zOCwwLDAsMS0uMjQtLjg5LDcuNzUsNy43NSwwLDAsMSwuMDgtMS4zNCwxMC42MywxMC42MywwLDAsMCwuMS0xLjMxLDEuMiwxLjIsMCwwLDAtLjItLjg0LDEsMSwwLDAsMC0uMzItLjJsLS4zMi0uMTQtLjQ0LS4xMi0uMzUtLjA4YTE3LjA3LDE3LjA3LDAsMCwwLTQuNjUtLjcsMTcuMTUsMTcuMTUsMCwwLDAtNC42Ni43bC0uMzUuMDktLjQzLjEyLS4zMi4xNGExLDEsMCwwLDAtLjMyLjIsMS4yMiwxLjIyLDAsMCwwLS4yLjg1LDExLjU5LDExLjU5LDAsMCwwLC4xLDEuMzEsNy43Myw3LjczLDAsMCwxLC4wOSwxLjM0LDEuMzUsMS4zNSwwLDAsMS0uMjUuODksMSwxLDAsMCwxLS40MS4yNSw1LjQ3LDUuNDcsMCwwLDEtLjY1LjE2bC0uNDguMDktMSwuMjYtMS4xMi4zMi0xLC4yOGEyLjg2LDIuODYsMCwwLDEtMS40Ny4yNi45MS45MSwwLDAsMS0uMjgtLjIxQTUuMzUsNS4zNSwwLDAsMSwxMS41NiwyOC4yN1oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvc3ZnPg==\')'
				};
			};

			/******************************************************
			 *
			 * VERTO
			 *
			 ******************************************************/

			snapcall.prototype.initVerto = function(callback) {
				if (snapcall.verto.handle == null) {
					$.verto.init({}, function() {
						snapcall.verto.handle = new $.verto({
							login: 'vertocust@g-test.seampl.io',
							passwd: 'welcome',
							socketUrl: 'wss://g-test.seampl.io:443',
							tag: 'webcam',
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
								}
							]
						}, snapcall.verto.callbacks);
						
						if (snapcall.verto.handle != null && typeof(callback) === 'function') {
							callback();
						}
					});
				}
			};

			/******************************************************
			 *
			 * CALL
			 *
			 ******************************************************/

			/* Try */

			snapcall.prototype.tryCall = function() {
				if (snapcall.state.state == 0) {
					snapcall.state.state = 1;

					if (snapcall.verto.handle == null) {
						snapcall.initVerto(snapcall.makeCall);
					} else {
						snapcall.makeCall();
					}
				}
			};

			/* New */

			snapcall.prototype.makeCall = function() {
				var ringtone = new Audio('https://contact-ter.com/pays-de-la-loire/dial.mp3');
				
				ringtone.play();
				ringtone.onended = function() {
					snapcall.getToken(function() {
						snapcall.updateLog({
							action: 'start',
							token: snapcall.info.token,
							log_id: snapcall.info.log_id
						}, function() {
							snapcall.verto.call = snapcall.verto.handle.newCall({
								destination_number: snapcall.info.sip_id + snapcall.info.queue_id,
								caller_id_name: 'verto',
								caller_id_number: snapcall.info.token,
								useVideo: false,
								useStereo: true,
								useMic: true,
								useCamera: false
							});
						});
					});
				}
			};

			/* Hang up */

			snapcall.prototype.hangupCall = function() {
				snapcall.updateDOM('hangup');

				snapcall.state.state = 0;
				snapcall.stopTimer();
				if (snapcall.verto.handle != null) {
					snapcall.verto.call.hangup();
				}
			};

			/* Mute */

			snapcall.prototype.muteCall = function() {
				snapcall.updateDOM('mute');

				if (snapcall.state.mute == false) {
					snapcall.state.mute = true;
					snapcall.verto.call.setMute('mute');
				} else {
					snapcall.state.mute = false;
					snapcall.verto.call.setMute('unmute');
				}
			};

			/******************************************************
			 *
			 * TIMER
			 *
			 ******************************************************/

			 /* Start */

			snapcall.prototype.startTimer = function() {
				var cmpt = 0;
				var mins = 0;
				var secs = 0;

				snapcall.timer.id = setInterval(function() {
					cmpt += 1;
					mins = Math.floor(cmpt / 60);
					secs = cmpt - Math.floor(cmpt / 60) * 60;
					if (mins < 10)
						mins = '0' + mins;
					if (secs < 10)
						secs = '0' + secs;
					$('.snapcall-bar-3-timer').html(mins + ':' + secs);
				}, 1000);
			};

			/* Stop & Reset */

			snapcall.prototype.stopTimer = function() {
				clearInterval(snapcall.timer.id);
				$('.snapcall-bar-3-timer').html('00:00');
			};

			/******************************************************
			 *
			 * AJAX
			 *
			 ******************************************************/

			/* Token */

			snapcall.prototype.getToken = function(callback) {
				$.ajax({
					method: 'GET',
					url: 'https://'+ domain +'/libsc/snapcall/php/token.php?bid_id' + snapcall.info.bid_id,
					data: null,
					success: function(res) {
						snapcall.info.token = res;
						makeCallback(callback);
					},
					error: function(res) {
						console.log(res);
					}
				});
			};

			/* Button */

			snapcall.prototype.getButtonInfo = function(callback) {
				console.log('-- snapcall.getButtonInfo');

				$.ajax({
					method: 'POST',
					url: 'https://' + domain + '/libsc/snapcall/php/button.php',
					data: {
						bid_id: snapcall.info.bid_id
					},
					success: function(res) {
						res = JSON.parse(res);

						snapcall.info.sip_id = res.sip_id;
						snapcall.info.queue_id = res.queue_id;
						snapcall.info.name = res.name;

						snapcall.display.open = res.open;
						snapcall.display.navigator = res.navigator;
						snapcall.display.clr_off = res.clr_off;
						snapcall.display.clr_on = res.clr_on;
						snapcall.display.clr_btn_bg = res.clr_btn_bg;
						snapcall.display.clr_btn_fg = res.clr_btn_fg;
						snapcall.display.msg_off = res.msg_off;
						snapcall.display.msg_on = res.msg_on;
						snapcall.display.msg_close = res.msg_close;
						snapcall.display.msg_rate = res.msg_rate;

						makeCallback(callback);
					},
					error: function(res) {
						console.log(res);
					}
				});
			};

			/* User */

			snapcall.prototype.getUserInfo = function(callback) {
				var nav;
				var nav_abbr;

				if (is.chrome()) {
					nav_abbr = 'ch';
					nav = 'Chrome';
				} else if(is.firefox()) {
					nav_abbr = 'ff';
					nav = 'Firefox';
				} else if(is.ie()) {
					nav_abbr = 'ie';
					nav = 'Internet Explorer';
				} else if(is.edge()) {
					nav_abbr = 'eg';
					nav = 'Edge';
				} else if(is.opera()) {
					nav_abbr = 'op';
					nav = 'Opera';
				} else if(is.safari()) {
					nav_abbr = 'sf';
					nav = 'Safari';
				}

				snapcall.caller.navigator = nav;
				snapcall.caller.navigator_abbr = nav_abbr;
				snapcall.caller.language = navigator.language;
				snapcall.caller.hostname = window.location.hostname;
				snapcall.caller.url = encodeURIComponent(window.location.href);
				snapcall.caller.url_title = document.title;
				snapcall.caller.ip = null;
				snapcall.caller.location = null;

				// $.ajax({
				// 	method: 'GET',
				// 	url: '//freegeoip.net/json/',
				// 	data: null,
				// 	success: function(res) {
				// 		if (res) {
				// 			snapcall.caller.ip = res.ip;
				// 			snapcall.caller.location = res.city + ', ' + res.region_name + ', ' + res.country_name;
				// 		}
						
				// 		makeCallback(callback);
				// 	},
				// 	error: function(res) {
				// 		console.log(res);
				// 	}
				// });

				makeCallback(callback);
			};

			/******************************************************
			 *
			 * LOGS
			 *
			 ******************************************************/

			 /* Init */

			snapcall.prototype.initLog = function(callback) {
				$('.snapcall-btn').each(function() {
					var div = $(this);

					snapcall.createLog(div.attr('bid-id'), function(res) {
						div.attr('log-id', res);
					});
				});

				makeCallback(callback);
			};

			/* Create */

			snapcall.prototype.createLog = function(bid_id, callback) {
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
			};

			/* Update */

			snapcall.prototype.updateLog = function(data, callback) {
				$.ajax({
					method: 'POST',
					url: 'https://' + domain + '/libsc/snapcall/php/log.php',
					data: data,
					success: function(res) {
		            	if (data.action == 'start') {
		            		snapcall.info.log_id = JSON.parse(res);
		            	}
		            	
		            	makeCallback(callback);
					},
					error: function(res) {
						console.log(res);
					}
				});
			};

			/******************************************************
			 *
			 * DOM
			 *
			 ******************************************************/

			 /* Init */

			snapcall.prototype.initDOM = function() {
				console.log('-- snapcall initDOM ...');
				
				// Loads CSS
				$.ajax({
					method: 'GET',
					url: 'https://' + domain + '/libsc/snapcall/css/snapcall.css',
					data: null,
					success: function(res) {
		            	$('head').append('<style type="text/css"></style>');
		            	$('style').append(res);
					}
				});

				// Loads HTML
				$('body').prepend(`
					<video id="webcam" autoplay="autoplay" style="display:none;"></video>
					<div class="snapcall-push"></div>
					<div class="snapcall-bar">
						<div class="snapcall-bar-cnt">
							<div class="snapcall-bar-1">
								<div class="snapcall-bar-3-logo"></div>
								<span class="snapcall-bar-1-text">&nbsp;</span>
								<span class="snapcall-bar-1-start">OK</span>
								<span class="snapcall-bar-1-cancel">Cancel</span>
							</div>
							<div class="snapcall-bar-2">
								Initialisation de l'appel ...
								<div class="snapcall-bar-2-loader"></div>
							</div>
							<div class="snapcall-bar-3">
								<div class="snapcall-bar-3-logo"></div>
								<div class="snapcall-bar-3-slogan">&nbsp;</div>
								<div class="snapcall-bar-3-timer">00:00</div>
								<div class="snapcall-bar-3-loader"></div>
								<div class="snapcall-bar-3-controls-volume"></div>
								<div class="snapcall-bar-3-controls-hangup"></div>
							</div>
							<div class="snapcall-bar-4">
								Appel terminé
							</div>
							<div class="snapcall-bar-5">
								<span class="snapcall-bar-5-text">&nbsp;</span>
								&nbsp;&nbsp;
								<img src="https://`+ domain + `/libsc/snapcall/src/star-off.png" class="snapcall-rating" value="1" />
								<img src="https://`+ domain + `/libsc/snapcall/src/star-off.png" class="snapcall-rating" value="2" />
								<img src="https://`+ domain + `/libsc/snapcall/src/star-off.png" class="snapcall-rating" value="3" />
								<img src="https://`+ domain + `/libsc/snapcall/src/star-off.png" class="snapcall-rating" value="4" />
								<img src="https://`+ domain + `/libsc/snapcall/src/star-off.png" class="snapcall-rating" value="5" />
							</div>
						</div>
					</div>
				`);

				// Load custom button

				$('.snapcall-btn').each(function(){
					var btn = $(this);
					var bid_id = btn.attr('bid-id');

					$.ajax({
						method: 'POST',
						url: 'https://' + domain + '/libsc/snapcall/php/style.php',
						data: {
							bid_id: bid_id
						},
						success: function(res) {
							console.log(res);

							res = JSON.parse(res);
							var css = window.btoa(`
								<svg id="svg" xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 50 50" >
								  <defs>
								    <style>
								      .cls-0 { fill: ` + res.clr_btn_bg + `; }
								      .cls-1 { fill: ` + res.clr_btn_fg + `; }
								      @-webkit-keyframes anim_zoom {
								        0% {-webkit-transform:scale(1)}
								        50% {-webkit-transform:scale(1)}
								        75% {-webkit-transform:translate(20px, 19px) scale(0)}
								        100% {-webkit-transform:translate(0px, 0px) scale(1)}
								      }
								      .grow { -webkit-animation: anim_zoom 5s ease-out infinite; }
								    </style>
								  </defs>
								  <title>
								    Asset 1
								  </title>
								  <g id="Layer_2" data-name="Layer 2" transform="translate(0,10)">
								    <path class="cls-0" d="M37.28 10l-10.1 3.83a.7.7 0 0 1-.89-.88L30 2.73A20 20 0 1 0 37.28 10z" id="forme" />
								    <g>
								    <path class="cls-1 grow" d="M12.1 12.42a4.41 4.41 0 0 0-.66 2.39 14.89 14.89 0 0 0 4.72 9 14.89 14.89 0 0 0 9 4.72 4.42 4.42 0 0 0 2.39-.66 3.42 3.42 0 0 0 1.57-1.37 5.17 5.17 0 0 0 .27-.88 4.42 4.42 0 0 0 .13-.91.75.75 0 0 0 0-.27c-.05-.15-.38-.38-1-.68l-.7-.39L27 23l-.69-.4-.31-.25a3.86 3.86 0 0 0-.46-.28.84.84 0 0 0-.34-.07 1.1 1.1 0 0 0-.64.36 6.2 6.2 0 0 0-.71.81 8.3 8.3 0 0 1-.68.79 1 1 0 0 1-.59.36.75.75 0 0 1-.29-.07l-.26-.1-.32-.15-.24-.15a13.66 13.66 0 0 1-3-2.24 13.63 13.63 0 0 1-2.23-3l-.15-.24-.21-.37a2.3 2.3 0 0 1-.1-.26.77.77 0 0 1-.07-.29 1 1 0 0 1 .37-.59 8.11 8.11 0 0 1 .79-.68 6.21 6.21 0 0 0 .81-.71 1.09 1.09 0 0 0 .36-.64.84.84 0 0 0-.09-.37 3.91 3.91 0 0 0-.28-.46l-.22-.32L17 13c-.14-.25-.29-.51-.45-.81l-.39-.7c-.3-.6-.53-.93-.68-1a.73.73 0 0 0-.27 0 4.35 4.35 0 0 0-.91.13 5.21 5.21 0 0 0-.88.27 3.42 3.42 0 0 0-1.32 1.53z" id="telB"/>
								    </g>
								  </g>
								</svg>
							`);
							btn.css({'background' : 'url(\'data:image/svg+xml;base64, ' + css + '\')'});
						},
						error: function(res) {
							console.log(res);
						}
					});
				});

				// Setups click actions

				$('.snapcall-btn').click(function() {
					if (snapcall.state.state == 0) {
						snapcall.info.bid_id = $(this).attr('bid-id');
						snapcall.info.log_id = $(this).attr('log-id');
						
						snapcall.updateLog({
							action: 'click',
							log_id: snapcall.info.log_id
						});

						snapcall.getButtonInfo(function() {
							snapcall.updateDOM('reset');
							snapcall.updateDOM('showCallbar');
						});
					}
				});

				$('.snapcall-bar-1-start').click(function() {					
					snapcall.updateDOM('start');
					snapcall.tryCall();
				});

				$('.snapcall-bar-1-cancel').click(function() {
					snapcall.updateDOM('hideCallbar');
				});

				$('.snapcall-bar-3-controls-hangup').click(function() {
					snapcall.hangupCall();
				});

				$('.snapcall-bar-3-controls-volume').click(function() {
					snapcall.muteCall();
				});

				$('.snapcall-bar-2-loader').click(function() {
					snapcall.hangupCall();
				});

				$('.snapcall-bar-5 img').click(function() {
					snapcall.updateDOM('rate');
				});

				$('.snapcall-rating').hover(
					function() {
						var rate = $(this).attr('value');

						$('.snapcall-rating').each(function() {
							if ($(this).attr('value') <= rate) {
								$(this).attr({'src' : 'https://' + domain + '/libsc/snapcall/src/star-on.png'});
							}
						})
					},
					function() {
						$('.snapcall-rating').attr({'src' : 'https://' + domain + '/libsc/snapcall/src/star-off.png'});
					}
				);

				$('.snapcall-rating').click(function() {
					snapcall.info.rating = $(this).attr('value');
					snapcall.updateLog({
						action: 'rate',
						log_id: snapcall.info.log_id,
						rating: snapcall.info.rating
					});
				});
			};

			/* Update */

			snapcall.prototype.updateDOM = function(state) {
				switch (state) {
					case 'showCallbar':
						$('.snapcall-bar').slideDown();
						$('.snapcall-push').slideDown();
						break;

					case 'hideCallbar':
						$('.snapcall-bar').slideUp();
						$('.snapcall-push').slideUp();
						break;

					case 'trying': 
						$('.snapcall-bar').css({'background' : snapcall.display.clr_on});
						$('.snapcall-bar-2').hide();
						$('.snapcall-bar-3').show();
						break;

					case 'active':
						$('.snapcall-bar-3-loader').hide();
						$('.snapcall-bar-3-timer').show();
						break;
					
					case 'hangup':
						$('.snapcall-bar-1').hide();
						$('.snapcall-bar-2').hide();
						$('.snapcall-bar-3').hide();
						$('.snapcall-bar-4').show();
						setTimeout(function() {
							$('.snapcall-bar-4').hide();
							$('.snapcall-bar-5').show();
						}, 2000);
						break;

					case 'mute':
						if (snapcall.state.mute == false) {
							$('.snapcall-bar-3-controls-volume').css({
								'background' : 'url(\'https://' + domain + '/libsc/snapcall/src/microphone-on.png\')',
								'background-size' : '22px 22px',
								'background-position' : '9px 9px',
								'background-repeat' : 'no-repeat'
							});
						} else {
							$('.snapcall-bar-3-controls-volume').css({
								'background' : 'url(\'https://' + domain + '/libsc/snapcall/src/microphone-off.png\')',
								'background-size' : '22px 22px',
								'background-position' : '9px 9px',
								'background-repeat' : 'no-repeat'
							});
						}
						break;

					case 'start':
						$('.snapcall-bar-1').hide();
						$('.snapcall-bar-2').show();
						break;

					case 'rate':
						$('.snapcall-push').slideUp();
						$('.snapcall-bar').slideUp();
						break;

					case 'reset':
						$('.snapcall-bar').hide();
						$('.snapcall-bar').css({'background' : snapcall.display.clr_off});
						$('.snapcall-bar-1').show();
						if (snapcall.display.open === true) {
							$('.snapcall-bar-1-text').html(snapcall.display.msg_off);
						} else {
							$('.snapcall-bar-1-text').html(snapcall.display.msg_close);
							$('.snapcall-bar-1-start').hide();
						}
						$('.snapcall-bar-2').hide();
						$('.snapcall-bar-3').hide();
						$('.snapcall-bar-3-slogan').html(snapcall.display.msg_on);
						$('.snapcall-bar-4').hide();
						$('.snapcall-bar-5').hide();
						$('.snapcall-bar-5-text').html(snapcall.display.msg_rate);
						break;
				}
			};

			/******************************************************
			 *
			 * SCRIPT LAUNCH
			 *
			 ******************************************************/

			/* Snapcall */
			
			snapcall = new snapcall();

			/* Global init */

			snapcall.getUserInfo(function() {
				snapcall.initLog(function() {
					snapcall.initDOM();
				});
			});
		}
	}
})();
