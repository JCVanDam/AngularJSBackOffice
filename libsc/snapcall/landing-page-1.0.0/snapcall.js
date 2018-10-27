(function() {
	var domain = 'sandbox.seampl.io';

	function makeCallback(func, param) {
		if (typeof(func) === 'function') {
			if (param) {
				func(param);
			} else {
				func();
			}
		}
	};

	function loadScript(url, callback) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
		script.onload = function() {
			makeCallback(callback);
		};
	};

	var loadLibraries = function() {
		if (window.jQuery) {
			console.log('Loading DetectRTC');
			loadScript('https://' + domain + '/libsc/detectrtc/DetectRTC.min.js', function() {
				console.log('Loading AdapterJS');
				loadScript('https://webrtc.github.io/adapter/adapter-latest.js', function() {
					console.log('Loading jQuery-json');
					loadScript('https://' + domain + '/libsc/jquery-json/dist/jquery.json.min.js', function() {
						console.log('Loading FSRTC');
						loadScript('https://' + domain + '/libsc/verto/src/jquery.FSRTC.js', function() {
							console.log('Loading JsonRpcClient');
							loadScript('https://' + domain + '/libsc/verto/src/jquery.jsonrpcclient.js', function() {
								console.log('Loading Verto');
								loadScript('https://' + domain + '/libsc/verto/src/jquery.verto.js', function() {
									console.log('Loading Is');
									loadScript('https://' + domain + '/libsc/is/is.min.js', function() {
										console.log('Loading Snapcall');
										loadScript('https://' + domain + '/libsc/snapcall/landing-page-1.0.0/snapcall.fn.js');
									});
								});
							});
						});
					});
				});
			});
		} else {
			setTimeout(function() {
				loadLibraries();
			}, 50);
		}
	};

	window.onload = function() {
		if (!window.jQuery) {
			console.log('Loading jQuery');
			loadScript('https://' + domain + '/libsc/jquery/dist/jquery.min.js');
		}
		loadLibraries();
	};
})();