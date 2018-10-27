app.controller('widgetListCtrl', function($scope, $rootScope, $http, $route, $location, utfMode, schedule, storeWidget) {

/*
******************** Initialize ***********************************************
*/

	var url					= window.sessionStorage.getItem('api-url');
	$scope.state		= [];
	$scope.modal 		= {
		addContextFail		: false,
		android						: false,
		ios								: false,
		embed							: false,
		delete						: false
	};
	$scope.tooltip 	= {
		'android'	: [],
		'ios'			: [],
		'html'		: [],
		'page'		: [],
		'delete'	: [],
	};
	$scope.licenceError 			= [];
	$rootScope.displayTopBar 	= true;

/*
******************** Display widget list ***************************************
*/

	$http({
		method: 'POST',
		url: url + '/widget/list',
		data: {
			api_key			: window.sessionStorage.getItem('snapcall-api_key'),
			api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
		}
	}).success(function(data){
		$scope.widgets = data;
		initializeClosedDisplay();
		initializeUtfTranslate();
		manageDisplay();
		//manageWarning();

	});

/*
******************** initializeClosedDisplay ***********************************************
*/

	  var initializeClosedDisplay = function(){
			$scope.widgets.forEach(function(el){
				if (!el.closed){
					$scope.state.push("label label-active");
					el.closed = "open";
				}else {
					$scope.state.push("label label-unactive");
					el.closed = "close";
				}
			});
	  };

/*
******************** initializeUtfTranslate ***********************************************
*/

	  var initializeUtfTranslate = function(){
			$scope.widgets.forEach(function(el){
				el.product = utfMode.decode(el.product);
				el.brand = utfMode.decode(el.brand);
				el.service = utfMode.decode(el.service);
				el.name = utfMode.decode(el.name);
			});
	  };

/*
******************** initializeUtfTranslate ***********************************************
*/

	var manageDisplay = function(){
		$scope.widgets.forEach(function(el){
			if (el.product && el.product != "null")
				el.brand = el.brand + ', ';
			else
				el.product = null;
			if (el.service && el.service != "null")
				el.brand = ', ' + el.brand;
			else
				el.service = null;
		});
	};

/*
******************** initializeUtfTranslate ***********************************************
*/

	var manageWarning = function(){
		$scope.widgets.forEach(function(el){
			if ((!(angular.equals([], el.context.tags)) || !(angular.equals([], el.context.cookies)))
				&& el.opt_context == 0){
				$scope.licenceError.push(true);
			} else {
				$scope.licenceError.push(false);
			}
		});
	};

/*
******************** Display tooltip *******************************************
*/

	$scope.toggleModal = function(id, args) {
		$scope.modal[id] = !$scope.modal[id];
		$scope.modalArgs = args;
	};

	$scope.displayTooltip = function(event, index, mode){
		$scope.tooltip[mode][index] = true;
		$scope.x = event.pageX - $('.sidebar-unfold').width() - 100;
		$scope.y = event.pageY - $('.topbar').height() + 25;
	};

/*
******************** Delete widget *********************************************
*/

	$scope.deleteWidget = function(bid_id) {
		$http({
			method: 'POST',
			url: url + '/widget/delete',
			data: {
				api_key: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret: window.sessionStorage.getItem('snapcall-api_secret'),
				bid_id: bid_id
			}
		}).success(function(data) {
			console.log(bid_id);
			$route.reload();
		});
	};

/*
******************** Modify a widget *******************************************
*/

	$scope.widgetModify = function(widget) {
		if (widget && widget.bid_id){
			$http({
				method: 'POST',
				url: url + '/widget/read',
				data: {
					api_key			: window.sessionStorage.getItem('snapcall-api_key'),
					api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
					bid_id			: widget.bid_id
				}
			}).success(function(data){
				var tabIndex = schedule.getIndexSchedule(data.schedule);
				storeWidget.save(widget.bid_id, tabIndex, data.type);
				$location.url('/widget/modify');
			});
		}
	}

/*
******************** Modify a widget *******************************************
*/

	$scope.goToContext = function() {
		$location.url('/licence');
	}

/*
******************** Create a widget *******************************************
*/

	$scope.widgetCreate = function(widget) {
		$location.url('/widget/create');
	}

/*
******************** Create a widget *******************************************


	$scope.contextSelected = function(name, bid) {
		var data = true;
		var checkAddCtxPossible = false;

		$scope.contextOption 	= !$scope.contextOption;
		$scope.modalArgs 			= name;
		if ($scope.contextOption){
			if (checkAddCtxPossible){
				$scope.modal['addContextSucess'] = true;
			} else{
				$scope.modal['addContextFail'] = true;
			//	$scope.contextOption 	= !$scope.contextOption;
			}
		} else{
			$scope.modal['takeOffContext'] = true;
		}
	}
*/
/*
******************** Image *****************************************************
*/

$scope.image = 'data:image/svg+xml;base64, CgkJCTxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCQkJICAgICB2aWV3Qm94PSIwIDAgNTAgNTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwIDUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgkJCTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CgkJCSAgICAuc3Qwe2ZpbGw6IzAwQTlDRDt9CgkJCSAgICAuc3Qxe2ZpbGw6I0ZGRkZGRjt9CgoJCQkgICAgIEAtd2Via2l0LWtleWZyYW1lcyBhbmltX3pvb20gewoJCQkgICAgICAgIDAlIHstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKX0KCQkJICAgICAgICA1MCUgey13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpfQoJCQkgICAgICAgIDc1JSB7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKDIwcHgsIDE5cHgpIHNjYWxlKDApfQoJCQkgICAgICAgIDEwMCUgey13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwcHgsIDBweCkgc2NhbGUoMSl9CgkJCSAgICAgIH0KCQkJICAgICAgLmdyb3cgey13ZWJraXQtYW5pbWF0aW9uOiBhbmltX3pvb20gNXMgZWFzZS1vdXQgaW5maW5pdGU7fQoJCQk8L3N0eWxlPgoJCQk8ZyBpZD0icm9uZCI+CgkJCSAgICA8Y2lyY2xlIGlkPSJYTUxJRF80XyIgY2xhc3M9InN0MCIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1Ii8+CgkJCTwvZz4KCQkJPGcgaWQ9ImNyb2l4Ij4KCQkJICAgIDxwYXRoIGlkPSJYTUxJRF82XyIgY2xhc3M9InN0MSBncm93IiBkPSJNMzkuNCwyNUwzOS40LDI1YzAsMi4yLTEuOCw0LTQsNEgxNC42Yy0yLjIsMC00LTEuOC00LTR2MGMwLTIuMiwxLjgtNCw0LTRoMjAuOQoJCQkgICAgICAgIEMzNy42LDIxLDM5LjQsMjIuOCwzOS40LDI1eiIvPgoJCQkgICAgPHBhdGggaWQ9IlhNTElEXzVfIiBjbGFzcz0ic3QxIGdyb3ciIGQ9Ik0yNSwzOS40TDI1LDM5LjRjLTIuMiwwLTQtMS44LTQtNFYxNC42YzAtMi4yLDEuOC00LDQtNGgwYzIuMiwwLDQsMS44LDQsNHYyMC45CgkJCSAgICAgICAgQzI5LDM3LjYsMjcuMiwzOS40LDI1LDM5LjR6Ii8+CgkJCTwvZz4KCQkJPC9zdmc+CgkJ';

/*
******************** Graphic **************************************************
*/
/*
	$scope.drawGraph = function(bid_id, index) {
		var d = new Date();
		var date_end = d.toISOString().substr(0, 10);
		var tmp = d.getDate() - 5;
		var day = (tmp <= 0) ? 30 + tmp : tmp;
		var month = (tmp <= 0) ? d.getMonth() : d.getMonth() + 1;
			month = (month == 0) ? 12 : (month < 10 ) ? "0" + month : month;
		var year = (tmp <= 0) ? d.getFullYear() - 1 : d.getFullYear();
		var date_begin = year + "-" + month + "-" + day;

		$http({
			method: 'POST',
			url: url + '/stat/calls',
			data: {
				api_key		: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				bid_id		: bid_id,
				start		: date_begin,
				end			: date_end
			}
		}).success(function(data){
			console.log(data);

			var tmp;
			var date	= [];
			var count	= [];


			for (var i = 0 ; i < data.length ; i++) {
				if (data[i].date != null){
					tmp = data[i].date.split('-');
					data[i].date = tmp[2] + '/' + tmp[1];
				}
				date.push((data[i].date != null) ? data[i].date : 0);
				count.push(data[i].count);
			}


			var ctx = document.getElementById("widget-" + index);
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: date,
					datasets: [{
						data: count,
						fill: false,
						borderColor: '#00A9CC',
						borderWidth: 2,
						borderJoinStyle: 'round',
						pointBorderWidth: 2,
						pointRadius: 4,
						pointBackgroundColor: 'white',
						scaleShowLabels: false
					}]
				},
				options: {
					legend: { display: false },
					scales: {
						yAxes: [{
							ticks: { display:false },
							gridLines: { drawBorder: false, display: false},
						}],
						xAxes: [{
							ticks: { display:false },
							gridLines: { drawBorder: false, display: false },
						}],
					},
					animation: false
				}
			});
		});
	};*/

});
