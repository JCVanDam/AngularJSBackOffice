app.controller('settingsCtrl', function($scope, $rootScope, $http, toggleManagement) {
	var url 									= window.sessionStorage.getItem('api-url');
	var toggle 								= [
		'general',
		'pwd'
	];
	$rootScope.displayTopBar 	= true;


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
** Get data about user
*/

	$scope.getBid = function(){
		$http({
			method	: 'POST',
			url		: url + '/user/infos',
			data	: {
				api_key		: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
			}
		}).success(function(data){
			$scope.email = data.user_email;
			$scope.name = data.user_name;
			$scope.company = data.company_name;
			$scope.access = data.user_access;
		});
	}

/*
** Change general data about user.
*/

	$scope.submitGeneralData = function(){
		if ($scope.email !== $scope.initialemail){
			$http({
				method	: 'POST',
				url		: url + '/user/email',
				data	: {
					api_key		: window.sessionStorage.getItem('snapcall-api_key'),
					api_secret	: window.sessionStorage.getItem('snapcall-api_secret'),
					email		: $scope.email
				}
			}).success(function(data){
				$scope.initialemail = $scope.email;
			});
		} else{
		}
	}

/*
** Change password data about user.
*/

	$scope.submitPwdData = function(){
		console.log("PWD DATA =>", $scope.first_pwd, $scope.new_pwd, $scope.confirmation);
		$http({
			method: 'POST',
			url: url + '/user/password',
			data: {
				api_key			: window.sessionStorage.getItem('snapcall-api_key'),
				api_secret		: window.sessionStorage.getItem('snapcall-api_secret'),
				password		: $scope.first_pwd,
				password_new	: $scope.new_pwd,
				password_conf	: $scope.confirmation
			}
		}).success(function(data){
			console.log('SET PWD =>', data);
		});
	};

	$scope.getBid();
});
