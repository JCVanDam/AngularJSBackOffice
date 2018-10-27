app.controller('widgetModifyCtrl', function($scope, $http, $timeout, utfMode, schedule, contextFactory, storeWidget) {

/*
******************** Initialize scope ******************************************
*/

/*
** Get button's properties
*/

	var url	= window.sessionStorage.getItem('api-url');
	$http({
		method: 'post',
		url: url + '/widget/read',
		data: {
			api_key			: window.sessionStorage.getItem('snapcall-api_key'),
			api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
			bid_id			: storeWidget.getBidId()
		}
	}).success(function(data) {
		if (data.service == "null")
			data.service = null;
		if (data.product == "null")
			data.product = null;
		$scope.dataUrl 								= data.bg_hosted_base64;
		$scope.content								= null;
		$scope.menuSentence						= "MODIFIER UN BOUTON";
		$scope.name										= utfMode.decode(data.name);
		$scope.brand									= utfMode.decode(data.brand);
		$scope.call_id								= data.call_id;
		$scope.caller_id							= data.caller_id;
		$scope.service								= utfMode.decode(data.service);
		$scope.product								= utfMode.decode(data.product);
		$scope.htmlInvit							= (data.msg_widget_invite === "undefined") ? null : utfMode.decode(data.msg_widget_invite);
		$scope.htmlRate								= (data.msg_widget_rate === "undefined") ? null : utfMode.decode(data.msg_widget_rate);
		$scope.htmlClosed							= (data.msg_widget_closed === "undefined") ? null : utfMode.decode(data.msg_widget_closed);
		$scope.schedule								= data.schedule;
		$scope.colorFg								= data.widget_color_fg;
		$scope.colorBg								= data.widget_color_bg;
		$scope.size										= data.widget_size;
		$scope.display_accessibility	= data.opt_accessibility;
		$scope.display_navigator			= data.opt_browser;
		$scope.display_schedule				= data.opt_closed;
		$scope.display_os							= data.opt_os;
		$scope.display_secure					= data.opt_secure;
		$scope.context 								= data.context;
		$scope.tags										=	[];
		$scope.cookies								=	[];
		$scope.requestDone 						= true;
		initializeContext();
		$scope.selectLst = schedule.initializeSelect($scope.schedule, $scope.selectLst);
		initializeSchedule();
		$scope.changeColor();
	});
	$scope.indexType 				= storeWidget.getwidgetType();
	$scope.specificSchedule = true;
	$scope.generalSchedule 	= false;
	$scope.scheduleModel 		= schedule.makeScheduleModel();
	$scope.validate					= "ux-input ux-input-input ux-input-big mhover validate";
	$scope.button						= "button-validate";
	$scope.checkColor				= "black";

/*
******************** Object sended ********************************************
*/

	$scope.submit = function() {
		var day 			= schedule.translateSchedule($scope.schedule);
		var formdata 	= new FormData();

		formdata.append('api_key', window.sessionStorage.getItem('snapcall-api_key'));
		formdata.append('api_secret', window.sessionStorage.getItem('snapcall-api_secret'));
		formdata.append('bid_id', window.sessionStorage.getItem('bid'));
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
		if ($scope.content){
			formdata.append('bg_hosted_base64', $scope.content);
		}
		$http({
			method: 'POST',
			url: url + '/widget/update',
			data: formdata,
		 	cache: false,
		 	dataType: 'json',
		 	processData: false,
		 	contentType: false,
		 	headers: {'Content-Type': undefined }
		}).success(function(data){
			$scope.validateSave = true;
			var timer = function() {
				if( $scope.time < 5000 ) {
					$scope.validateSave = true;
					$scope.time += 1000;
					$timeout(timer, 1000);
				}
				else
					$scope.validateSave = false;
			}
			$timeout(timer, 2500);
		});
	};

/*
******************** Schedules *************************************************
*/

/*
** Get in the input all the specific schedules for each days.
*/

	$scope.getSchedule = function(day, timeRange, state, select){
		schedule.setSchedule($scope.schedule, day, timeRange, state, select);
	};

/*
** Get in the input all the same schedules for all days.
*/

	$scope.getGeneralSchedule = function(timeRange, state, select){
		var i = (state == "open") ? 0 : 1;

		$scope.scheduleTmp["Monday"][timeRange][i]		= select;
		$scope.scheduleTmp["Tuesday"][timeRange][i]		= select;
		$scope.scheduleTmp["Wednesday"][timeRange][i]	= select;
		$scope.scheduleTmp["Thursday"][timeRange][i]	= select;
		$scope.scheduleTmp["Friday"][timeRange][i]		= select;
		$scope.scheduleTmp["Saturday"][timeRange][i]	= select;
		$scope.scheduleTmp["Sunday"][timeRange][i]		= select;
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

	var initializeSchedule = function(){
		var indexSchedule = schedule.getIndexSchedule($scope.schedule, $scope.dayLst);
		var scheduleModel = schedule.makeScheduleModel();

		$scope.speOpenMorning0 		= scheduleModel[indexSchedule[0]];
		$scope.speCloseMorning0 	= scheduleModel[indexSchedule[1]];
		$scope.speOpenAfternoon0 	= scheduleModel[indexSchedule[2]];
		$scope.speCloseAfternoon0 = scheduleModel[indexSchedule[3]];
		$scope.speOpenMorning1 		= scheduleModel[indexSchedule[4]];
		$scope.speCloseMorning1 	= scheduleModel[indexSchedule[5]];
		$scope.speOpenAfternoon1 	= scheduleModel[indexSchedule[6]];
		$scope.speCloseAfternoon1 = scheduleModel[indexSchedule[7]];
		$scope.speOpenMorning2 		= scheduleModel[indexSchedule[8]];
		$scope.speCloseMorning2 	= scheduleModel[indexSchedule[9]];
		$scope.speOpenAfternoon2 	= scheduleModel[indexSchedule[10]];
		$scope.speCloseAfternoon2 = scheduleModel[indexSchedule[11]];
		$scope.speOpenMorning3 		= scheduleModel[indexSchedule[12]];
		$scope.speCloseMorning3 	= scheduleModel[indexSchedule[13]];
		$scope.speOpenAfternoon3 	= scheduleModel[indexSchedule[14]];
		$scope.speCloseAfternoon3 = scheduleModel[indexSchedule[15]];
		$scope.speOpenMorning4 		= scheduleModel[indexSchedule[16]];
		$scope.speCloseMorning4 	= scheduleModel[indexSchedule[17]];
		$scope.speOpenAfternoon4 	= scheduleModel[indexSchedule[18]];
		$scope.speCloseAfternoon4 = scheduleModel[indexSchedule[19]];
		$scope.speOpenMorning5 		= scheduleModel[indexSchedule[20]];
		$scope.speCloseMorning5 	= scheduleModel[indexSchedule[21]];
		$scope.speOpenAfternoon5 	= scheduleModel[indexSchedule[22]];
		$scope.speCloseAfternoon5 = scheduleModel[indexSchedule[23]];
		$scope.speOpenMorning6 		= scheduleModel[indexSchedule[24]];
		$scope.speCloseMorning6 	= scheduleModel[indexSchedule[25]];
		$scope.speOpenAfternoon6 	= scheduleModel[indexSchedule[26]];
		$scope.speCloseAfternoon6 = scheduleModel[indexSchedule[27]];
};

	$scope.submitSchedule = function(){
			var indexSchedule 			= schedule.templateApply($scope.schedule, $scope.scheduleTmp, $scope.selectLst, $scope.dayLst);
			var scheduleModel 			= schedule.makeScheduleModel();

			$scope.specificSchedule 	= true;
			$scope.generalSchedule 		= false;
			$scope.speOpenMorning0 		= scheduleModel[indexSchedule[0]];
			$scope.speCloseMorning0 	= scheduleModel[indexSchedule[1]];
			$scope.speOpenAfternoon0 	= scheduleModel[indexSchedule[2]];
			$scope.speCloseAfternoon0 = scheduleModel[indexSchedule[3]];
			$scope.speOpenMorning1 		= scheduleModel[indexSchedule[4]];
			$scope.speCloseMorning1 	= scheduleModel[indexSchedule[5]];
			$scope.speOpenAfternoon1 	= scheduleModel[indexSchedule[6]];
			$scope.speCloseAfternoon1 = scheduleModel[indexSchedule[7]];
			$scope.speOpenMorning2 		= scheduleModel[indexSchedule[8]];
			$scope.speCloseMorning2 	= scheduleModel[indexSchedule[9]];
			$scope.speOpenAfternoon2 	= scheduleModel[indexSchedule[10]];
			$scope.speCloseAfternoon2 = scheduleModel[indexSchedule[11]];
			$scope.speOpenMorning3 		= scheduleModel[indexSchedule[12]];
			$scope.speCloseMorning3 	= scheduleModel[indexSchedule[13]];
			$scope.speOpenAfternoon3 	= scheduleModel[indexSchedule[14]];
			$scope.speCloseAfternoon3 = scheduleModel[indexSchedule[15]];
			$scope.speOpenMorning4 		= scheduleModel[indexSchedule[16]];
			$scope.speCloseMorning4 	= scheduleModel[indexSchedule[17]];
			$scope.speOpenAfternoon4 	= scheduleModel[indexSchedule[18]];
			$scope.speCloseAfternoon4 = scheduleModel[indexSchedule[19]];
			$scope.speOpenMorning5 		= scheduleModel[indexSchedule[20]];
			$scope.speCloseMorning5 	= scheduleModel[indexSchedule[21]];
			$scope.speOpenAfternoon5 	= scheduleModel[indexSchedule[22]];
			$scope.speCloseAfternoon5 = scheduleModel[indexSchedule[23]];
			$scope.speOpenMorning6 		= scheduleModel[indexSchedule[24]];
			$scope.speCloseMorning6 	= scheduleModel[indexSchedule[25]];
			$scope.speOpenAfternoon6 	= scheduleModel[indexSchedule[26]];
			$scope.speCloseAfternoon6 = scheduleModel[indexSchedule[27]];
	};

/*
******************** Context ***************************************************
*/

	var initializeContext = function(){
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
		$scope.context.tags 		= contextFactory.getContextValues($scope.context, $scope.tags, 'tags');
		$scope.context.cookies 	= contextFactory.getContextValues($scope.context, $scope.cookies, 'cookies');
	};

/*
******************** Change widget color ***************************************
*/

	$scope.changeColor = function(){
		var svg = '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve" ><style type="text/css">.st0{fill:' + $scope.colorFg + ';}.st1{fill:' + $scope.colorBg + ';}@-webkit-keyframes anim_zoom { 0% {-webkit-transform:scale(1)} 50% {-webkit-transform:scale(1)} 75% {-webkit-transform:translate(-1234px, 795px) scale(0)} 100% {-webkit-transform:translate(0px, 0px) scale(1)} }@-moz-keyframes anim_zoom { 0% {-moz-transform:scale(1)} 50% {-moz-transform:scale(1)} 75% {-moz-transform:translate(-1234px, 795px) scale(0)} 100% {-moz-transform:translate(0px, 0px) scale(1)} }@keyframes anim_zoom { 0% {transform:scale(1)} 50% {transform:scale(1)} 75% {transform:translate(-1234px, 795px) scale(0)} 100% {transform:translate(0px, 0px) scale(1)} }.grow { -webkit-animation: anim_zoom 5s ease-out infinite; -moz-animation: anim_zoom 5s ease-out infinite; animation: anim_zoom 5s ease-out infinite; }</style><title>Asset 1</title><g id="Layer_2" transform="translate(0,10)"><path id="forme" class="st1" d="M-1211.7,781l-10.1,3.8c-0.4,0.1-0.8-0.1-0.9-0.4c0-0.1,0-0.3,0-0.4l3.7-10.2c-9.6-5.5-21.8-2.3-27.3,7.3c-5.5,9.6-2.3,21.8,7.3,27.3c9.6,5.5,21.8,2.3,27.3-7.3C-1208.1,794.8-1208.1,787.2-1211.7,781z"/><g><path id="telB" class="st0 grow" d="M-1236.9,783.4c-0.4,0.7-0.7,1.5-0.7,2.4c0.5,3.5,2.1,6.6,4.7,9c2.4,2.6,5.5,4.3,9,4.7c0.8,0,1.7-0.2,2.4-0.7c0.7-0.3,1.2-0.8,1.6-1.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.2-0.4-0.4-1-0.7l-0.7-0.4l-0.8-0.4l-0.7-0.4l-0.3-0.2c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0-0.5,0.2-0.6,0.4c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.7,0.8c-0.1,0.2-0.4,0.3-0.6,0.4c-0.1,0-0.2,0-0.3-0.1l-0.3-0.1l-0.3-0.1l-0.2-0.2c-1.1-0.6-2.1-1.4-3-2.2c-0.9-0.9-1.6-1.9-2.2-3l-0.1-0.2l-0.2-0.4c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.2,0.2-0.4,0.4-0.6c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.2-0.2,0.3-0.4,0.4-0.6c0-0.1,0-0.3-0.1-0.4c-0.1-0.2-0.2-0.3-0.3-0.5l-0.2-0.3l-0.5-0.7c-0.1-0.2-0.3-0.5-0.4-0.8l-0.4-0.7c-0.3-0.6-0.5-0.9-0.7-1c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0.1-0.9,0.1c-0.3,0.1-0.6,0.2-0.9,0.3C-1236.1,782.2-1236.6,782.7-1236.9,783.4z"/></g></g></svg>';

		$scope.dataUrlWidget = 'data:image/svg+xml;base64, ' + window.btoa(svg);
	}

/*
******************** Other *****************************************************
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
