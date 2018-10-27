<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title>App</title>
		<script src="node_modules/jquery/dist/jquery.min.js"></script>
		<script src="qslab.js"></script>
		<script src="jquery.sublim.js"></script>
		<style type="text/css">

		</style>
	</head>
	<body>
		<div id="btn-1" style="width:100px;height:100px;background:black;"></div>
		<script>
		var btn = $('#btn-1').sublim({background: 'red'});
		console.log(btn);
		btn.init('vktrz');
		btn.updateColor('yellow');
		</script>
	</body>
</html>