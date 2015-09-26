<!DOCTYPE html>
<html>
<head>
	<title>Log Entries</title>
	<style type="text/css">
		button { margin-bottom:10px; height:40px; width:150px; }
		form { display:inline };
		select { width: 50px; height:40px }
		a { font-size:3em; display:block; margin-bottom:30px; }
	</style>
</head>
<body>
	<a href="index.html">Back to Log</a>
	<section>
	<h3>Sleep</h3>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="startsleep" />
		<button type="submit">Start Sleep Now</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="endsleep" />
		<button type="submit">End Sleep Now</button>
	</form>
	</section>
	<section>
	<h3>Diaper</h3>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="diaper" />
		<input type="hidden" name="value" value="1" />
		<button type="submit">Diaper - Pee Only</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="diaper" />
		<input type="hidden" name="value" value="2" />
		<button type="submit">Diaper - Poo Only</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="diaper" />
		<input type="hidden" name="value" value="3" />
		<button type="submit">Diaper - Pee &amp; Poo</button>
	</form>
	</section>
	<section>
	<h3>Feed - Breast</h3>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<input type="hidden" name="value" value="BL" />
		<button type="submit">Breast Left</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<input type="hidden" name="value" value="BR" />
		<button type="submit">Breast Right</button>
	</form>
	</section>
	<section>
	<h3>Feed - Bottle</h3>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<input type="hidden" name="value" value="70" />
		<button type="submit">Bottle 70</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<input type="hidden" name="value" value="75" />
		<button type="submit">Bottle 75</button>
	</form>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<input type="hidden" name="value" value="80" />
		<button type="submit">Bottle 80</button>
	</form>
<br>
	<form action="services/BabyApi.php" method="get">
		<input type="hidden" name="action" value="addvalue" />
		<input type="hidden" name="type" value="feed" />
		<select name="value">
			<option value="50">50</option>
			<option value="55">55</option>
			<option value="60">60</option>
			<option value="65">65</option>
			<option value="70">70</option>
			<option value="75">75</option>
			<option value="80">80</option>
			<option value="85">85</option>
			<option value="90">90</option>
		</select>
		<button type="submit">Bottle</button>
	</form>
	</section>
</body>
</html>
