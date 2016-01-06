<?php

require_once(__DIR__."/../utils/utils.php");
require_once(__DIR__."/../service/ReportService.php");
require_once(__DIR__."/../service/DateService.php");
require_once(__DIR__."/../service/DataService.php");
require_once(__DIR__."/../mapping/RecordQueryMapper.php");
require_once(__DIR__."/../mapping/RecordModifyMapper.php");

$method = get('action');

// services and what-not
$con = connect();
$mapper = new RecordQueryMapper( $con );
$insertMapper = new RecordModifyMapper( $con );
$dataservice = new DataService( $insertMapper );

// TODO: would be ideal to clean this up into some kind of separate object
try {
	switch($method) {
	case 'loadDashboard':
		loadDashboardData($con, $mapper);
		break;
	case 'addvalue':
		$time = get('time');
		$dataservice->addValueItem(get('type'), get('value'), $time);
		loadData(getDayFromTimeStr($time));
		break;
	case 'removevalue':
		removeValueItem(get('type'), get('value'), get('time'));
		break;
	case 'sleep':
		$sleepstart = get('sleepstart');
		$dataservice->addSleep($sleepstart, get('sleepend'));
		loadData(getDayFromTimeStr($sleepstart));
		break;
	case 'removesleep':
		removeSleep(get('sleepstart'));
		break;
	case 'feed':
		feed(get('time'), get('feedtype'), get('amount'));
		break;
	case 'loaddata':
		$optionalDay = get('day');
		loadData($optionalDay);
		break;
	case 'loadreportdata':
		loadReportData( $con, $mapper );
		break;
	default:
		echo "Unknown action:'$method'";
	}
}
catch (Exception $e) {
	// return error header and echo the error message
	header('HTTP/1.1 500 Internal Server Error');
	$msg = $e->getMessage();
	echo "$msg";
}

function loadDashboardData($con, $mapper) {
	$dateService = new DateService();
	$dailyRptDays = 10;
	$svc = new ReportService($dailyRptDays, $mapper, $dateService);
	$report = $svc->getDashboardData();
	$json = json_encode($report);
	header('Content-Type: application/json');
	echo $json;
}

function loadReportData( $con, $mapper ) {
	$dateService = new DateService();
	$dailyRptDays = 10;
	$svc = new ReportService($dailyRptDays, $mapper, $dateService);
	$report = $svc->getBarChartReport();
	$json = json_encode($report);
	header('Content-Type: application/json');
	echo $json;
}


function loadData($day) {
	$sleepWhere = "";
	$valWhere = "";
	if ($day != NULL) {
		$sleepWhere = " where start >= '$day' and start <= '$day 23:59:59' ";
		$valWhere = " and time between '$day' and '$day 23:59:59' ";
	}
	$sql_sleeps = "select * from baby_sleep $sleepWhere order by start";
	$sleeps = convertSqlRowsToArray(getSqlResult($sql_sleeps));
	$milkFeeds = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'milk' $valWhere order by time"));
	$fmlaFeeds = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'formula' $valWhere order by time"));
	$diapers = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'diaper' $valWhere order by time"));
	$jsonArr = array();
	$jsonArr["sleeps"] = $sleeps;
	$jsonArr["milkfeeds"] = $milkFeeds;
	$jsonArr["fmlafeeds"] = $fmlaFeeds;
	$jsonArr["diapers"] = $diapers;
	returnJson(json_encode($jsonArr));
}


function returnJson($data) {
	header('Content-Type: application/json');
	echo $data;
}


function removeValueItem($type, $value, $time) {
	$sql = "delete from baby_keyval where entry_type = '$type' and time = '$time' and entry_value = '$value';";
	getSqlResult($sql);
	loadData(getDayFromTimeStr($time));
}


function feed($time, $feedtype, $amount) {

	getSqlResult("delete from baby_keyval where entry_type = '$feedtype' and time = '$time';");
	if ($amount == 'none') {
		loadData(getDayFromTimeStr($time));
		return;
	}

	getSqlResult("insert into baby_keyval (time, entry_type, entry_value) values('$time', '$feedtype', '$amount');");
	loadData(getDayFromTimeStr($time));
}


function removeSleep($sleepstart) {
	$sql = "delete from baby_sleep where start =  TIMESTAMP('$sleepstart');";
	$res = getSqlResult($sql);
	loadData(getDayFromTimeStr($sleepstart));
}


function getDayFromTimeStr($time) {
	return substr($time, 0, 10);
}


function get($index) {
	if (!isset($_GET[$index])) {
		return NULL;
	}
	return $_GET[$index];
}

?>
