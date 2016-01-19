<?php
	require_once(__DIR__."/src/service/AuthenticatorService.php");
	AuthenticatorService::validateSession();
?>
<!DOCTYPE html>
<html>
	<head>
		<title>Liam Dashboard</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link href="./css/dashboard.css" rel="stylesheet">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<style>
			.bignum,.bignumTriple, .bignumDouble {
				border:1px solid #888;background-color:#888;
				border-radius:50%;height:200px;width:200px;
				margin-left:auto;margin-right:auto;
				color:white;font-size:5em;padding-top:50px;
			}
			.bignumDouble {
				font-size:2.0em;
				padding-top:60px;
			}
			.bignumTriple {
				font-size:1.8em;
				padding-top:50px;
			}

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

		<div class="container-fluid">
			<div class="row">
				<div class="col-sm-12 col-sm-offset-0 col-md-12 col-md-offset-0 main">
					<h1 class="page-header">Liam's Overview</h1>


					<h2 class="sub-header">Activities</h2>

					<div class="table-responsive">
						<table id='tblActivities' class="table table-striped">
							<thead>
								<tr>
									<th>Activity</th>
									<th class='text-center'>Most Recent</th>
									<!--<th class='text-center'>Next Expected</th>-->
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Feed</td>
									<td id='txtMostRecentFeed' class='text-center'></td>
									<!--<td id='txtNextFeed' class='text-center'></td>-->
								</tr>
								<tr>
									<td>Sleep</td>
									<td id='txtMostRecentSleep' class='text-center'></td>
									<!--<td id='txtNextSleep' class='text-center'></td>-->
								</tr>
								<tr>
									<td>Pee</td>
									<td id='txtMostRecentPee' class='text-center'></td>
									<!--<td id='txtNextPee' class='text-center'></td>-->
								</tr>
								<tr>
									<td>Poo</td>
									<td id='txtMostRecentPoo' class='text-center'></td>
									<!--<td id='txtNextPoo' class='text-center'></td>-->
								</tr>
							</tbody>
						</table>
					</div>

					<h2 class="sub-header">Today's Stats</h2>

					<div class="row placeholders">
						<div class="col-xs-12 col-sm-4 placeholder">
							<div id="bigNumFeedings" class="bignumTriple">?</div>
							<h4>Feeding</h4>
							<!--<span class="text-muted">Today</span>-->
						</div>
						<div class="col-xs-12 col-sm-4 placeholder">
							<div id="bigNumPoos" class="bignum">?</div>
							<h4>Poos</h4>
							<!--<span class="text-muted">Today</span>-->
						</div>
						<div class="col-xs-12 col-sm-4 placeholder">
							<div id="bigNumSleeps" class="bignumDouble">?</div>
							<h4>Naps</h4>
							<!--<span class="text-muted">Today</span>-->
						</div>
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
	<script type='text/javascript' src='js/utils.js'></script>
	<script src="./js/dashboard.js"></script>
	<script type='text/javascript' defer>

		var page = new APP.Dashboard();
		page.init();

		var txtBigNaps = document.getElementById('bigNumSleeps');
		page.setBigNumNaps(txtBigNaps);

		var txtBigFeeds = document.getElementById('bigNumFeedings');
		page.setBigNumFeeds(txtBigFeeds);

		var txtBigPoos = document.getElementById('bigNumPoos');
		page.setBigNumPoos(txtBigPoos);

		var txtMostRecentFeed = document.getElementById('txtMostRecentFeed');
		page.setMostRecentFeedData(txtMostRecentFeed);

		var txtMostRecentSleep = document.getElementById('txtMostRecentSleep');
		page.setMostRecentSleepData(txtMostRecentSleep);

		var txtMostRecentPee = document.getElementById('txtMostRecentPee');
		page.setMostRecentPeeData(txtMostRecentPee);

		var txtMostRecentPoo = document.getElementById('txtMostRecentPoo');
		page.setMostRecentPooData(txtMostRecentPoo);

	</script>