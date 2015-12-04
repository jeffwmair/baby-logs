<?php
	require "utils.php";
	require "Dataset.php";
	$method = get('action');

	/*
	 * if there is an unended sleep, the end the sleep;
	 * If the sleep started on the previous day, we need to end it that day at 23:59:59,
	 * then start and end another record for this new day.
	 */

	function get($index) {
		if (!isset($_GET[$index])) {
			return NULL;
		}

		return $_GET[$index];
	}

	switch($method) {
		case 'addvalue':
			addValueItem(get('type'), get('value'), get('time'));
			break;
		case 'removevalue':
			removeValueItem(get('type'), get('value'), get('time'));
			break;
		case 'sleep':
			enterSleep(get('sleepstart'), get('sleepend'));
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
		case 'diagnostics':
			showDiagnostics();
			break;
		default:
			echo "Unknown action:'$method'";
	}


	function showDiagnostics() {
		$sql = "select current_timestamp;";
		$res = getSqlResult($sql);
		$rows = convertSqlRowsToArray($res);
		$arr = $rows[0];
		$curTs = $arr['current_timestamp'];

		echo "mysql current_timestamp: $curTs<br>";

		$now_time = date('G:i:s');
		echo "now: $now_time";
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

	function removeValueItem($type, $value, $time) {
		$sql = "delete from baby_keyval where entry_type = '$type' and time = '$time' and entry_value = '$value';";
		getSqlResult($sql);
		loadData(getDayFromTimeStr($time));
	}

	function addValueItem($type, $val, $time) {
		$sql = "insert into baby_keyval(time, entry_type, entry_value) values('$time', '$type', '$val');";
		$res = getSqlResult($sql);
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

	function enterSleep($sleepstart, $sleepend) {
		$sql = "insert into baby_sleep(start, end) values (TIMESTAMP('$sleepstart'), TIMESTAMP('$sleepend'));";
		$res = getSqlResult($sql);
		loadData(getDayFromTimeStr($sleepstart));
	}

	function getDayFromTimeStr($time) {
		return substr($time, 0, 10);
	}
	
?>
