var timeout;

/*
** Check on each page if the user has a logkey.
*/

var isAuth = function() {
	var logkey = window.sessionStorage.getItem('snapcall-logkey');

	if (typeof logkey === 'null' || typeof logkey === 'undefined' || logkey === null || logkey === undefined) {
		return false;
	}
	return true;
};

/*
** Does a redirection if mouse doesn't move during 20 min.
*/

document.onmousemove = function(){
	clearTimeout(timeout);
	timeout = setTimeout(function(){
		document.location.href = "https://adminsandbox.snapcall.io/index.php";
	}, 20 * 60000);
}

/*
** Angular module declaration.
*/

var app = angular.module('appmain', ['ngRoute','ngSanitize', 'ngCsv' , 'textAngular']);

/*
** Hide the top bar in the login and inscription page.
*/

app.run(function($rootScope) {
	$rootScope.displayTopBar 		= false;
	$rootScope.vertoConnection 	= false;
})

/*
** Config text Editor.
*/

app.config(function($provide) {
	$provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {
			taOptions.toolbar = [
		    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
		    ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
		    ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
		  ];
			return taOptions;
	}]);
})

/*
** Router.
*/

app.config(function($routeProvider) {
    $routeProvider
	.when('/', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/login.html';
        	}
        	return 'views/login.html';
        }
    })
	.when('/widget/list', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/widget-list.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/widget/create', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/widget-create.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/widget/modify', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/widget-modify.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/dashboard', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/dashboard.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/currentCall', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/current_call.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/call/history', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/call-history-list.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/call/history/:bid_id/:page', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/call-history-detail.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/api', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/api.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/licence', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/licence.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/parameter', {
        templateUrl : function() {
			if (isAuth()) {
				return 'views/settings.html';
        	}
        	return 'views/login.html';
        }
	})
	.when('/inscription', {
        templateUrl : function() {
			return 'views/inscription.html';
        }
	})
	.when('/user/logout', {
		templateUrl : function() {
			window.sessionStorage.removeItem('snapcall-logkey');
			return 'views/login.html';
		}
	});
});
