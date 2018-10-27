<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<style type="text/css">
		video
		{
			display: none;
		}

		#callframe
		{
			width: 400px;
			margin: 20px auto;
		}

		#callframe input
		{
			width: 100%;
			box-sizing: border-box;
			font-size: 15px;
			padding: 8px 8px;
		}

		#callstatus
		{
			text-align: center;
			font-size: 22px;
			margin-bottom: 15px;
			color: green;
		}
		</style>
	</head>
	<body>
		s<video id="webcam" autoplay="autoplay"></video>

		<div id="callframe">
			<div id="callstatus"></div>
			<input type="text" id="dest" />
			<input type="button" value="Call" id="btncall" />
			<input type="button" value="Hangup" id="btnhangup" />
		</div>
		
		<script src="verto.js"></script>
	</body>
</html>