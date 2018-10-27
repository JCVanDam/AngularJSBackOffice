(function() { 
	var domain = 'sandbox.seampl.io';

	function getTimestamp() {
		return (Math.round(Date.now() / 1000));
	};

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

	loadScript('https://' + domain + '/libsc/jquery/dist/jquery.min.js', function() {
		loadScript('https://cdn.webrtc-experiment.com/DetectRTC.js');
		loadScript('https://webrtc.github.io/adapter/adapter-latest.js');
		loadScript('https://' + domain + '/libsc/jquery-json/dist/jquery.json.min.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.FSRTC.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.jsonrpcclient.js');
		loadScript('https://' + domain + '/libsc/verto/src/jquery.verto.js');
		loadScript('https://' + domain + '/libsc/is/is.min.js');
	});

	window.onload = function() {
		if (window.jQuery) {

			console.log('-- snapcall | Creating snapcall object ...');
			var snapcall = {
				button: {
					token: null,
					bid_id: null,
					sip_id: null,
					queue_id: null,
					log_id: null,
					background: {
						unactive: 'url(\'data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgPg0KICA8ZGVmcz4NCiAgICA8c3R5bGU+DQogICAgICAuY2xzLTF7ZmlsbDojZmZmO30NCg0KICAgIDwvc3R5bGU+DQogIDwvZGVmcz4NCiAgPHRpdGxlPg0KICAgIEFzc2V0IDENCiAgPC90aXRsZT4NCiAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwxMCkiPg0KICAgIDxwYXRoIGQ9Ik0zNy4yOCAxMGwtMTAuMSAzLjgzYS43LjcgMCAwIDEtLjg5LS44OEwzMCAyLjczQTIwIDIwIDAgMSAwIDM3LjI4IDEweiIgaWQ9ImZvcm1lIi8+DQogICAgPGc+DQogICAgPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMTIuMSAxMi40MmE0LjQxIDQuNDEgMCAwIDAtLjY2IDIuMzkgMTQuODkgMTQuODkgMCAwIDAgNC43MiA5IDE0Ljg5IDE0Ljg5IDAgMCAwIDkgNC43MiA0LjQyIDQuNDIgMCAwIDAgMi4zOS0uNjYgMy40MiAzLjQyIDAgMCAwIDEuNTctMS4zNyA1LjE3IDUuMTcgMCAwIDAgLjI3LS44OCA0LjQyIDQuNDIgMCAwIDAgLjEzLS45MS43NS43NSAwIDAgMCAwLS4yN2MtLjA1LS4xNS0uMzgtLjM4LTEtLjY4bC0uNy0uMzlMMjcgMjNsLS42OS0uNC0uMzEtLjI1YTMuODYgMy44NiAwIDAgMC0uNDYtLjI4Ljg0Ljg0IDAgMCAwLS4zNC0uMDcgMS4xIDEuMSAwIDAgMC0uNjQuMzYgNi4yIDYuMiAwIDAgMC0uNzEuODEgOC4zIDguMyAwIDAgMS0uNjguNzkgMSAxIDAgMCAxLS41OS4zNi43NS43NSAwIDAgMS0uMjktLjA3bC0uMjYtLjEtLjMyLS4xNS0uMjQtLjE1YTEzLjY2IDEzLjY2IDAgMCAxLTMtMi4yNCAxMy42MyAxMy42MyAwIDAgMS0yLjIzLTNsLS4xNS0uMjQtLjIxLS4zN2EyLjMgMi4zIDAgMCAxLS4xLS4yNi43Ny43NyAwIDAgMS0uMDctLjI5IDEgMSAwIDAgMSAuMzctLjU5IDguMTEgOC4xMSAwIDAgMSAuNzktLjY4IDYuMjEgNi4yMSAwIDAgMCAuODEtLjcxIDEuMDkgMS4wOSAwIDAgMCAuMzYtLjY0Ljg0Ljg0IDAgMCAwLS4wOS0uMzcgMy45MSAzLjkxIDAgMCAwLS4yOC0uNDZsLS4yMi0uMzJMMTcgMTNjLS4xNC0uMjUtLjI5LS41MS0uNDUtLjgxbC0uMzktLjdjLS4zLS42LS41My0uOTMtLjY4LTFhLjczLjczIDAgMCAwLS4yNyAwIDQuMzUgNC4zNSAwIDAgMC0uOTEuMTMgNS4yMSA1LjIxIDAgMCAwLS44OC4yNyAzLjQyIDMuNDIgMCAwIDAtMS4zMiAxLjUzeiIgaWQ9InRlbEIiLz4NCiAgICA8L2c+DQogIDwvZz4NCjwvc3ZnPg0K\')',
						unactive_bounce: 'url(\'data:image/svg+xml;base64, CgkJCTxzdmcgaWQ9InN2ZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgNTAgNTAiID4KCQkJICA8ZGVmcz4KCQkJICAgIDxzdHlsZT4KCQkJICAgICAgLmNscy0wIHsgZmlsbDogIzY0MTg3NTsgfQoJCQkgICAgICAuY2xzLTEgeyBmaWxsOiAjRkZGRkZGOyB9CgkJCSAgICAgIEAtd2Via2l0LWtleWZyYW1lcyBhbmltX3pvb20gewoJCQkgICAgICAgIDAlIHstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKX0KCQkJICAgICAgICA1MCUgey13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpfQoJCQkgICAgICAgIDc1JSB7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKDIwcHgsIDE5cHgpIHNjYWxlKDApfQoJCQkgICAgICAgIDEwMCUgey13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwcHgsIDBweCkgc2NhbGUoMSl9CgkJCSAgICAgIH0KCQkJICAgICAgLmdyb3cgeyAtd2Via2l0LWFuaW1hdGlvbjogYW5pbV96b29tIDVzIGVhc2Utb3V0IGluZmluaXRlOyB9CgkJCSAgICA8L3N0eWxlPgoJCQkgIDwvZGVmcz4KCQkJICA8dGl0bGU+CgkJCSAgICBBc3NldCAxCgkJCSAgPC90aXRsZT4KCQkJICA8ZyBpZD0iTGF5ZXJfMiIgZGF0YS1uYW1lPSJMYXllciAyIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLDEwKSI+CgkJCSAgICA8cGF0aCBjbGFzcz0iY2xzLTAiIGQ9Ik0zNy4yOCAxMGwtMTAuMSAzLjgzYS43LjcgMCAwIDEtLjg5LS44OEwzMCAyLjczQTIwIDIwIDAgMSAwIDM3LjI4IDEweiIgaWQ9ImZvcm1lIiAvPgoJCQkgICAgPGc+CgkJCSAgICA8cGF0aCBjbGFzcz0iY2xzLTEgZ3JvdyIgZD0iTTEyLjEgMTIuNDJhNC40MSA0LjQxIDAgMCAwLS42NiAyLjM5IDE0Ljg5IDE0Ljg5IDAgMCAwIDQuNzIgOSAxNC44OSAxNC44OSAwIDAgMCA5IDQuNzIgNC40MiA0LjQyIDAgMCAwIDIuMzktLjY2IDMuNDIgMy40MiAwIDAgMCAxLjU3LTEuMzcgNS4xNyA1LjE3IDAgMCAwIC4yNy0uODggNC40MiA0LjQyIDAgMCAwIC4xMy0uOTEuNzUuNzUgMCAwIDAgMC0uMjdjLS4wNS0uMTUtLjM4LS4zOC0xLS42OGwtLjctLjM5TDI3IDIzbC0uNjktLjQtLjMxLS4yNWEzLjg2IDMuODYgMCAwIDAtLjQ2LS4yOC44NC44NCAwIDAgMC0uMzQtLjA3IDEuMSAxLjEgMCAwIDAtLjY0LjM2IDYuMiA2LjIgMCAwIDAtLjcxLjgxIDguMyA4LjMgMCAwIDEtLjY4Ljc5IDEgMSAwIDAgMS0uNTkuMzYuNzUuNzUgMCAwIDEtLjI5LS4wN2wtLjI2LS4xLS4zMi0uMTUtLjI0LS4xNWExMy42NiAxMy42NiAwIDAgMS0zLTIuMjQgMTMuNjMgMTMuNjMgMCAwIDEtMi4yMy0zbC0uMTUtLjI0LS4yMS0uMzdhMi4zIDIuMyAwIDAgMS0uMS0uMjYuNzcuNzcgMCAwIDEtLjA3LS4yOSAxIDEgMCAwIDEgLjM3LS41OSA4LjExIDguMTEgMCAwIDEgLjc5LS42OCA2LjIxIDYuMjEgMCAwIDAgLjgxLS43MSAxLjA5IDEuMDkgMCAwIDAgLjM2LS42NC44NC44NCAwIDAgMC0uMDktLjM3IDMuOTEgMy45MSAwIDAgMC0uMjgtLjQ2bC0uMjItLjMyTDE3IDEzYy0uMTQtLjI1LS4yOS0uNTEtLjQ1LS44MWwtLjM5LS43Yy0uMy0uNi0uNTMtLjkzLS42OC0xYS43My43MyAwIDAgMC0uMjcgMCA0LjM1IDQuMzUgMCAwIDAtLjkxLjEzIDUuMjEgNS4yMSAwIDAgMC0uODguMjcgMy40MiAzLjQyIDAgMCAwLTEuMzIgMS41M3oiIGlkPSJ0ZWxCIi8+CgkJCSAgICA8L2c+CgkJCSAgPC9nPgoJCQk8L3N2Zz4KCQk=\')',
						requesting: 'url(\'data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCIgY2xhc3M9ImdlbiI+Cgk8ZGVmcz4KCQk8c3R5bGU+CgkJCS5jbHMtMHtmaWxsOiM2NDE4NzV9CgkJCS5jbHMtMXtmaWxsOiMwMDA7fQoJCQlALXdlYmtpdC1rZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgewoJCQkgIDAlICAgICAgICB7ZmlsbDogIzAwMH0KCQkJICA1MCUgICAgICAge2ZpbGw6ICNmZmZ9CgkJCSAgMTAwJSB7ZmlsbDogIzAwMH0KCQkJfQoJCQlALW1vei1rZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgewoJCQkgIDAlICAgICAgICB7ZmlsbDogIzAwMH0KCQkJICA1MCUgICAgICAge2ZpbGw6ICNmZmZ9CgkJCSAgMTAwJSB7ZmlsbDogIzAwMH0KCQkJfQoJCQlrZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgewoJCQkgIDAlICAgICAgICB7ZmlsbDogIzAwMH0KCQkJICA1MCUgICAgICAge2ZpbGw6ICNmZmZ9CgkJCSAgMTAwJSB7ZmlsbDogIzAwMH0KCQkJfQoKCQkJLnVmby1iaWctbGlnaHRzLWxpZ2h0IHsKCQkJCS13ZWJraXQtYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7CgkJCQktbW96LWFuaW1hdGlvbjogdWZvLWJpZy1saWdodHMgMi41cyBlYXNlIGluZmluaXRlOwoJCQkJYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7CgkJCX0KCgkJCS51Zm8tYmlnLWxpZ2h0cy1saWdodC0tMSB7CgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjJzOwoJCQkJLW1vei1hbmltYXRpb24tZGVsYXk6IC4yczsKCQkJCWFuaW1hdGlvbi1kZWxheTogLjJzOwoJCQl9CgkJCS51Zm8tYmlnLWxpZ2h0cy1saWdodC0tMiB7CgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjRzOwoJCQkJLW1vei1hbmltYXRpb24tZGVsYXk6IC40czsKCQkJCWFuaW1hdGlvbi1kZWxheTogLjRzOwoJCQl9CgkJCS51Zm8tYmlnLWxpZ2h0cy1saWdodC0tMyB7CgkJCQktd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjZzOwoJCQkJLW1vei1hbmltYXRpb24tZGVsYXk6IC42czsKCQkJCWFuaW1hdGlvbi1kZWxheTogLjZzOwoJCQl9CgkJPC9zdHlsZT4KCTwvZGVmcz4KCTx0aXRsZT5Bc3NldCAxPC90aXRsZT4KCTxnIGlkPSJMYXllcl8yIiBkYXRhLW5hbWU9IkxheWVyIDIiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsMTApIj4KCQk8ZyBpZD0icm9uZCI+CgkJCTxjaXJjbGUgY2xhc3M9ImNscy0wIiBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGwtb3BhY2l0eT0iMSIvPgoJCTwvZz4KCQk8ZyBpZD0iYmFzZV9wb2ludCIgY2xhc3M9InVmby1iaWctbGlnaHRzIj4KCQkJPGNpcmNsZSBjbGFzcz0iY2xzLTEgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTEiIGN4PSIxMC40NyIgY3k9IjIwLjAzIiByPSIyLjUiLz4KCQkJPGNpcmNsZSBjbGFzcz0iY2xzLTEgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTIiIGN4PSIxOS45NyIgY3k9IjIwLjAzIiByPSIyLjUiLz4KCQkJPGNpcmNsZSBjbGFzcz0iY2xzLTEgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTMiIGN4PSIyOS40NyIgY3k9IjIwLjAzIiByPSIyLjUiLz4KCQk8L2c+Cgk8L2c+Cjwvc3ZnPg==\')',
						active: 'url(\'data:image/svg+xml;base64, CiAgICAgICAgPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciICB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSIwIDAgNTAuNTAgNTAuNzMiPgogICAgICAgICAgICA8ZGVmcz4KICAgICAgICAgICAgICAgIDxzdHlsZT4uY2xzLTB7ZmlsbDojNjQxODc1fS5jbHMtMXtmaWxsOiNmZmY7fS5jbHMtMiwuY2xzLTN7ZmlsbDpub25lO30uY2xzLTN7c3Ryb2tlOiNmZmY7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNjdweDt9CiAgICAgICAgICAgICAgICAgICAgQC13ZWJraXQta2V5ZnJhbWVzIHVmby1iaWctbGlnaHRzIHsKICAgICAgICAgICAgICAgICAgICAgIDAlICAgICAgICB7c3Ryb2tlOiAjZmZmfQogICAgICAgICAgICAgICAgICAgICAgNTAlICAgICAgIHtzdHJva2U6ICMwMDB9CiAgICAgICAgICAgICAgICAgICAgICAxMDAlICAgICAgICAge3N0b2tlOiAjZmZmfQogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBALW1vei1rZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgewogICAgICAgICAgICAgICAgICAgICAgMCUgICAgICAgIHtzdHJva2U6ICNmZmZ9CiAgICAgICAgICAgICAgICAgICAgICA1MCUgICAgICAge3N0cm9rZTogIzAwMH0KICAgICAgICAgICAgICAgICAgICAgIDEwMCUge3N0b2tlOiAjZmZmfQogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICBrZXlmcmFtZXMgdWZvLWJpZy1saWdodHMgewogICAgICAgICAgICAgICAgICAgICAgMCUgICAgICAgIHtzdHJva2U6ICNmZmZ9CiAgICAgICAgICAgICAgICAgICAgICA1MCUgICAgICAge3N0cm9rZTogIzAwMH0KICAgICAgICAgICAgICAgICAgICAgIDEwMCUge3N0b2tlOiAjZmZmfQogICAgICAgICAgICAgICAgICAgIH0KCiAgICAgICAgICAgICAgICAgICAgLnVmby1iaWctbGlnaHRzLWxpZ2h0IHsKICAgICAgICAgICAgICAgICAgICAgICAgLXdlYmtpdC1hbmltYXRpb246IHVmby1iaWctbGlnaHRzIDIuNXMgZWFzZSBpbmZpbml0ZTsKICAgICAgICAgICAgICAgICAgICAgICAgLW1vei1hbmltYXRpb246IHVmby1iaWctbGlnaHRzIDIuNXMgZWFzZSBpbmZpbml0ZTsKICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiB1Zm8tYmlnLWxpZ2h0cyAyLjVzIGVhc2UgaW5maW5pdGU7CiAgICAgICAgICAgICAgICAgICAgfQoKICAgICAgICAgICAgICAgICAgICAudWZvLWJpZy1saWdodHMtbGlnaHQtLTEgewogICAgICAgICAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjJzOwogICAgICAgICAgICAgICAgICAgICAgICAtbW96LWFuaW1hdGlvbi1kZWxheTogLjJzOwogICAgICAgICAgICAgICAgICAgICAgICAtYW5pbWF0aW9uLWRlbGF5OiAuMnM7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgIC51Zm8tYmlnLWxpZ2h0cy1saWdodC0tMiB7CiAgICAgICAgICAgICAgICAgICAgICAgIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAuNHM7CiAgICAgICAgICAgICAgICAgICAgICAgIC1tb3otYW5pbWF0aW9uLWRlbGF5OiAuNHM7CiAgICAgICAgICAgICAgICAgICAgICAgIC1hbmltYXRpb24tZGVsYXk6IC40czsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgLnVmby1iaWctbGlnaHRzLWxpZ2h0LS0zIHsKICAgICAgICAgICAgICAgICAgICAgICAgLXdlYmtpdC1hbmltYXRpb24tZGVsYXk6IC42czsKICAgICAgICAgICAgICAgICAgICAgICAgLW1vei1hbmltYXRpb24tZGVsYXk6IC42czsKICAgICAgICAgICAgICAgICAgICAgICAgLWFuaW1hdGlvbi1kZWxheTogLjZzOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgICAgICAudWZvLWJpZy1saWdodHMtbGlnaHQtLTQgewogICAgICAgICAgICAgICAgICAgICAgICAtd2Via2l0LWFuaW1hdGlvbi1kZWxheTogLjhzOwogICAgICAgICAgICAgICAgICAgICAgICAtbW96LWFuaW1hdGlvbi1kZWxheTogLjhzOwogICAgICAgICAgICAgICAgICAgICAgICAtYW5pbWF0aW9uLWRlbGF5OiAuOHM7CiAgICAgICAgICAgICAgICAgICAgfQogICAgICAgICAgICAgICAgICAgIC51Zm8tYmlnLWxpZ2h0cy1saWdodC0tNSB7CiAgICAgICAgICAgICAgICAgICAgICAgIC13ZWJraXQtYW5pbWF0aW9uLWRlbGF5OiAxczsKICAgICAgICAgICAgICAgICAgICAgICAgLW1vei1hbmltYXRpb24tZGVsYXk6IDFzOwogICAgICAgICAgICAgICAgICAgICAgICAtYW5pbWF0aW9uLWRlbGF5OiAxczsKICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICA8L3N0eWxlPgogICAgICAgICAgICA8L2RlZnM+CiAgICAgICAgICAgIDx0aXRsZT5Bc3NldCAzPC90aXRsZT4KICAgICAgICAgICAgPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iZm9ybWUiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMCIgd2lkdGg9IjQwcHgiIGhlaWdodD0iNDBweCIgZD0iTTM3LjI4LDIwLjY5bC0xMC4xLDMuODNhLjcuNywwLDAsMS0uODktLjg4TDMwLDEzLjQ1YTIwLDIwLDAsMSwwLDcuMjMsNy4yM1oiLz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDxnIGlkPSJiYXNlIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0yNy4wNSwzNWEzLjksMy45LDAsMCwxLS4yMS42NiwyLjU2LDIuNTYsMCwwLDEtMS4xNywxLDMuMjksMy4yOSwwLDAsMS0xLjguNDksMTEuMTcsMTEuMTcsMCwwLDEtNi43Ny0zLjU0aDBhMTEuMTcsMTEuMTcsMCwwLDEtMy41NC02Ljc3LDMuMzEsMy4zMSwwLDAsMSwuNDktMS44LDIuNTUsMi41NSwwLDAsMSwxLTEuMTcsNCw0LDAsMCwxLC42Ni0uMiwzLjE5LDMuMTksMCwwLDEsLjY4LS4xLjYzLjYzLDAsMCwxLC4yMSwwYy4xMSwwLC4yOS4yOC41MS43M2wuMjkuNTIuMzQuNjEuMy41Mi4xNy4yNGEyLjgxLDIuODEsMCwwLDEsLjIxLjM0LjYyLjYyLDAsMCwxLC4wNy4yOC44MS44MSwwLDAsMS0uMjcuNDgsNC42LDQuNiwwLDAsMS0uNi41Myw2LDYsMCwwLDAtLjU5LjUxLjczLjczLDAsMCwwLS4yOC40NS42MS42MSwwLDAsMCwwLC4yMiwxLjQ1LDEuNDUsMCwwLDAsLjA4LjJsLjE0LjI0LjExLjE4YTkuNTEsOS41MSwwLDAsMCwzLjk0LDMuOTRsLjE4LjExLjIzLjEzLjIuMDhhLjYzLjYzLDAsMCwwLC4yMiwwYy4xMSwwLC4yNi0uMDkuNDQtLjI3YTcuMTUsNy4xNSwwLDAsMCwuNTEtLjYsNC43OSw0Ljc5LDAsMCwxLC41My0uNjEuODIuODIsMCwwLDEsLjQ4LS4yNy42NC42NCwwLDAsMSwuMjguMDcsMy4xMywzLjEzLDAsMCwxLC4zNC4yMWwuMjQuMTcuNTIuMy42MS4zNC41Mi4yOWMuNDUuMjIuNy40Ljc0LjUxYS41OS41OSwwLDAsMSwwLC4yMUEzLjEsMy4xLDAsMCwxLDI3LjA1LDM1WiIvPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTQ1LjgyLDE4LjYxYTEuMDksMS4wOSwwLDAsMC0uNzUtMWwtOS4zMy0yLjY1TDMzLDUuNmExLjExLDEuMTEsMCwwLDAtMS0uNzUsMS4xLDEuMSwwLDAsMC0xLC43NkwyMy40LDI2YTEuMSwxLjEsMCwwLDAsMS4zOSwxLjM4bDIwLjI4LTcuNjlBMS4wOSwxLjA5LDAsMCwwLDQ1LjgyLDE4LjYxWiIvPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTUwLjUsMTUsMzYuNTgsMjBsLTguNDcsMy4xNGEuNDYuNDYsMCwwLDEtLjQ3LS4xMS40Ny40NywwLDAsMS0uMTEtLjQ3bDMuMi04LjQ1TDM2LjA5LDBaIi8+CiAgICAgICAgICAgICAgICAgICAgPGcgY2xhc3M9InVmby1iaWctbGlnaHRzIj4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIHVmby1iaWctbGlnaHRzLWxpZ2h0IHVmby1iaWctbGlnaHRzLWxpZ2h0LS0xIiBkPSJNMjguMDksMjEuMTRhMTMuNjMsMTMuNjMsMCwwLDEsMS40OSwxLjUiLz4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggY2xhc3M9ImNscy0zIHVmby1iaWctbGlnaHRzLWxpZ2h0IHVmby1iaWctbGlnaHRzLWxpZ2h0LS0yIiBkPSJNMzMuMjIsMjEuMjhhMTYuMjEsMTYuMjEsMCwwLDAtMy43Ni0zLjc2Ii8+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGNsYXNzPSJjbHMtMyB1Zm8tYmlnLWxpZ2h0cy1saWdodCB1Zm8tYmlnLWxpZ2h0cy1saWdodC0tMyIgZD0iTTMwLjgzLDEzLjkyYTIwLjE0LDIwLjE0LDAsMCwxLDYsNiIvPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTQiIGQ9Ik00MC40LDE4LjY2YTIzLjc1LDIzLjc1LDAsMCwwLTguMjQtOC4yNyIvPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBjbGFzcz0iY2xzLTMgdWZvLWJpZy1saWdodHMtbGlnaHQgdWZvLWJpZy1saWdodHMtbGlnaHQtLTUiIGQ9Ik0zMy41MSw2LjgxQTI3LjYyLDI3LjYyLDAsMCwxLDQ0LDE3LjM1Ii8+CiAgICAgICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICAgICAgPC9nPgogICAgICAgICAgICA8L2c+CiAgICAgICAgPC9zdmc+\')',
						hangup: 'url(\'data:image/svg+xml;base64, PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MHB4IiBoZWlnaHQ9IjUwcHgiIHZpZXdCb3g9IjAgMCA1MCA1MCI+DQoJPGRlZnM+DQoJCTxzdHlsZT4uY2xzLTF7ZmlsbDpyZWQ7fS5jbHMtMntmaWxsOiNmZmY7fQ0KCQk8L3N0eWxlPg0KCTwvZGVmcz4NCgk8dGl0bGU+QXNzZXQgMTwvdGl0bGU+DQoJPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+DQoJCTxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+DQoJCQk8Y2lyY2xlIGNsYXNzPSJjbHMtMSIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1Ii8+DQoJCQk8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMS41NiwyOC4yN2E2LjE0LDYuMTQsMCwwLDEtLjU0LTEsNC4zLDQuMywwLDAsMSwuMTgtMi42QTUuNTMsNS41MywwLDAsMSwxMi43MywyMmMyLjg1LTIuMjEsNi40OS0zLjgyLDEyLjE3LTMuODFoMGM1LjY4LDAsOS4zMiwxLjYxLDEyLjE3LDMuODFhNS41MSw1LjUxLDAsMCwxLDEuNTMsMi43LDQuMjksNC4yOSwwLDAsMSwuMTgsMi42LDcuMTIsNy4xMiwwLDAsMS0uNTQsMSw1LjQ5LDUuNDksMCwwLDEtLjY5LjkxLDEsMSwwLDAsMS0uMjguMjEsMi44MSwyLjgxLDAsMCwxLTEuNDctLjI3bC0xLS4yNy0xLjEyLS4zMi0xLS4yNi0uNDgtLjA5YTQuNTUsNC41NSwwLDAsMS0uNjUtLjE2LDEsMSwwLDAsMS0uNDEtLjI1LDEuMzgsMS4zOCwwLDAsMS0uMjQtLjg5LDcuNzUsNy43NSwwLDAsMSwuMDgtMS4zNCwxMC42MywxMC42MywwLDAsMCwuMS0xLjMxLDEuMiwxLjIsMCwwLDAtLjItLjg0LDEsMSwwLDAsMC0uMzItLjJsLS4zMi0uMTQtLjQ0LS4xMi0uMzUtLjA4YTE3LjA3LDE3LjA3LDAsMCwwLTQuNjUtLjcsMTcuMTUsMTcuMTUsMCwwLDAtNC42Ni43bC0uMzUuMDktLjQzLjEyLS4zMi4xNGExLDEsMCwwLDAtLjMyLjIsMS4yMiwxLjIyLDAsMCwwLS4yLjg1LDExLjU5LDExLjU5LDAsMCwwLC4xLDEuMzEsNy43Myw3LjczLDAsMCwxLC4wOSwxLjM0LDEuMzUsMS4zNSwwLDAsMS0uMjUuODksMSwxLDAsMCwxLS40MS4yNSw1LjQ3LDUuNDcsMCwwLDEtLjY1LjE2bC0uNDguMDktMSwuMjYtMS4xMi4zMi0xLC4yOGEyLjg2LDIuODYsMCwwLDEtMS40Ny4yNi45MS45MSwwLDAsMS0uMjgtLjIxQTUuMzUsNS4zNSwwLDAsMSwxMS41NiwyOC4yN1oiLz4NCgkJPC9nPg0KCTwvZz4NCjwvc3ZnPg==\')'
					}
				},

				call: {
					isMuted: false,
					state: 0,
					requestTimestamp: null,
					isRequestTimedOut: false
				},

				caller: {
					navigator: null,
					navigator_abbr: null,
					language: null,
					hostname: null,
					url: null,
					url_title: null,
					ip: null,
					location: null
				},

				verto: {
					handle: null,
					call: null,
					callbacks: {
						onDialogState: function(d) {
							switch (d.state.name) {
								case 'requesting':
									snapcall.call.state = 2;
									break;
								
								case 'trying':
									snapcall.call.state = 3;
									snapcall.call.requestTimestamp = getTimestamp();
									break;
								
								case 'active':
									snapcall.call.state = 4;
									snapcall.updateDOM('callActive');
									break;
								
								case 'hangup':
									snapcall.hangupCall();
									break;
							}
						}
					}
				},

				getToken: function(callback) {
					console.log('-- snapcall | getToken ...');

					$.ajax({
						method: 'GET',
						url: 'https://'+ domain +'/libsc/snapcall/php/token.php?bid_id' + snapcall.button.bid_id,
						data: null,
						success: function(res) {
							console.log('-- snapcall | token = ' + res);
							snapcall.button.token = res;

							makeCallback(callback);
						},
						error: function(res) {
							console.log(res);
						}
					});
				},

				getButtonInfo: function(callback) {
					console.log('-- snapcall | getButtonInfo ...');

					$.ajax({
						method: 'POST',
						url: 'https://' + domain + '/libsc/snapcall/php/button.php',
						data: {
							bid_id: snapcall.button.bid_id
						},
						success: function(res) {
							if (res != 'null') {
								res = JSON.parse(res);
								snapcall.button.sip_id = res.sip_id;
								snapcall.button.queue_id = res.queue_id;
								snapcall.button.name = res.name;

								makeCallback(callback);
							} else {
								snapcall.call.state = 0;
								snapcall.updateDOM('errorConnection');
							}
						},
						error: function(res) {
							console.log(res);
						}
					});
				},

				getCallerInfo: function(callback) {
					var nav = null;
					var nav_abbr = null;
					console.log('-- snapcall | getCallerInfo ...');

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
					snapcall.caller.ip = null;
					snapcall.caller.location = null;

					makeCallback(callback);
				},

				initLog: function(callback) {
					console.log('-- snapcall | initLog ...');

					$('.snapcall-push').each(function() {
						var btn = $(this);

						snapcall.createLog(btn.attr('bid-id'), function(res) {
							btn.attr('log-id', res);
						});
					});

					makeCallback(callback);
				},

				createLog: function(bid_id, callback) {
					console.log('-- snapcall | createLog ...');

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
					console.log('-- snapcall | updateLog ...');

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
					console.log('-- snapcall | initVerto ...');

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
					console.log('-- snapcall | tryCall ...');

					if (snapcall.call.state == 1) {
						if (snapcall.verto.handle == null) {
							snapcall.initVerto();
						} else {
							snapcall.makeCall();
						}
					}
				},

				makeCall: function() {
					var ringtone = new Audio('https://contact-ter.com/pays-de-la-loire/dial.mp3');
					console.log('-- snapcall | makeCall ...');
					
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
					console.log('-- snapcall | hangupCall ...');
					
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

				updateDOM: function(state) {
					console.log('-- snapcall | Updating DOM ...');
					
					switch (state) {
						case 'callReset':
							$('.snapcall-btn').css({'background' : snapcall.button.background.unactive_bounce, 'background-size' : '80px 80px'});
							$('.snapcall-btn').show();
							$('.snapcall-rating').hide();
							$('.snapcall-dialog-invite').show();
							$('.snapcall-dialog-rating').hide();
							$('.snapcall-dialog-browser').hide();
							$('.snapcall-dialog-connect').hide();
							$('.snapcall-dialog-timeout').hide();
							break;
						
						case 'callRequesting':							
							$('.snapcall-btn').css({'background' : snapcall.button.background.requesting, 'background-size' : '80px 80px'});
							break;
						
						case 'callActive':
							$('.snapcall-btn').css({'background' : snapcall.button.background.active, 'background-size' : '80px 80px'});
							break;
						
						case 'callHangup':
							$('.snapcall-btn').hide();
							$('.snapcall-rating').show();
							$('.snapcall-dialog-invite').hide();
							$('.snapcall-dialog-rating').show();
							break;
						
						case 'errorBrowser':
							$('.snapcall-btn').hide();
							$('.snapcall-dialog-invite').hide();
							$('.snapcall-dialog-browser').show();
							break;
						
						case 'errorConnection':
							$('.snapcall-btn').hide();
							$('.snapcall-dialog-invite').hide();
							$('.snapcall-dialog-connect').show();
							break;
						
						case 'errorTimeout':
							$('.snapcall-btn').hide();
							$('.snapcall-dialog-invite').hide();
							$('.snapcall-dialog-timeout').show();
							break;
					}
				}
			};

			$.get('https://' + domain + '/libsc/dev/sncf/snapcall-push.css', function(res) {
				console.log('-- snapcall | Loading CSS ...');
				
				$('head').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />');
				$('head').append('<style type="text/css"></style>');
				$('style').append(res);

				console.log('-- snapcall | Loading HTML ...');

				$('.snapcall-push').append(`
					<video id="webcam" autoplay="autoplay" style="display:none;"></video>
				
	                <div class="snapcall-btn"></div>

	                <div class="snapcall-rating">
                        <span class="fa fa-star snapcall-rating-star" value="1"></span>
                        <span class="fa fa-star snapcall-rating-star" value="2"></span>
                        <span class="fa fa-star snapcall-rating-star" value="3"></span>
                        <span class="fa fa-star snapcall-rating-star" value="4"></span>
                        <span class="fa fa-star snapcall-rating-star" value="5"></span>
	                </div>

                	<div class="snapcall-dialog-invite">
                		BESOIN D'INFOS ?<br />
                		<span class="clr-prune">APPELEZ-NOUS GRATUITEMENT EN UN CLIC !</span>
                	</div>

                	<div class="snapcall-dialog-rating">
						Votre avis nous intéresse<br /><br />
						<span class="clr-prune">Contact TER vous remercie de votre appel.</span>
                	</div>
                	
                	<div class="snapcall-dialog-connect">
						Echec de la connection<br /><br />
						<span class="clr-prune">Une erreur est survenue lors de la connection au service. Nous vous invitons a réessayer dans quelques minutes.</span>
	                </div>

	                <div class="snapcall-dialog-browser">
						<span class="clr-prune">Pour accéder à cette fonctionnalité il est recommandé d'utiliser les navigateurs suivants</span><br /><br />
						<span class="fa fa-chrome clr-prune" onclick="window.open('http://www.opera.com/fr');"></span>
						&nbsp;&nbsp;
						<span class="fa fa-firefox clr-prune" onclick="window.open('https://www.google.fr/chrome/browser/desktop/');"></span>
						&nbsp;&nbsp;
						<span class="fa fa-opera clr-prune" onclick="window.open('https://www.mozilla.org/fr/firefox/new/');"></span>
	                </div>

	                <div class="snapcall-dialog-timeout">
						Temps d'attente expiré<br /><br />
						<span class="clr-prune">Merci de vérifier l'activation de votre micro et votre connexion Internet.</span>
	                </div>
				`);

				console.log('-- snapcall | Loading DetectRTC ...');
				DetectRTC.load(function() {
					console.log('-- snapcall | success | DetectRTC is loaded');

		    		if (!DetectRTC.isWebRTCSupported) {
		    			console.log('-- snapcall | error | WebRTC is not yet supported');

		    			snapcall.updateDOM('errorBrowser');
		    		} else {
		    			console.log('-- snapcall | success | WebRTC is supported');

						snapcall.getCallerInfo(function() {
							snapcall.initLog(function() {
								
								$('.snapcall-btn').click(function() {
									if (snapcall.call.state == 0) {
										snapcall.call.state = 1;
										snapcall.button.bid_id = $(this).parent().attr('bid-id');
										snapcall.button.log_id = $(this).parent().attr('log-id');

										console.log('-- snapcall | bid_id = ' + snapcall.button.bid_id);
										console.log('-- snapcall | log_id = ' + snapcall.button.log_id);

										snapcall.updateDOM('callRequesting');
										
										snapcall.updateLog({
											action: 'click',
											log_id: snapcall.button.log_id
										});

										snapcall.getButtonInfo(function() {
											snapcall.tryCall();
										});
									} else if (snapcall.call.state >= 2) {
										snapcall.hangupCall();
									}
								});

								$('.snapcall-btn').hover(
									function() {
										if (snapcall.call.state >= 2) {
											$('.snapcall-btn').css({'background' : snapcall.button.background.hangup, 'background-size' : '80px 80px'});
										}
									},
									function() {
										if (snapcall.call.state >= 1 && snapcall.call.state <= 3) {
											$('.snapcall-btn').css({'background' : snapcall.button.background.requesting, 'background-size' : '80px 80px'});
										} else if (snapcall.call.state == 4) {
											$('.snapcall-btn').css({'background' : snapcall.button.background.active, 'background-size' : '80px 80px'});
										} else {
											$('.snapcall-btn').css({'background' : snapcall.button.background.unactive_bounce, 'background-size' : '80px 80px'});
										}
									}
								);

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
										$('.snapcall-rating-star').css({'color' : 'black'});
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

								setInterval(function() {
									if (snapcall.call.state == 3) {
										if (getTimestamp() - snapcall.call.requestTimestamp > 20) {
											snapcall.call.isRequestTimedOut = true;
											snapcall.hangupCall();
										}
									}
								}, 1000);

							});
						});
					}
				});
			});
		}
	}
})();