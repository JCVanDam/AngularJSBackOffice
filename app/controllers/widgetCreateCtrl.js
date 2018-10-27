app.controller('widgetCreateCtrl', function($scope, $http, $location, $timeout, utfMode, schedule, contextFactory) {

/*
******************** Initialize scope ******************************************
*/

	var url												= window.sessionStorage.getItem('api-url');
	$scope.tags										= [];
	$scope.cookies								= [];
	$scope.specificSchedule 			= true;
	$scope.generalSchedule 				= false;
	$scope.checkColor							= "white";
	$scope.menuSentence						= "CREER UN BOUTON";
	$scope.name										= null;
	$scope.brand									= null;
	$scope.call_id								= null;
	$scope.type										= null;
	$scope.service								= null;
	$scope.product								= null;
	$scope.msg_widget_invite			= null;
	$scope.msg_widget_ongoing			= null;
	$scope.msg_widget_rate				= null;
	$scope.msg_widget_closed			= null;
	$scope.msg_hosted_title				= null;
	$scope.msg_hosted_invite			= null;
	$scope.colorFg								= "#FFFFFF";
	$scope.colorBg								= "#000000";
	$scope.size										= "60";
	$scope.display_accessibility	= "1";
	$scope.display_navigator			= "1";
	$scope.display_os							= "1";
	$scope.display_schedule				= "1";
	$scope.display_secure					= "1";
	$scope.caller_id							= '';
	$scope.schedule								= {
		"Monday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Tuesday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Wednesday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Thursday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Friday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Saturday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		},
		"Sunday": {
			"morning" : ["00:00", "12:00"],
			"afternoon" : ["12:10", "23:50"]
		}
	};
	$scope.scheduleModel	= schedule.makeScheduleModel();
	$scope.indexSchedule		= [
		0,72,73,143,
		0,72,73,143,
		0,72,73,143,
		0,72,73,143,
		0,72,73,143,
		0,72,73,143,
		0,72,73,143,
		0,72,73,143
	];

/*
** Context
*/

	$scope.tags= [
		{
			name		: null,
			id			: null,
			display	: true
		}
	];
	$scope.cookies= [
		{
			name		: null,
			id			: null,
			display	: true
		}
	];
	$scope.context = {
    tags: [],
    cookies: []
	};

	$scope.$emit('contextSun', $scope.context);
	$scope.$emit('tagsSun', $scope.tags);
	$scope.$emit('cookiesSun', $scope.cookies);
	$scope.$on('contextParent', function(event, context) {
    $scope.context = context;
  });
  $scope.$on('tagsParent', function(event, tags) {
    $scope.tags = tags;
  });
  $scope.$on('cookiesParent', function(event, cookies) {
    $scope.cookies = cookies;
  });

/*
******************** Object sended *********************************************
*/

	$scope.submit = function() {
		var day 		= schedule.translateSchedule($scope.schedule);

		console.log("$scope.htmlInvit", utfMode.encode($scope.htmlInvit));
		console.log("$scope.htmlClosed", utfMode.encode($scope.htmlClosed));
		console.log("$scope.htmlRate", utfMode.encode($scope.htmlRate));
		$scope.validate = "ux-input ux-input-input ux-input-big mhover validate";
		var formdata 		= new FormData();
		formdata.append('api_key', window.sessionStorage.getItem('snapcall-api_key'));
		formdata.append('api_secret', window.sessionStorage.getItem('snapcall-api_secret'));
		formdata.append('call_id', $scope.call_id);
		formdata.append('caller_id', $scope.caller_id);
		formdata.append('context_cookies', $scope.context["cookies"]);
		formdata.append('context_tags', $scope.context["tags"]);
		formdata.append('routing', "pstn");
		formdata.append('name', utfMode.encode($scope.name));
		formdata.append('service', utfMode.encode($scope.service));
		formdata.append('brand', utfMode.encode($scope.brand));
		formdata.append('product', utfMode.encode($scope.product));
		formdata.append('type', $scope.type.send);
		formdata.append('schedule_monday', day[0]);
		formdata.append('schedule_tuesday', day[1]);
		formdata.append('schedule_wednesday', day[2]);
		formdata.append('schedule_thursday', day[3]);
		formdata.append('schedule_friday', day[4]);
		formdata.append('schedule_saturday', day[5]);
		formdata.append('schedule_sunday', day[6]);
		formdata.append('widget_color_bg', $scope.colorBg);
		formdata.append('widget_color_fg', $scope.colorFg);
		formdata.append('widget_size', $scope.size);
		formdata.append('msg_widget_invite', utfMode.encode($scope.htmlInvit));
		formdata.append('msg_widget_closed', utfMode.encode($scope.htmlClosed));
		formdata.append('msg_widget_rate', utfMode.encode($scope.htmlRate));
		formdata.append('opt_closed', $scope.display_schedule);
		formdata.append('opt_browser', $scope.display_navigator);
		formdata.append('opt_os', $scope.display_os);
		formdata.append('opt_secure', $scope.display_secure);
		formdata.append('opt_accessibility', $scope.display_accessibility);
		formdata.append('bg_hosted_base64', $scope.content);
		$http({
			method: 'POST',
			url: url + '/widget/create',
	    data: formdata,
	    cache: false,
	    dataType: 'json',
	    processData: false,
	    contentType: false,
			headers: {'Content-Type': undefined }
		}).success(function(data){
			$location.url('/widget/list');
		})
	};

/*
******************** Schedules *************************************************
*/

/*
** Get in input specific schedules for each days.
*/

	$scope.getSchedule = function(day, timeRange, state, select){
		schedule.setSchedule($scope.schedule, day, timeRange, state, select);
	};

/*
** Get in the input all the same schedules for all days.
*/

	$scope.getGeneralSchedule = function(timeRange, state, select){
		var i = (state == "open") ? 0 : 1;

		$scope.scheduleTmp["Monday"][timeRange][i]			= select;
		$scope.scheduleTmp["Tuesday"][timeRange][i]			= select;
		$scope.scheduleTmp["Wednesday"][timeRange][i]		= select;
		$scope.scheduleTmp["Thursday"][timeRange][i]		= select;
		$scope.scheduleTmp["Friday"][timeRange][i]			= select;
		$scope.scheduleTmp["Saturday"][timeRange][i]		= select;
		$scope.scheduleTmp["Sunday"][timeRange][i]			= select;
	};

	$scope.popUpSchedule = function(){
		var scheduleModel = schedule.makeScheduleModel();

		$scope.generalSchedule 		= true;
		$scope.GenOpenMorning 		= scheduleModel[0];
		$scope.GenCloseMorning 		= scheduleModel[72];
		$scope.GenOpenAfternoon 	= scheduleModel[73];
		$scope.GenCloseAfternoon 	= scheduleModel[143];
		$scope.scheduleTmp 				= {
			"Monday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Tuesday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Wednesday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Thursday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Friday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Saturday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			},
			"Sunday": {
				"morning" : ["00:00", "12:00"],
				"afternoon" : ["12:10", "23:50"]
			}
		};
	};

/*
** Create an index tab.
*/

	$scope.submitSchedule = function(){
			$scope.specificSchedule 	= true;
			$scope.generalSchedule 		= false;
			$scope.indexSchedule 			= schedule.templateApply($scope.schedule, $scope.scheduleTmp, $scope.selectLst, $scope.dayLst);

			$scope.speOpenMorning0 		= $scope.scheduleModel[$scope.indexSchedule[0]];
			$scope.speCloseMorning0 	= $scope.scheduleModel[$scope.indexSchedule[1]];
			$scope.speOpenAfternoon0 	= $scope.scheduleModel[$scope.indexSchedule[2]];
			$scope.speCloseAfternoon0 = $scope.scheduleModel[$scope.indexSchedule[3]];
			$scope.speOpenMorning1 		= $scope.scheduleModel[$scope.indexSchedule[4]];
			$scope.speCloseMorning1 	= $scope.scheduleModel[$scope.indexSchedule[5]];
			$scope.speOpenAfternoon1 	= $scope.scheduleModel[$scope.indexSchedule[6]];
			$scope.speCloseAfternoon1 = $scope.scheduleModel[$scope.indexSchedule[7]];
			$scope.speOpenMorning2 		= $scope.scheduleModel[$scope.indexSchedule[8]];
			$scope.speCloseMorning2 	= $scope.scheduleModel[$scope.indexSchedule[9]];
			$scope.speOpenAfternoon2 	= $scope.scheduleModel[$scope.indexSchedule[10]];
			$scope.speCloseAfternoon2 = $scope.scheduleModel[$scope.indexSchedule[11]];
			$scope.speOpenMorning3 		= $scope.scheduleModel[$scope.indexSchedule[12]];
			$scope.speCloseMorning3 	= $scope.scheduleModel[$scope.indexSchedule[13]];
			$scope.speOpenAfternoon3 	= $scope.scheduleModel[$scope.indexSchedule[14]];
			$scope.speCloseAfternoon3 = $scope.scheduleModel[$scope.indexSchedule[15]];
			$scope.speOpenMorning4 		= $scope.scheduleModel[$scope.indexSchedule[16]];
			$scope.speCloseMorning4 	= $scope.scheduleModel[$scope.indexSchedule[17]];
			$scope.speOpenAfternoon4 	= $scope.scheduleModel[$scope.indexSchedule[18]];
			$scope.speCloseAfternoon4 = $scope.scheduleModel[$scope.indexSchedule[19]];
			$scope.speOpenMorning5 		= $scope.scheduleModel[$scope.indexSchedule[20]];
			$scope.speCloseMorning5 	= $scope.scheduleModel[$scope.indexSchedule[21]];
			$scope.speOpenAfternoon5 	= $scope.scheduleModel[$scope.indexSchedule[22]];
			$scope.speCloseAfternoon5 = $scope.scheduleModel[$scope.indexSchedule[23]];
			$scope.speOpenMorning6 		= $scope.scheduleModel[$scope.indexSchedule[24]];
			$scope.speCloseMorning6 	= $scope.scheduleModel[$scope.indexSchedule[25]];
			$scope.speOpenAfternoon6 	= $scope.scheduleModel[$scope.indexSchedule[26]];
			$scope.speCloseAfternoon6 = $scope.scheduleModel[$scope.indexSchedule[27]];
	};



/*
******************** Other *****************************************************
*/

/*
** Load a background image
*/

	$scope.fileReaderSupported = window.FileReader != null;
	$scope.uploadPhoto = function(files) {
    $scope.content = files[0];
		if ($scope.fileReaderSupported && $scope.content.type.indexOf('image') > -1) {
			$timeout(function() {
		  	var fileReader = new FileReader();
		  	fileReader.readAsDataURL($scope.content);
				fileReader.onload = function(e) {
					$timeout(function(){
						$scope.dataUrl = e.target.result;
					});
				}
			});
		}
	};
});
