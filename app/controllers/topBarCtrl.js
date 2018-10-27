app.controller('topBarCtrl', function($scope, $rootScope, $http) {

/*
** Initialize
*/

	var url 									= window.sessionStorage.getItem('api-url');
	var call									= {
		handle			: null,
		currentCall	: null,
		connection	: 0,
		timerId			:	null,
		callerExit	: true
	};
	$scope.callHandle 				= true;
	$scope.displayHandleCall	= false;
	$scope.displayHandleLog		= false;
	$scope.logStatus					= false;
	$scope.mute								= false;
	$scope.hideHanswer				= false;
	$scope.tooltipLog 				= false;

/*
** Initialize name and company if user refresh after login.
*/

	if (window.sessionStorage.getItem('snapcall-user_name')){
		$rootScope.name 				= window.sessionStorage.getItem('snapcall-user_name');
		$rootScope.company 			= window.sessionStorage.getItem('snapcall-company_name');
	}

/*
** When user logout of backoffice, user pass in offline state but verto
** connection still exist.
*/

	$scope.$watch('displayTopBar', function(){
		if (!$rootScope.displayTopBar && $rootScope.vertoConnection)
			delogVerto();
	});

/*
** Initialize a verto connection with appropriate parameter and make a call to
** pass in offline state.
*/

	$scope.initializeConnection = function() {
		$scope.displayHandleLog = !$scope.displayHandleLog;
		if (!$rootScope.vertoConnection){
			navigator.getUserMedia(
				{ audio: true, video: true }
			);
			$rootScope.vertoConnection = true;
			$.verto.init({}, function () {

				const params = {
					login				: '6001@g-test.snapcall.io',
					passwd			: '654321',
					tag					: 'webcam',
					socketUrl		: "wss://g-test.snapcall.io:443",
					iceServers	: [
						{
							urls				: 'turn:t.snapcall.io:80?transport=tcp',
							credential	: 'test',
							username		: 'test'
						}, {
							urls				: 'turns:t.snapcall.io:443?transport=tcp',
							credential	: 'test',
							username		: 'test'
						}, {
							urls				: 'stun:stun.l.google.com:19302',
							credential	: '',
							username		: ''
						}
					],
					deviceParams	: {
						useMic			: 'any',
						useSpeak		: 'any',
					},
				};

				call.handle = new $.verto(params, {
					onWSLogin			: onWSLogin,
					onDialogState	: onDialogState
				});
			});
		}
	};

/*
** Change css attribute of the logbox when user changes his stat (inline,
** outline).
*/

	$scope.changeStatus = function(){
		$(".logbox").css('background-color', $scope.logStatus  ? '#D8264A' : '#75CA7D');
		$(".cursor").css('margin-left', $scope.logStatus ? '2px' : '22px');
		$scope.logStatus = !$scope.logStatus;
		if (!$scope.logStatus)
			changeStatus('6001@g-test.snapcall.io', '30#');
		else if ($scope.logStatus)
			changeStatus('6001@g-test.snapcall.io', '30*');
		setTimeout(function(){
			call.connection = 1;
		}, 5000);
	}

/*
**
*/

	function onWSLogin(verto, success) {
		if (success)
			changeStatus('6001@g-test.snapcall.io', '30#');
	}

/*
** Catch changes's state of dialog.
*/

	function onDialogState(dialog) {
		switch (dialog.state.name) {
			case 'ringing':
				handleRinging(dialog, 'ringing');
				console.log('verto state is ringing');
				break;
			case 'answering':
				if (call.currentCall === null)
					call.currentCall = dialog;
				console.log('verto state is answering');
				break;
			case 'destroy':
				if (call.connection)
					handleRinging(dialog, 'destroy');
				if (call.callerExit)
					$scope.$apply();
				clearInterval(call.timerId);
				timeInit();
				call.callerExit = true;
				console.log('verto state is destroy');
				break;
		}
	}

/*
** Make a call to login or log out an agent.
*/

	function changeStatus(caller, callee) {
		var params = {
			destination_number	: callee,
			caller_id_name			: "vertocust",
			caller_id_number		: caller,
			outgoingBandwidth		: "default",
			incomingBandwidth		: "default",
			useVideo						: false,
			useStereo						: true,
			useCamera						: "none",
			useMic							: "any",
			useSpeak						: "any",
			dedEnc							: false,
			mirrorInput					: false
		};
		call.currentCall = call.handle.newCall(params);
	}

/*
** Catch click event on the answer button.
*/

	function handleRinging(dialog, mode){
		if (mode === 'ringing'){
			call.currentCall 					= dialog;
			$scope.hideHanswer 				= true;
			$scope.displayHandleCall 	= true;
			$scope.displayHandleLog 	= false;
			$scope.$apply();
		} else if (mode === 'destroy') {
			//call.currentCall 					= null;
			$scope.hideHanswer 				= false;
			$scope.displayHandleCall 	= false;
			$scope.displayHandleLog 	= true;
		}
	}

/*
**
*/

		$scope.answerCall = function() {
		const params = {
			callee_id_name			: 'verto',
			callee_id_number		: 0,
			useVideo						: false,
			useStereo						: true,
			useMic							: true,
			useCamera						: false
		};

		if (call.currentCall) {
			call.currentCall.answer(params);
			$scope.hideHanswer = !$scope.hideHanswer;
			timer();
		}
	}

/*
**
*/

	$scope.hangupCall = function() {
		call.callerExit = false;
		if (call.currentCall) {
			call.currentCall.hangup();
		}
	}

/*
** Changes the micro property.
*/

	$scope.muteCall = function() {
		$scope.mute =! $scope.mute;
		if (!call.mute)
			call.currentCall.setMute("off");
		else
			call.currentCall.setMute("on");
	}

/*
**
*/

	function delogVerto(){
		$scope.displayHandleLog	= false;
		$scope.logStatus				= false;
		changeStatus('6001@g-test.snapcall.io', '30#');
		$(".logbox").css('background-color', '#D8264A');
		$(".cursor").css('margin-left', '2px');
	}

/*
** Initialize time value.
*/

	function timeInit() {
		$scope.sec 		= "00";
		$scope.min 		= "00";
		$scope.hour 	= "0";
	}

/*
** Display a chronometer.
*/

	function timer() {
		var	i 			= 0;

		timeInit();
		call.timerId = setInterval(function() {
			i++;
			$scope.sec 	= i - Math.floor(i / 60) * 60;
			$scope.min 	= Math.floor(i / 60);
			$scope.hour = Math.floor(i / (60 * 60));
			if ($scope.sec == 60)
				$scope.sec = 0;
			if ($scope.min == 60)
				$scope.min = 0;
			if ($scope.sec < 10)
				$scope.sec = '0' + $scope.sec;
			if ($scope.min < 10)
				$scope.min = '0' + $scope.min;
			$scope.$apply();
		}, 1000);
	}

});
