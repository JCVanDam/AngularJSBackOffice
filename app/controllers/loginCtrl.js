app.controller('loginCtrl', function($scope, $rootScope, $http, $location) {
	window.sessionStorage.setItem('api-url', "https://apisandbox.snapcall.io");
	var url = window.sessionStorage.getItem('api-url');
	$rootScope.displayTopBar 	= false;

	$scope.submit = function() {
		$scope.loginError = false;
		$http({
			method	: 'POST',
			url			: url + '/user/login',
			data		: {
				email			: $scope.email,
				password	: $scope.password
			}
		}).success(function(data) {
			if (data !== 'false') {
				window.sessionStorage.setItem('snapcall-logkey', data.user_id);
				window.sessionStorage.setItem('snapcall-api_key', data.api_key);
				window.sessionStorage.setItem('snapcall-api_secret', data.api_secret);
				window.sessionStorage.setItem('snapcall-api_access', data.user_api_access);

/*
** Get informations about current user.
*/

				$http({
					method	: 'POST',
					url			: url + '/user/infos',
					data		: {
						api_key			: window.sessionStorage.getItem('snapcall-api_key'),
						api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
					}
				}).success(function(data){
					window.sessionStorage.setItem('snapcall-user_name', data.user_name);
					window.sessionStorage.setItem('snapcall-company_name', data.company_name);
					$rootScope.name 		= data.user_name;
					$rootScope.company 	= data.company_name;
				});
				$location.url('/widget/list');
			} else {
				$scope.loginError = true;
			}
		});
	};
});
