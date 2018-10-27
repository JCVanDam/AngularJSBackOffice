app.controller('dashboardCtrl', function($scope, $rootScope, $http) {

/*
**Set value of begin and end of date
*/
	var url										= window.sessionStorage.getItem('api-url');
	$scope.date_begin					= null;
	$scope.date_end						= null;
	$rootScope.displayTopBar 	= true;

/*
******************** Manage toggle *********************************************
*/

	$scope.block = {
		calendar: false,
		global: false,
		call: true,
		evaluation: false,
		utilisation: false,
	};

	$scope.toggle = function(id){
		for (var key in $scope.block) {
			$scope.block[key] = false;
		}
		$scope.block[id] = true;
	};

/*
** Get global statistics
*/

	$scope.global = function(){
		$http({
			method: 'post',
			url: url + '/stat/calls',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				bid_id			: null,
				start				: $scope.date_begin,
				end					: $scope.date_end
			}
		}).success(function(data){
			$scope.volPerButton(data);
			$scope.volGlob(data);
		});
		$http({
			method: 'post',
			url: url + '/call/last',
			data: {
				api_key		: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
			}
		}).success(function(data){
			$scope.lastCall = data;
		});
		$http({
			method: 'post',
			url: url + '/stat/overall',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				start				: $scope.date_begin,
				end					: $scope.date_end
			}
		}).success(function(data){
			$scope.statForButton(data);
		});
		$http({
			method: 'post',
			url: url + '/stat/ratings',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				start				: $scope.date_begin,
				end					: $scope.date_end
			}
		}).success(function(data){
			$scope.rating(data);
		});
		$http({
			method: 'post',
			url: url + '/stat/ratingsavg',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				start				: $scope.date_begin,
				end					: $scope.date_end
			}
		}).success(function(data){
			$scope.ratingGlob(data);
		});
		$http({
			method: 'post',
			url: url + '/stat/browsers',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
				start				: $scope.date_begin,
				end					: $scope.date_end
			}
		}).success(function(data){
			$scope.browser(data);
		});
	};

/*
** Calls stat by date for a button.
*/

	$scope.statForButton = function(data){
		if (data !== null){
			$scope.sommeNumber 	= data.call_total;
			$scope.sommeTime 		= data.spoken_total;
			$scope.averageTime 	= data.spoken_avg;
			$scope.averageScore = data.rate_avg;
		}
	}

/*
** Calls volume by date by button to compare them.
*/

	function checkLabelExist(needle, haystack){
		for(var i = 0; i < haystack.length; i++){
			if (haystack[i].label == needle){
				return i;
			}
		}
		return -1;
	};

	$scope.volPerButton = function(data){
		if (data !== null){
			var date				= [];
			var indexElem		= [];
			var indexDate		= [];
			var settings		= [];
			var bzero				= [];
			var chartContent = document.getElementById("chartContentVolumeButton");

			data.forEach(function(el){
				if (date.indexOf(el.date) === -1){
					date.push(el.date);
				}
			});
			data.forEach(function(el){
				if ((indexElem = checkLabelExist(el.bid_id, settings)) === -1){
					for (var i = 0; i < date.length; i++){
						bzero.push(0);
					}
					settings.push({
						label : el.bid_id,
						count : bzero
					});
					bzero = [];

					indexDate = date.indexOf(el.date);
					settings[settings.length - 1].count[indexDate] = el.count;
				}else {
					indexDate = date.indexOf(el.date);
					settings[indexElem].count[indexDate] = el.count;
				}
			});
			var datasets = [];

			for(var j = 0; j < settings.length; j++){
				datasets.push({
					label	: settings[j].label,
					data	: settings[j].count,
					fill	: false,
					borderColor: 'rgba(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ', 0.3)',
					borderWidth: "2",
					borderJoinStyle: "round",
					pointBorderWidth: "3",
					pointRadius: "4",
					pointBackgroundColor: "white",
				});
			}
			chartContent.innerHTML = '&nbsp;';
			$('#chartContentVolumeButton').append('<canvas id="graphCallVolumeButtonChartJS" style="height: 40%"></canvas>');
			ctx = $("#graphCallVolumeButtonChartJS").get(0).getContext("2d");
			var myChart = new Chart(ctx, {
				type	: 'line',
				data	: {
					labels		: date,
					datasets	: datasets
				},
				options	: {
					scales: {
						yAxes: [{
						}],
						xAxes: [{ gridLines: { display: false } }]
					},
					legend: { position: 'bottom' },
					animation: false
				}
			});
		}
	}

/*
** Calls volume by date for all button.
*/

	$scope.volGlob = function(data){

		var tmp;
		var date	= [];
		var count	= [];
	//	var chartContent = document.getElementById("chartContentVolumeButton");


		for (var i = 0 ; i < data.length ; i++) {
			if (data[i].date != null){
				tmp = data[i].date.split('-');
				data[i].date = tmp[2] + '/' + tmp[1];
			}
			date.push((data[i].date != null) ? data[i].date : 0);
			count.push(data[i].count);
		}
	//	chartContent.innerHTML = '&nbsp;';
	//	$('#chartContentVolumeButton').append('<canvas id="graphCallVolumeGlobalChartJS" height="100"></canvas>');
		//ctx = $("graphCallVolumeGlobalChartJS").get(0).getContext("2d");
		var ctx = document.getElementById("graphCallVolumeGlobalChartJS");
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
					pointBackgroundColor: 'white'
				}]
			},
			options: {
				legend: { display: false },
				scales: {
					yAxes: [{
						ticks: { beginAtZero:true },
						gridLines: { display: false }
					}],
					xAxes: [{
						gridLines: { display: false }
					}]
				},
				animation: false
			}
		});
	}

/*
** Get the rating for a user.
*/

	$scope.rating = function(data){
		var rate					= [];
		var percent				= [];
		var chartContent 	= document.getElementById('chartContentCallRating');

		if (data !== null){
			for(property in data){
				rate.push(property);
				percent.push(data[property]);
			}
			chartContent.innerHTML = '&nbsp;';
			$('#chartContentCallRating').append('<canvas id="graphCallRatingChartJS" height=""></canvas>')
			ctx = $("#graphCallRatingChartJS").get(0).getContext("2d");
			var myChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: rate,
					datasets: [{
						data: percent,
						fill: true,
						borderColor: 'white',
						backgroundColor: ['#FBCF14', '#D72549', '#00A9CC', '#75C97C', '#F9556C', '#561E46'],
						borderWidth: 3
					}]
				},
				options: {
					legend: {
						display: true,
						position: 'bottom',
						fullWidth: false,
						labels: {
						boxWidth: 15
						}
					},
				animation: false
				}
			});
		}
	};

/*
** Rating by date.
*/

	$scope.ratingGlob = function(data){
		var ctx			= document.getElementById("graphCallSatisfactionGlobalChartJS");
		var rate		= [];
		var date		= [];
		var chartContent = document.getElementById('chartContentSatisfactionGlobal');

		if (data !== null){
			for(property in data){
				date.push(property);
				rate.push(data[property]);
			}
			chartContent.innerHTML = '&nbsp;';
			$('#chartContentSatisfactionGlobal').append('<canvas id="graphCallSatisfactionGlobalChartJS" height="100"></canvas>')
			ctx = $("#graphCallSatisfactionGlobalChartJS").get(0).getContext("2d");
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: date,
					datasets: [{
					data: rate,
					fill: false,
					borderColor: '#00A9CC',
					borderWidth: 2,
					borderJoinStyle: 'round',
					pointBorderWidth: 2,
						pointRadius: 4,
						pointBackgroundColor: 'white'
					}]
				},
				options: {
					legend: { display: false },
					scales: {
						yAxes: [{
							ticks: { beginAtZero:true, fixedStepSize: 1 },
							gridLines: { display: false }
						}],
						xAxes: [{
							gridLines: { display: false }
						}]
					},
					animation: false
				}
			});
		}
	};

/*
** Browser utilisations.
*/

	$scope.browser = function(data){
		if (data !== null){
			var db_percent_navigator = data;
			var g_navigators = Object.keys(db_percent_navigator);
			var g_percents = Object.values(db_percent_navigator);
			var ctx = document.getElementById("graphBrowserUsageChartJS");
			var myChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: (g_navigators !== '') ? g_navigators : 'NC',
					datasets: [{
						data: g_percents,
						fill: true,
						borderColor: 'white',
						backgroundColor: ['#FBCF14', '#D72549', '#00A9CC', '#75C97C', '#F9556C', '#561E46'],
						borderWidth: 3
					}]
				},
				options: {
					legend: {
						display: true,
						position: 'bottom',
						fullWidth: false,
						labels: {
							boxWidth: 15
						}
					},
					animation: false
				}
			});
		}
	};

	$('.start_date').pickadate({
    onSet: function(context) {
				var date = new Date(context.select);
				var month = date.getMonth();
				var day = date.getDate();

				day = (day < 10) ? '0' + day : day;
				month = month + 1;
				month = (month < 9) ? '0' + month : month;

				$scope.date_begin = date.getFullYear() + '-' + month + '-' + day;
			}
  });

	$('.end_date').pickadate({
	    onSet: function(context) {
					var date = new Date(context.select);
					var month = date.getMonth();
					var day = date.getDate();

					day = (day < 10) ? '0' + day : day;
					month = month + 1;
					month = (month < 9) ? '0' + month : month;

					$scope.date_end = date.getFullYear() + '-' + month + '-' + day;
				}
	  });

	$scope.global();
});
