app.controller('currentCallCtrl', function($scope, $rootScope, $http) {

/*
** Initialize
*/

	$scope.block 							= [];
	var url 									= window.sessionStorage.getItem('api-url');
	$rootScope.displayTopBar 	= true;

/*
** Get all calls not finished
*/

	$http({
		method: 'post',
		url: url + '/call/ongoing',
		data: {
			api_key			: window.sessionStorage.getItem('snapcall-api_key'),
			api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
		}
	}).success(function(data) {
		for(item in data){
			if (!$scope.block.length || $scope.block[0].bid_id.indexOf(item['bid_id']) == -1){
				var item_id = {
					name			: data[item][0].name,
					bid_id		: data[item][0].bid_id,
					show			: false,
					show_name	: true,
					list			: []
				};
				$scope.block.push(item_id);
			}
			$scope.block.forEach(function(block){
				if (block.bid_id === data[item][0].bid_id){
					block.list.push(data[item][0]);
				}
			});
		}
	});
});
