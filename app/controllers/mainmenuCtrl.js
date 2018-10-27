app.controller('mainmenuCtrl', function($scope, $rootScope, $http, $location) {

	$scope.access 						= (window.sessionStorage.getItem('snapcall-api_access') == 1)? true : false;
	$scope.url								= window.sessionStorage.getItem('dir-url');
	$scope.display						= true;
	$scope.hide								= false;
	$rootScope.displayTopBar 	= true;


	$scope.displayMenu	= function(){
		$scope.display		= !$scope.display;
		$scope.hide				= !$scope.hide;
	};
});
