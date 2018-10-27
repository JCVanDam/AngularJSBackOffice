app.controller('callHistoryListCtrl', function($scope, $rootScope, $http) {

/*
** Initialize
*/

	var url										= window.sessionStorage.getItem('api-url');
	$scope.block							= [];
	$scope.csv 								= [];
	$rootScope.displayTopBar 	= true;

/*
** Get all calls done on each button
*/

	$http({
		method: 'post',
		url: url + '/call/history',
		data: {
			api_key			: window.sessionStorage.getItem('snapcall-api_key'),
			api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
		}
	}).success(function(data) {
		for (property in data)
			data[property].show = false;
		$scope.entries = data;
		for (bid in $scope.entries){
			$scope.entries[bid].csv = [];
			for (var i = 0; i < $scope.entries[bid].length; i++){
				var tmp = {};
				tmp.bid = bid;
				tmp.date = $scope.entries[bid][i].call_start;
				tmp.ip = $scope.entries[bid][i].context.default.ip;
				tmp.location = $scope.entries[bid][i].context.default.city;
				tmp.browser = $scope.entries[bid][i].context.default.browser;
				tmp.language = $scope.entries[bid][i].context.default.language;
				tmp.page = $scope.entries[bid][i].context.default.url_title + $scope.entries[bid][i].context.default.url;
				tmp.duree = $scope.entries[bid][i].duration;
				tmp.evaluation = $scope.entries[bid][i].rate;
				$scope.entries[bid].csv.push(tmp);
				$scope.csv.push(tmp);
			}
		}
	});

/*
** Display call history array when click event happend
*/

	$scope.displayData = function(bid_id){
		var i = 0;
		$scope.entries[bid_id].show	= !$scope.entries[bid_id].show;
		$scope.button = $scope.entries[bid_id];
	};

/*
** Hide button name when click event happend
*/

	$scope.hideButton = function(bid_id){
		$scope.block.forEach(function(item){
			if (item.bid_id === bid_id)
				item.show_name = false;
		});
	}
});
