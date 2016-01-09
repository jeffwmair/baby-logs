<?php

require_once(__DIR__."/../utils/utils.php");
require_once(__DIR__."/../service/ReportService.php");
require_once(__DIR__."/../service/DateService.php");
require_once(__DIR__."/../service/DataService.php");
require_once(__DIR__."/../mapping/RecordQueryMapper.php");
require_once(__DIR__."/../mapping/RecordModifyMapper.php");

$method = get('action');

// services and what-not
$dailyRptDays = 10;

$con = connect();
$mapper = new RecordQueryMapper( $con );
$modifyMapper = new RecordModifyMapper( $con );
$dataservice = new DataService( $modifyMapper, $mapper );
$dateservice = new DateService();
$reportservice = new ReportService($dailyRptDays, $mapper, $dateservice);

// TODO: would be ideal to clean this up into some kind of separate object
try {
	switch($method) {
	case 'loadDashboard':
		loadDashboardData($reportservice);
		break;
	case 'addvalue':
		addValueItem($dataservice);
		break;
	case 'removevalue':
		removeValueItem($dataservice, $mapper);
		break;
	case 'sleep':
		doSleep($dataservice);
		break;
	case 'removesleep':
		removeSleep($dataservice);
		break;
	case 'loadentrydata':
		loadEntryData($dataservice, get('day'));
		break;
	case 'loadreportdata':
		loadReportData( $reportservice );
		break;
	default:
		throw new Exception("Unknown action:'$method'");
	}
}
catch (Exception $e) {
	// return error header and echo the error message
	header('HTTP/1.1 500 Internal Server Error');
	$msg = $e->getMessage();
	echo "<h1>Error:$msg</h1>";
}


function loadDashboardData($svc) {
	$report = $svc->getDashboardData();
	$json = json_encode($report);
	header('Content-Type: application/json');
	echo $json;
}


function loadReportData( $svc ) {
	$report = $svc->getBarChartReport();
	$json = json_encode($report);
	header('Content-Type: application/json');
	echo $json;
}

function loadEntryData($dataservice, $day) {

	$entries = $dataservice->getEntryDataJson($day);
	$jsonArr = json_encode($entries);
	returnJson($jsonArr);
}


function returnJson($data) {
	header('Content-Type: application/json');
	echo $data;
}


function addValueItem($dataservice) {
	$type = get('type');
	$val = get('value');
	$time = get('time');
	if ($type == 'milk' || $type == 'formula') {
		$dataservice->deleteValueItemByType($time, $type);
		if ($val != 'none') {
			$dataservice->addValueItem($type, $val, $time);
		}
	}	
	else {
		$dataservice->deleteValueItem($time, $type, $val);
		$dataservice->addValueItem($type, $val, $time);
	}
	loadEntryData($dataservice, getDayFromTimeStr($time));
}

function doSleep($dataservice) {
	$sleepstart = get('sleepstart');
	$dataservice->addSleep($sleepstart, get('sleepend'));
	loadEntryData($dataservice, getDayFromTimeStr($sleepstart));
}


function removeValueItem($dataservice, $mapper) {
	$optionalValue = get('value');
	$dataservice->deleteValueItem(get('time'), get('type'), $optionalValue);
	loadEntryData($dataservice, getDayFromTimeStr(get('time')));
}


function removeSleep($dataservice) {
	$sleepstart = get('sleepstart');
	$dataservice->deleteSleep($sleepstart);
	loadEntryData($dataservice, getDayFromTimeStr($sleepstart));
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
