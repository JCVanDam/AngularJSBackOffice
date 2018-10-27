/*
** Change widget with personalized color.
*/

app.directive("widgetPersonalized", function(){
  return{
    restrict: 'E',
    template:"<img src={{dataUrlWidget}} height={{size}} width={{size}}></img>",
    controller:function($scope){
      var svg = '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve" ><style type="text/css">.st0{fill:' + $scope.colorFg + ';}.st1{fill:' + $scope.colorBg + ';}@-webkit-keyframes anim_zoom { 0% {-webkit-transform:scale(1)} 50% {-webkit-transform:scale(1)} 75% {-webkit-transform:translate(-1234px, 795px) scale(0)} 100% {-webkit-transform:translate(0px, 0px) scale(1)} }@-moz-keyframes anim_zoom { 0% {-moz-transform:scale(1)} 50% {-moz-transform:scale(1)} 75% {-moz-transform:translate(-1234px, 795px) scale(0)} 100% {-moz-transform:translate(0px, 0px) scale(1)} }@keyframes anim_zoom { 0% {transform:scale(1)} 50% {transform:scale(1)} 75% {transform:translate(-1234px, 795px) scale(0)} 100% {transform:translate(0px, 0px) scale(1)} }.grow { -webkit-animation: anim_zoom 5s ease-out infinite; -moz-animation: anim_zoom 5s ease-out infinite; animation: anim_zoom 5s ease-out infinite; }</style><title>Asset 1</title><g id="Layer_2" transform="translate(0,10)"><path id="forme" class="st1" d="M-1211.7,781l-10.1,3.8c-0.4,0.1-0.8-0.1-0.9-0.4c0-0.1,0-0.3,0-0.4l3.7-10.2c-9.6-5.5-21.8-2.3-27.3,7.3c-5.5,9.6-2.3,21.8,7.3,27.3c9.6,5.5,21.8,2.3,27.3-7.3C-1208.1,794.8-1208.1,787.2-1211.7,781z"/><g><path id="telB" class="st0 grow" d="M-1236.9,783.4c-0.4,0.7-0.7,1.5-0.7,2.4c0.5,3.5,2.1,6.6,4.7,9c2.4,2.6,5.5,4.3,9,4.7c0.8,0,1.7-0.2,2.4-0.7c0.7-0.3,1.2-0.8,1.6-1.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.2-0.4-0.4-1-0.7l-0.7-0.4l-0.8-0.4l-0.7-0.4l-0.3-0.2c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0-0.5,0.2-0.6,0.4c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.7,0.8c-0.1,0.2-0.4,0.3-0.6,0.4c-0.1,0-0.2,0-0.3-0.1l-0.3-0.1l-0.3-0.1l-0.2-0.2c-1.1-0.6-2.1-1.4-3-2.2c-0.9-0.9-1.6-1.9-2.2-3l-0.1-0.2l-0.2-0.4c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.2,0.2-0.4,0.4-0.6c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.2-0.2,0.3-0.4,0.4-0.6c0-0.1,0-0.3-0.1-0.4c-0.1-0.2-0.2-0.3-0.3-0.5l-0.2-0.3l-0.5-0.7c-0.1-0.2-0.3-0.5-0.4-0.8l-0.4-0.7c-0.3-0.6-0.5-0.9-0.7-1c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0.1-0.9,0.1c-0.3,0.1-0.6,0.2-0.9,0.3C-1236.1,782.2-1236.6,782.7-1236.9,783.4z"/></g></g></svg>';

      $scope.dataUrlWidget = 'data:image/svg+xml;base64, ' + window.btoa(svg);
    },
    link:function($scope){
      $scope.loadImg = function(){
        var svg = '<svg version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1254 776 50 50" style="enable-background:new -1254 776 50 50;" xml:space="preserve" ><style type="text/css">.st0{fill:' + $scope.colorFg + ';}.st1{fill:' + $scope.colorBg + ';}@-webkit-keyframes anim_zoom { 0% {-webkit-transform:scale(1)} 50% {-webkit-transform:scale(1)} 75% {-webkit-transform:translate(-1234px, 795px) scale(0)} 100% {-webkit-transform:translate(0px, 0px) scale(1)} }@-moz-keyframes anim_zoom { 0% {-moz-transform:scale(1)} 50% {-moz-transform:scale(1)} 75% {-moz-transform:translate(-1234px, 795px) scale(0)} 100% {-moz-transform:translate(0px, 0px) scale(1)} }@keyframes anim_zoom { 0% {transform:scale(1)} 50% {transform:scale(1)} 75% {transform:translate(-1234px, 795px) scale(0)} 100% {transform:translate(0px, 0px) scale(1)} }.grow { -webkit-animation: anim_zoom 5s ease-out infinite; -moz-animation: anim_zoom 5s ease-out infinite; animation: anim_zoom 5s ease-out infinite; }</style><title>Asset 1</title><g id="Layer_2" transform="translate(0,10)"><path id="forme" class="st1" d="M-1211.7,781l-10.1,3.8c-0.4,0.1-0.8-0.1-0.9-0.4c0-0.1,0-0.3,0-0.4l3.7-10.2c-9.6-5.5-21.8-2.3-27.3,7.3c-5.5,9.6-2.3,21.8,7.3,27.3c9.6,5.5,21.8,2.3,27.3-7.3C-1208.1,794.8-1208.1,787.2-1211.7,781z"/><g><path id="telB" class="st0 grow" d="M-1236.9,783.4c-0.4,0.7-0.7,1.5-0.7,2.4c0.5,3.5,2.1,6.6,4.7,9c2.4,2.6,5.5,4.3,9,4.7c0.8,0,1.7-0.2,2.4-0.7c0.7-0.3,1.2-0.8,1.6-1.4c0.1-0.3,0.2-0.6,0.3-0.9c0.1-0.3,0.1-0.6,0.1-0.9c0-0.1,0-0.2,0-0.3c0-0.2-0.4-0.4-1-0.7l-0.7-0.4l-0.8-0.4l-0.7-0.4l-0.3-0.2c-0.1-0.1-0.3-0.2-0.5-0.3c-0.1,0-0.2-0.1-0.3-0.1c-0.2,0-0.5,0.2-0.6,0.4c-0.3,0.2-0.5,0.5-0.7,0.8c-0.2,0.3-0.4,0.5-0.7,0.8c-0.1,0.2-0.4,0.3-0.6,0.4c-0.1,0-0.2,0-0.3-0.1l-0.3-0.1l-0.3-0.1l-0.2-0.2c-1.1-0.6-2.1-1.4-3-2.2c-0.9-0.9-1.6-1.9-2.2-3l-0.1-0.2l-0.2-0.4c0-0.1-0.1-0.2-0.1-0.3c0-0.1-0.1-0.2-0.1-0.3c0-0.2,0.2-0.4,0.4-0.6c0.2-0.2,0.5-0.5,0.8-0.7c0.3-0.2,0.6-0.5,0.8-0.7c0.2-0.2,0.3-0.4,0.4-0.6c0-0.1,0-0.3-0.1-0.4c-0.1-0.2-0.2-0.3-0.3-0.5l-0.2-0.3l-0.5-0.7c-0.1-0.2-0.3-0.5-0.4-0.8l-0.4-0.7c-0.3-0.6-0.5-0.9-0.7-1c-0.1,0-0.2,0-0.3,0c-0.3,0-0.6,0.1-0.9,0.1c-0.3,0.1-0.6,0.2-0.9,0.3C-1236.1,782.2-1236.6,782.7-1236.9,783.4z"/></g></g></svg>';

        $scope.dataUrlWidget = 'data:image/svg+xml;base64, ' + window.btoa(svg);
      }
    }
  }
});

/*
** Load background image from user folder.
*/
/*
app.directive("imgUpload", function(){
  return{
    restrict: 'E',
    template:"<img src={{dataUrlBg}} height='200' width='200'></img>",
    controller:function($scope, $timeout){
      $scope.fileReaderSupported = window.FileReader != null;
    	$scope.uploadPhoto = function(files) {
        $scope.content = files[0];
    		if ($scope.fileReaderSupported && $scope.content.type.indexOf('image') > -1) {
    			$timeout(function() {
    		  	var fileReader = new FileReader();
    		  	fileReader.readAsDataURL($scope.content);
    				fileReader.onload = function(e) {
    					$timeout(function(){
    						$scope.dataUrlBg = e.target.result;
    						console.log($scope.dataUrlBg);
    					});
    				}
    			});
    		}
      }
    }
  }
});*/
