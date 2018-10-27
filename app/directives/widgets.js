/*
** Change submit button color when three input(name, brand, call_id) are
** selected.
*/

app.directive("validate", function(){
  return{
    restrict: 'E',
    template:"<button ng-class='validate' style='height:50px'><span class='fa fa-check' style='color:white'></span><input ng-class='button' type='submit' value='Sauvegarder'/></button>",
    link:function($scope, element, param){
      $scope.validate	= "ux-input ux-input-input ux-input-big mhover";
    	$scope.button		= "virgin-button";
      $scope.valideButton = function() {
        if ($scope.name && $scope.brand && $scope.call_id){
          $scope.validate = "ux-input ux-input-input ux-input-big validate mhover";
          $scope.button	  = "but-validate";
        } else{
          $scope.validate = "ux-input ux-input-input ux-input-big mhover";
          $scope.button	  = "virgin-button";
        }
      }
    }
  }
});

/*
** Put a validate icone in front of submit button during a five seconde.

********** $timeout import doesn't works.**************

app.directive("validateModif", function($timeout){
  return {
    restrict: 'E',
    template:"<span ng-show='validateSave' class='fa fa-check'></span>",
    link:function($scope, $timeout){
      $scope.valideButtonModif = function($timeout) {
      //  $scope.validateSave = true;
        var timer = function() {
          if( $scope.time < 5000 ) {
            $scope.validateSave = true;
            $scope.time += 1000;
            $timeout(timer, 1000);
          }
          else
            $scope.validateSave = false;
        }
        $timeout(timer, 2500);
      }
    }
  }
});*/

/*
** Change submit button color when three input(pwd, new pwd, confirmation) are
** selected.
*/

app.directive("validateSetting", function(){
  return{
    restrict: 'E',
    template:"<button ng-class='validate'><span class='fa fa-check' style='color:white'></span><input ng-class='button' type='submit' value='Sauvegarder'/></button>",
    link:function($scope, element, param){
      $scope.validate = "widget-button";
      $scope.button	= "virgin-button";
      $scope.valideButton = function() {
        if ($scope.name && $scope.brand && $scope.call_id){
          $scope.validate = "widget-button virgin_button validate";
          $scope.button	  = "virgin-button validate";
        } else{
          $scope.validate = "widget-button";
          $scope.button	  = "virgin-button";
        }
      }
    }
  }
});

/*
** Change submit button color when three input(pwd, new pwd, confirmation) are
** selected.
*/

app.directive("validatePwd", function(){
  return{
    restrict: 'E',
    template:"<button ng-class='validate'><span class='fa fa-check' style='color:white'></span><input ng-class='button' type='submit' value='Sauvegarder'/></button>",
    link:function($scope, element, param){
      $scope.validate = "widget-button";
      $scope.button	= "virgin-button";
      $scope.valideButton = function() {
        if ($scope.name && $scope.brand && $scope.call_id){
          $scope.validate = "widget-button virgin_button validate";
          $scope.button	  = "virgin-button validate";
        } else{
          $scope.validate = "widget-button";
          $scope.button	  = "virgin-button";
        }
      }
    }
  }
});
