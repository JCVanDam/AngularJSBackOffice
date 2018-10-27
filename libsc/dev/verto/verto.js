(function() {
	var domain = 'sandbox.seampl.io';
	// var domain = '127.0.0.1';

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
			loadScript('https://' + domain + '/libsc/dev/verto/src/jquery.cookie.js', function() {
				loadScript('https://' + domain + '/libsc/detectrtc/DetectRTC.min.js', function() {
					loadScript('https://' + domain + '/libsc/jquery-json/dist/jquery.json.min.js', function() {
						loadScript('https://' + domain + '/libsc/dev/verto/src/jquery.FSRTC.js', function() {
							loadScript('https://' + domain + '/libsc/dev/verto/src/jquery.jsonrpcclient.js', function() {
								loadScript('https://' + domain + '/libsc/dev/verto/src/jquery.verto.js', function() {
									loadScript('https://' + domain + '/libsc/dev/verto/src/adapter-latest.js', function() {				
										loadScript('https://' + domain + '/libsc/is/is.min.js', function() {
											loadScript('https://' + domain + '/libsc/dev/verto/verto-snap.js');
										});
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