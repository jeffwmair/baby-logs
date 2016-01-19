<!DOCTYPE html>
<html>
	<head>
		<title>Sign in to Baby Logger</title>
		<script src="https://apis.google.com/js/platform.js" async defer></script>
		<meta name="google-signin-client_id" content="315242497232-2bmnarvutshdg8dco6er82ctkh07u80k.apps.googleusercontent.com">
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
		<link href="./css/signin.css" rel="stylesheet">
	</head>
	<body>
		<div class="container">

			<form class="form-signin">
				<h2 class="form-signin-heading">Please sign in with your Google account</h2>
				<div class="g-signin2" data-onsuccess="onSignIn"></div>
			</form>

		</div> <!-- /container -->
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
	<script>
		function onSignIn(googleUser) {
			var profile = googleUser.getBasicProfile();
			var authInstance = gapi.auth2.getAuthInstance();
			var token = googleUser.getAuthResponse().id_token;
			//console.log(token);

			var doAsync = false;
			var API = "src/web/Authentication.php";

			var errorHandler = function(msg) {
				console.error(msg);
			}

			UTILS.ajaxGetJson(API + "?token="+token, errorHandler, function(json) {
				if (json.authenticated = "1") {
					window.location.href = "http://localhost/baby/";
				}
			}, doAsync);


		}
	</script>
