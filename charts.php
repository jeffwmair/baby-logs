<?php
	require_once(__DIR__."/src/service/AuthenticatorService.php");
	AuthenticatorService::validateSession();
?>
<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link href="./css/dashboard.css" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Liam Charts</title>
	</head>
	<body>
		<nav class="navbar navbar-inverse navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="./index.php">Liam Logs</a>
			</div>
			<div id="navbar" class="navbar-collapse collapse">
				<ul class="nav navbar-nav navbar-right">
					<li><a href="./index.php">Overview</a></li>
					<li><a href="./entry.php">Entry</a></li>
					<li><a href="./charts.php">Charts</a></li>
					<li><a href="./signout.php">Sign Out</a></li>
				</ul>
			</div>
		</div>
		</nav>

		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 main">
					<div id="container_linechart_daily" style="width:100%;height:400px"></div>
					<div id="container_linechart_weekly" style="margin-top:80px;width:100%;height:400px"></div>
					<div id='tableContainer'>
						<!-- data will be placed here dynamically -->
					</div>
				</div>
			</div>
		</div>

		<!-- Bootstrap core JavaScript
		================================================== -->
		<!-- Placed at the end of the document so the pages load faster -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
		<script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>
			<!-- Latest compiled and minified bootstrap JavaScript -->
			<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

		</body>
	</html>
	<script src="https://code.jquery.com/jquery-1.9.1.min.js"></script>
	<script src="http://code.highcharts.com/highcharts.js"></script>
	<script src="http://code.highcharts.com/modules/exporting.js"></script>
	<script src="js/utils.js"></script>
	<script src="js/datetime.js"></script>
	<script src="js/dataset.converter.js"></script>
	<script src="js/reportpage.js"></script>
	<script>
		var page = new APP.ReportPage();
		var container = document.getElementById('tableContainer');
		var calHelper = new DATETIME.CalendarHelper();
		page.init(container, calHelper);
	</script>