<?php
	// clear the cookie by setting its expiration time in the past
	setcookie('babyloggersession', '', time()-3600, '/');

	// bounce them back to the login page
	header('Location: '.$urlprefix.'signin.php');
?>
