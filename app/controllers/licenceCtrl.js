app.controller('licenceCtrl', function($scope, $rootScope, $http, toggleManagement){

/*
******************** Initialize ***********************************************
*/
  var url					= window.sessionStorage.getItem('api-url');
  var toggle 			= [
		'context',
    'video',
    'subscription',
    'submitLicence'
	];
  $scope.modal 		= {
    addContextSucess	    : false,
    addContextFail        : false,
    addContextRemove      : false,
    licenceNotSufficient  : false
  };
  $scope.submitLicence      = false;
  $rootScope.displayTopBar 	= true;


/*
******************** Display tooltip *******************************************
*/

  $scope.block 						= toggleManagement.save(toggle);
	$scope.selectToggle 		= toggleManagement.saveSelectToggle(toggle);
	$scope.toggle 					= function(id) {
  	$scope.block 					= toggleManagement.getToggle($scope.block, id);
		$scope.selectToggle  	= toggleManagement.getSelectToggle($scope.selectToggle, id);
  };

  $scope.toggleModal = function(id, args) {
    if($scope.residualLicence || (!$scope.residualLicence && $scope.checkTab[id] == true)){
      if($scope.checkTab[id] == false )
        $scope.checkTab[id] = true;
      else
        $scope.checkTab[id] = false;
      $scope.residualLicence = ($scope.checkTab[id]) ? $scope.residualLicence - 1 : $scope.residualLicence + 1;
      var item = ($scope.checkTab[id]) ? "addContextSucess" : "removeContext";
      if (item == "addContextSucess")
        addContext(args);
      else
        removeContext(args);
    	$scope.modal[item] = !$scope.modal[item];
    	$scope.modalArgs = args;
    }else {
      $scope.modal["licenceNotSufficient"] = !$scope.modal["licenceNotSufficient"];
    }
  };

  $scope.displaySubscription = function(){
    $scope.toggle('subscription');
    $scope.modal.licenceNotSufficient =! $scope.modal.licenceNotSufficient;
  };

  $scope.subscription = function(name){
    $scope.modal.submitLicence  = !$scope.modal.submitLicence;
    $scope.licenceName          = name;
  };

/*
******************** Get call_id list ******************************************
*/

  $http({
    method: 'POST',
    url: url + '/licence/context/list',
    data: {
      api_key			: window.sessionStorage.getItem('snapcall-api_key'),
      api_secret	: window.sessionStorage.getItem('snapcall-api_secret')
    }
  }).success(function(data){
    $scope.widgets = data;
    initializeCheckTab();
  });

/*
******************** Add context ***********************************************
*/

  var initializeCheckTab = function(){
    $scope.checkTab = [];
    for (item in $scope.widgets){
      if ($scope.widgets[item].opt_context == '1')
        $scope.checkTab.push(true);
      else
        $scope.checkTab.push(false);
    }
  };

/*
******************** Add context ***********************************************
*/

  var addContext = function(call_id){
    $http({
      method: 'POST',
      url: url + '/widget/optcontext',
      data: {
        api_key			    : window.sessionStorage.getItem('snapcall-api_key'),
        api_secret	    : window.sessionStorage.getItem('snapcall-api_secret'),
        call_id	        : call_id,
        active          : 1
      }
    }).success(function(data){
    });
  };

/*
******************** Add context ***********************************************
*/

  var removeContext = function(call_id){
    $http({
      method: 'POST',
      url: url + '/widget/optcontext',
      data: {
        api_key			    : window.sessionStorage.getItem('snapcall-api_key'),
        api_secret	    : window.sessionStorage.getItem('snapcall-api_secret'),
        call_id	        : call_id,
        active          : 0
      }
    }).success(function(data){
    });
  };

/*
******************** Get a licence *********************************************
*/

  $scope.getLicence = function(number){
    $http({
      method: 'POST',
      url: url + '/licence/context/upgrade',
      data: {
        api_key			    : window.sessionStorage.getItem('snapcall-api_key'),
        api_secret	    : window.sessionStorage.getItem('snapcall-api_secret'),
        licence_context	: number
      }
    }).success(function(data){
      $scope.modal.submitLicence =! $scope.modal.submitLicence;
      $scope.countContext();
    });
  };

/*
******************** Get a licence *********************************************
*/

  $scope.countContext = function(){
    $http({
      method: 'POST',
      url: url + '/licence/context/count',
      data: {
        api_key			    : window.sessionStorage.getItem('snapcall-api_key'),
        api_secret	    : window.sessionStorage.getItem('snapcall-api_secret')
      }
    }).success(function(data){
      $scope.totalLicence     = data.total;
      $scope.residualLicence  = data.total - data.active;
    });
  };

  $scope.countContext();

});
