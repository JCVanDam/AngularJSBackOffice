<DOCTYPE html>
<html>
	<head>
		<!-- Metas -->
		<title>Snapcall - Click to speak</title>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="icon" href="https://admin.snapcall.io/favicon.ico" type="image/x-icon">
		<!-- Scripts -->
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular-route.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/angular-sanitize/1.5.8/angular-sanitize.js"></script>
		<!-- verto -->
		<script type="text/javascript" src="./libsc/verto2/jquery-2.1.1.min.js"></script>
		<script type="text/javascript" src="./libsc/verto2/jquery.json-2.4.min.js"></script>
		<script type="text/javascript" src="./libsc/verto2/jquery.cookie.js"></script>
		<script type="text/javascript" src="./libsc/verto2/jquery.dataTables.min.js"></script>
		<script type="text/javascript" src="./libsc/verto2/verto-min.js"></script>
		<!-- graphic -->
		<script src="https://adminsandbox.snapcall.io/libsc/chartjs/chart.bundle.min.js"></script>
		<!-- calendar -->
		<script src="https://admin.snapcall.io/libsc/pickadate/picker.js"></script>
		<script src="https://admin.snapcall.io/libsc/pickadate/picker.date.js"></script>
		<!-- export csv -->
		<script src="https://admin.snapcall.io/libsc/ngcsv/ngcsv.min.js"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/ng-csv/0.3.6/ng-csv.js"></script>
		<!-- text editor -->
		<script src='./libsc/textangular/dist/textAngular-rangy.min.js'></script>
    <script src='./libsc/textangular/dist/textAngular-sanitize.min.js'></script>
    <script src='./libsc/textangular/dist/textAngular.min.js'></script>
		<!-- CSS -->
		<link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.1.0/css/bootstrap.min.css">
    <link href="https://fonts.googleapis.com/css?family=Droid+Sans+Mono" rel="stylesheet" />
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
		<link href="css/global.css" rel="stylesheet" />
		<link href="https://admin.snapcall.io/libsc/jquery-datetimepicker/build/jquery.datetimepicker.min.css" rel="stylesheet" />
		<link href="https://admin.snapcall.io/libsc/pickadate/themes/classic.css" rel="stylesheet" />
		<link href="https://admin.snapcall.io/libsc/pickadate/themes/classic.date.css" rel="stylesheet" />

	</head>
	<body ng-app="appmain">
		<div ng-include="'views/topbar.html'"></div>
		<div ng-view></div>
		<!-- Controllers -->
		<script src="app/controllers/app.js"></script>
		<script src="app/controllers/topBarCtrl.js"></script>
		<script src="app/controllers/apiCtrl.js"></script>
		<script src="app/controllers/navList.js"></script>
		<script src="app/controllers/loginCtrl.js"></script>
		<script src="app/controllers/callHistoryListCtrl.js"></script>
		<script src="app/controllers/dashboardCtrl.js"></script>
		<script src="app/controllers/currentCallCtrl.js"></script>
		<script src="app/controllers/widgetCreateCtrl.js"></script>
		<script src="app/controllers/widgetModifyCtrl.js"></script>
		<script src="app/controllers/mainmenuCtrl.js"></script>
		<script src="app/controllers/widgetListCtrl.js"></script>
		<script src="app/controllers/settingsCtrl.js"></script>
		<script src="app/controllers/inscriptionCtrl.js"></script>
		<script src="app/controllers/initializeWidgetCtrl.js"></script>
		<script src="app/controllers/licenceCtrl.js"></script>
		<!-- Factories -->
		<script src="app/factories/utf8.js"></script>
		<script src="app/factories/schedule.js"></script>
		<script src="app/factories/context.js"></script>
		<script src="app/factories/manageLogout.js"></script>
		<script src="app/factories/toggleManagement.js"></script>
		<script src="app/factories/user.js"></script>
		<!-- Directives -->
		<script src="app/directives/widgets.js"></script>
		<script src="app/directives/backgroundImport.js"></script>
		<!-- Services -->
		<script src="app/services/storeWidget.js"></script>
	</body>
</html>
