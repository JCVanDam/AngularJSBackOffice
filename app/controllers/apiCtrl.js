app.controller('apiCtrl', function($scope, $rootScope, $http, toggleManagement) {

/*
** Initialize
*/

	var url 									= window.sessionStorage.getItem('api-url');
	$scope.api_key						= window.sessionStorage.getItem('snapcall-api_key');
	$scope.api_secret					= window.sessionStorage.getItem('snapcall-api_secret');
	$rootScope.displayTopBar 	= true;
	var toggle 								= [
		'identification',
		'authentication',
		'widgets',
		'user',
		'calls',
		'statistics'
	];

/*
** Initialize toggle menu
*/

	$scope.block 						= toggleManagement.save(toggle);
	$scope.selectToggle 		= toggleManagement.saveSelectToggle(toggle);
	$scope.toggle 					= function(id) {
  	$scope.block 					= toggleManagement.getToggle($scope.block, id);
		$scope.selectToggle  	= toggleManagement.getSelectToggle($scope.selectToggle, id);
  };

/*
** Reset the API key and API key secret
*/

	$scope.resetAPI = function(){
		$http({
			method: 'POST',
			url: url + '/user/reset',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
			}
		}).success(function(data){
			$scope.api_key		= data.api_key;
			$scope.api_secret	= data.api_secret;
			window.sessionStorage.setItem('snapcall-api_key', data.api_key);
			window.sessionStorage.setItem('snapcall-api_secret', data.api_secret);
		})
	};
});
