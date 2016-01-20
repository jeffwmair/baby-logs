<?php

require_once(__DIR__."/../utils/utils.php");
require_once(__DIR__."/../mapping/RecordQueryMapper.php");
require_once(__DIR__."/../mapping/RecordModifyMapper.php");
require_once(__DIR__."/../service/AuthenticatorService.php");

function validateSession() {

	$con = connect();
	// TODO
	$babyid = 1;
	$mapper = new RecordQueryMapper( $con, $babyid );
	$modifyMapper = new RecordModifyMapper( $con );
	$authService = new AuthenticatorService($mapper, $modifyMapper);

	$sessionToken = $_COOKIE['babyloggersession'];
	if (!$authService->isValidSessionToken($sessionToken)) {
		// expire the cookie
		setcookie("babyloggersession", "", time()-3600, "/");

		// redirect to the login page
		$urlprefix = getUrlPrefix();
		header('Location: '.$urlprefix.'signin.php');
		exit();
	}
}

validateSession();
