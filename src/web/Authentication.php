<?php

require_once(__DIR__."/../utils/utils.php");
require_once(__DIR__."/../service/AuthenticatorService.php");
require_once(__DIR__."/../mapping/RecordQueryMapper.php");
require_once(__DIR__."/../mapping/RecordModifyMapper.php");

function authenticateGoogleToken() {

	$babyid = 1;
	$con = connect();
	$mapper = new RecordQueryMapper( $con, $babyid );
	$modifyMapper = new RecordModifyMapper( $con );

	$googleToken = $_GET['token'];
	$authService = new AuthenticatorService($mapper, $modifyMapper);
	$authenticated = false;
	$token = $authService->authenticateTokenAgainstGoogle($googleToken);
	if (isset($token)) {
		setcookie("babyloggersession", "$token", time()+(3600*24*14), "/");
		$authenticated = true;
	}
	$redirectUrl = getUrlPrefix();
	$result = array("authenticated" => "$authenticated", "redirecturl" => "$redirectUrl");
	$json = json_encode($result);
	header('Content-Type: application/json');
	echo $json;
}

authenticateGoogleToken();
