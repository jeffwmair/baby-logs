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
		feed(get('time'), get('amount'));
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
	$feeds = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'feed' $valWhere order by time"));
	$diapers = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'diaper' $valWhere order by time"));
	$jsonArr = array();
	$jsonArr["sleeps"] = $sleeps;
	$jsonArr["feeds"] = $feeds;
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


function feed($time, $amount) {
	if ($amount == 'none') {
		getSqlResult("delete from baby_keyval where entry_type = 'feed' and time = '$time';");
		loadData(getDayFromTimeStr($time));
		return;
	}

	getSqlResult("delete from baby_keyval where time = '$time' and entry_type = 'feed';");
	getSqlResult("insert into baby_keyval (time, entry_type, entry_value) values('$time', 'feed', '$amount');");
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
