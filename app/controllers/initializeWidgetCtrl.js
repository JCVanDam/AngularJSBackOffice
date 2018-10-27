app.controller("initializeWidgetCtrl", function($scope, $rootScope, toggleManagement, contextFactory, schedule){

  $rootScope.displayTopBar 	= true;

/*
** Type
*/

  $scope.buttons = [
    {
  	   "label": "Bouton d'appel avec du texte",
       "send" : "buttontxt"
    },
    {
  	   "label": "Bouton avec une barre d'appel",
       "send" : "callbar"
    },
    {
  	    "label": "Bouton flotant avec une barre d'appel",
        "send" : "popbar"
    },
    {
  	    "label": "Bouton integrer dans une popin",
        "send" : "popin"
    }
  ];
  $scope.type = [
  	{
  		"label" : "Bouton d'appel avec du texte",
      "send"  : "buttontxt"
  	}
  ];

/*
** Schedule
*/

  $scope.scheduleTmp = {
  	"Monday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Tuesday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Wednesday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Thursday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Friday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Saturday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	},
  	"Sunday": {
  		"morning" : ["00:00", "12:00"],
  		"afternoon" : ["12:10", "23:50"]
  	}
  };

  $scope.dayLstCheckbox	= {
		Lundi: "Monday",
		Mardi: "Tuesday",
		Mercredi: "Wednesday",
		Jeudi: "Thursday",
		Vendredi: "Friday",
		Samedi: "Saturday",
		Dimanche: "Sunday"
	};
	$scope.dayLst	= {
		Monday: true,
		Tuesday: true,
		Wednesday: true,
		Thursday: true,
		Friday: true,
		Saturday: true,
		Sunday: true
	};
  $scope.selectLst = {
		Monday: true,
		Tuesday: true,
		Wednesday: true,
		Thursday: true,
		Friday: true,
		Saturday: true,
		Sunday: true
	};

/*
* Toggle menu management
*/

  var toggle =
  [
    'disGeneral',
    'disType',
    'disTags',
    'disMessages',
    'disSchedule',
    'disCustom',
    'disSettings',
    'disContext'
  ];
  var genToggle =
  [
    'basique',
    'advanced'
  ];
  $scope.tags     = [];
  $scope.cookies  = [];

  $scope.menuBlock       = toggleManagement.save(genToggle);
  $scope.block           = toggleManagement.save(toggle);
  $scope.selectToggle    = toggleManagement.saveSelectToggle(toggle);
  $scope.toggleMenu      = function(id) {
  	$scope.menuBlock     = toggleManagement.getToggleMenu($scope.menuBlock, id);
  };
  $scope.toggle          = function(id) {
    $scope.block         = toggleManagement.getToggle($scope.block, id);
  	$scope.selectToggle  = toggleManagement.getSelectToggle($scope.selectToggle, id);
  };

/*
* Context
*/

  $scope.imageContext = 'data:image/svg+xml;base64, CgkJCTxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCQkJICAgICB2aWV3Qm94PSIwIDAgNTAgNTAiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUwIDUwOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CgkJCTxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+CgkJCSAgICAuc3Qwe2ZpbGw6IzAwQTlDRDt9CgkJCSAgICAuc3Qxe2ZpbGw6I0ZGRkZGRjt9CgoJCQkgICAgIEAtd2Via2l0LWtleWZyYW1lcyBhbmltX3pvb20gewoJCQkgICAgICAgIDAlIHstd2Via2l0LXRyYW5zZm9ybTpzY2FsZSgxKX0KCQkJICAgICAgICA1MCUgey13ZWJraXQtdHJhbnNmb3JtOnNjYWxlKDEpfQoJCQkgICAgICAgIDc1JSB7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKDIwcHgsIDE5cHgpIHNjYWxlKDApfQoJCQkgICAgICAgIDEwMCUgey13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwcHgsIDBweCkgc2NhbGUoMSl9CgkJCSAgICAgIH0KCQkJICAgICAgLmdyb3cgey13ZWJraXQtYW5pbWF0aW9uOiBhbmltX3pvb20gNXMgZWFzZS1vdXQgaW5maW5pdGU7fQoJCQk8L3N0eWxlPgoJCQk8ZyBpZD0icm9uZCI+CgkJCSAgICA8Y2lyY2xlIGlkPSJYTUxJRF80XyIgY2xhc3M9InN0MCIgY3g9IjI1IiBjeT0iMjUiIHI9IjI1Ii8+CgkJCTwvZz4KCQkJPGcgaWQ9ImNyb2l4Ij4KCQkJICAgIDxwYXRoIGlkPSJYTUxJRF82XyIgY2xhc3M9InN0MSBncm93IiBkPSJNMzkuNCwyNUwzOS40LDI1YzAsMi4yLTEuOCw0LTQsNEgxNC42Yy0yLjIsMC00LTEuOC00LTR2MGMwLTIuMiwxLjgtNCw0LTRoMjAuOQoJCQkgICAgICAgIEMzNy42LDIxLDM5LjQsMjIuOCwzOS40LDI1eiIvPgoJCQkgICAgPHBhdGggaWQ9IlhNTElEXzVfIiBjbGFzcz0ic3QxIGdyb3ciIGQ9Ik0yNSwzOS40TDI1LDM5LjRjLTIuMiwwLTQtMS44LTQtNFYxNC42YzAtMi4yLDEuOC00LDQtNGgwYzIuMiwwLDQsMS44LDQsNHYyMC45CgkJCSAgICAgICAgQzI5LDM3LjYsMjcuMiwzOS40LDI1LDM5LjR6Ii8+CgkJCTwvZz4KCQkJPC9zdmc+CgkJ';

/*
******************** Context manage ********************************************
*/
  $scope.$on('contextSun', function(event, context) {
    $scope.context = context;
  });
  $scope.$on('tagsSun', function(event, tags) {
    $scope.tags = tags;
  });
  $scope.$on('cookiesSun', function(event, cookies) {
    $scope.cookies = cookies;
  });

  $scope.broadcastEventContext = function() {
    $scope.$broadcast('contextParent', $scope.context);
    $scope.$broadcast('tagsParent', $scope.tags);
    $scope.$broadcast('cookiesParent', $scope.cookies);
  };

  $scope.delete = function(item, type){
	  $scope.context[type] = contextFactory.delete($scope.context[type], item, $scope[type], type);
    $scope.broadcastEventContext();
   };

   $scope.add = function(item, type){
    // $scope.errTagName  = false;
     //$scope.errTagId 	  = false;

     var ret = contextFactory.add($scope.context, item, $scope[type], type);
    // $scope.errTagName  = (ret === "NAME ERROR") ? true : false;
    // $scope.errTagId 	  = (ret === "ID ERROR") ? true : false;
     //if (!$scope.errTagId && !$scope.errTagName){
      $scope.context = ret;
    // }
     if ($scope[type].length > 1)
      $scope[type][$scope[type].length - 2].display = false;
     $scope.broadcastEventContext();
   };
});
