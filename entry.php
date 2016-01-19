<?php
	require_once(__DIR__."/src/service/AuthenticatorService.php");
	AuthenticatorService::validateSession();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Entry</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link href="./css/dashboard.css" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style>
			#date { display: inline }
			#datePicker { margin-top:20px; margin-bottom:20px }
			select,button,div#container { font-size:1.15em; }
		</style>
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
		<div class="col-sm-6 col-sm-offset-0 col-md-6 col-md-offset-0 main">
			<h2>Entries</h2>
			<div id='datePicker'>
				<button id='btnBack'>&lt;&lt;</button>
				<h3 id='date'></h3>
				<button id='btnForward'>&gt;&gt;</button>
			</div>
			<div id="errorDiv" class="alert alert-danger" style="display:none">
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
				<strong>Error!</strong> <span id='errMsg'>error message goes here!</span>
			</div>
			<div class="table-responsive">
				<table id='tblEntries' class="table table-striped table-condensed">
					<thead>
						<th>Time</th>
						<th>Sleep</th>
						<th>Pee</th>
						<th>Poo</th>
						<th>Milk</th>
						<th>Formula</th>
					</thead>
					<tbody id='tblEntriesBody'></tbody>
				</table>
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
	<script type='text/javascript' src='js/utils.js'></script>
	<script type='text/javascript' src='js/datetime.js'></script>
	<script type='text/javascript' src='js/dataset.core.js'></script>
	<script type='text/javascript' src='js/dataset.converter.js'></script>
	<script type='text/javascript' src='js/entrypage.js'></script>
	<script>

		var table = document.getElementById('tblEntriesBody');
		var backButton = document.getElementById('btnBack');
		var forwardButton = document.getElementById('btnForward');
		var entryPage = new APP.EntryPage();
		var errorDiv = document.getElementById('errorDiv');
		var errorMsg = document.getElementById('errMsg');
		var now = new Date();
		var dateEl = document.getElementById('date');
		entryPage.init(now, table, backButton, forwardButton, dateEl, errorDiv, errorMsg);

	</script>