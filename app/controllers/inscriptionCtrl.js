app.controller('inscriptionCtrl', function($scope, $rootScope, $http, $location) {
	var url = window.sessionStorage.getItem('api-url');
	$rootScope.displayTopBar 	= false;

	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	};

	$scope.submit = function(){
		var i = 0;
		$scope.emailError = false;
		$scope.pwdError = false;
		$scope.confirmationError = false;
		if ($scope.password !== $scope.passwordConfirmation && ++i)
			$scope.confirmationError = true;
		if ($scope.password.length < 8 && ++i)
			$scope.pwdError = true;
		$scope.emailError = !validateEmail($scope.email);
		if (!i && !$scope.emailError){
			$http({
				method: 'post',
				url: url + '/user/create',
				data: {
					email					: $scope.email,
					password			: $scope.password,
					name					: $scope.name,
					company_name	: $scope.company,
					access				: "admin",
					app_token			: null,
					active				: 0
				}
			}).success(function(data) {
				console.log(data);
				if (data === "true"){
					$location.url('/user/logout');
				}
			});
		}
	}
});
