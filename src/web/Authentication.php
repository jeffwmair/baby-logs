<?php

require_once(__DIR__."/../utils/utils.php");
require_once(__DIR__."/../service/AuthenticatorService.php");
require_once(__DIR__."/../mapping/RecordQueryMapper.php");

$babyid = 1;
$con = connect();
$mapper = new RecordQueryMapper( $con, $babyid );

$googleToken = $_GET['token'];
$authService = new AuthenticatorService($mapper);
$authenticated = false;
if ($authService->authenticateTokenAgainstGoogle($googleToken)) {
	setcookie("babyloggersession", "foobar-need-to-generate-token", time()+(3600*24*14), "/");
	$authenticated = true;
}
$redirectUrl = getUrlPrefix();
$result = array("authenticated" => "$authenticated", "redirecturl" => "$redirectUrl");
$json = json_encode($result);
header('Content-Type: application/json');
echo $json;
