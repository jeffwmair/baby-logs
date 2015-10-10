<?php
	require "utils.php";
	require "Dataset.php";
	$method = $_GET['action'];

	/*
	 * if there is an unended sleep, the end the sleep;
	 * If the sleep started on the previous day, we need to end it that day at 23:59:59,
	 * then start and end another record for this new day.
	 */

	switch($method) {
		case 'addvalue':
			addValueItem($_GET['type'], $_GET['value'], $_GET['time']);
			//header('Location: ../submitted.html');
			break;
		case 'removevalue':
			removeValueItem($_GET['type'], $_GET['value'], $_GET['time']);
		case 'sleep':
			startSleep($_GET['sleepstart'], $_GET['sleepend']);
			//header('Location: ../submitted.html');
			break;
		case 'removesleep':
			removeSleep($_GET['sleepstart']);
			break;
		case 'endsleep':
			endSleep($_GET['sleepend']);
			//header('Location: ../submitted.html');
			break;
		case 'feed':
			feed($_GET['time'], $_GET['amount']);
			break;
		case 'loaddata':
			$optionalDay = $_GET['day'];
			loadData($optionalDay);
			break;
		case 'loaddata2':
			loadData2();
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

	function loadData2() {
		$sleeps = convertSqlRowsToArray(getSqlResult("select * from baby_sleep order by start"));
		$feeds = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'feed' order by time"));
		$diapers = convertSqlRowsToArray(getSqlResult("select * from baby_keyval where entry_type = 'diaper' order by time"));
		$dsGenerator = new DatasetGenerator($sleeps, $feeds, $diapers);
		echo "done";

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
	}

	function addValueItem($type, $val, $time) {
		$sql = "insert into baby_keyval(time, entry_type, entry_value) values('$time', '$type', '$val');";
		$res = getSqlResult($sql);
	}

	function feed($time, $amount) {
		if ($amount == 'none') {
			getSqlResult("delete from baby_keyval where entry_type = 'feed' and time = '$time';");
			return;
		}

		getSqlResult("insert into baby_keyval (time, entry_type, entry_value) values('$time', 'feed', '$amount');");

	}

	function endSleep($sleepend) {
		// if the most recent sleep has ended, we assume this was an mistaken end, so we don't do anything
		$sql = "select * from baby_sleep order by start desc limit 1;";
		$res = getSqlResult($sql);
		$records = convertSqlRowsToArray($res);
		$record = $records[0];
		$endtime = $record['end'];
		if ($endtime != NULL) return;


		// most recent record has not ended

		$rowId = $record['id'];
		$starttimestamp = strtotime($record['start']);
		$startdate_day = date('d', $starttimestamp);
		$startdate_mon = date('m', $starttimestamp);
		$startdate_yr = date('Y', $starttimestamp);

		$now_day = date('d');
		$now_mon = date('m');
		$now_yr = date('Y');
		$now_time = date('G:i:s');

		if ($sleepend != NULL) {
			$phpTimeEnd = strtotime($sleepend);
			$now_day = date('d', $phpTimeEnd);
			$now_mon = date('m', $phpTimeEnd);
			$now_yr = date('Y', $phpTimeEnd);
			$now_time = date('G:i:s', $phpTimeEnd);
		}

		if ($startdate_day != $now_day) {
			/* Most recent record started on the previous day, we must end it
			 * on the previous day, then start a new record AND end that new one on this day, now
			 */
			$sql = "update baby_sleep set start = start, end = TIMESTAMP('$startdate_yr-$startdate_mon-$startdate_day 23:59:59') where id = $rowId;";
			getSqlResult($sql);
			$sql = "insert baby_sleep (start, end) values (TIMESTAMP('$now_yr-$now_mon-$now_day 00:00:00'), TIMESTAMP('$now_yr-$now_mon-$now_day $now_time'));";
			getSqlResult($sql);
		}
		else {
			// most recent record started today, so just close it out
			$sql = "update baby_sleep set start = start, end = TIMESTAMP('$now_yr-$now_mon-$now_day $now_time') where id = $rowId;";
			getSqlResult($sql);
		}
	}

	function removeSleep($sleepstart) {
		$sql = "delete from baby_sleep where start =  TIMESTAMP('$sleepstart');";
		$res = getSqlResult($sql);
	}

	function startSleep($sleepstart, $sleepend) {
		// if the last sleep wasn't ended, we just assume it was a false start, and we don't bother updating its end time

		$sql = "";
		if ($sleepstart == NULL & $sleepend == NULL) {
			// just start sleep now
			$sql = "insert into baby_sleep(start) values (CURRENT_TIMESTAMP);";
		}
		else if ($sleepend == NULL) {
			// start sleep sometime in the past
			$sql = "insert into baby_sleep(start) values (TIMESTAMP('$sleepstart'));";
		}
		else if ($sleepstart == NULL) {
			// only the end is given, so end it there
			endSleep($sleepend);
		}
		else { 
			// both start and end given
			$sql = "insert into baby_sleep(start, end) values (TIMESTAMP('$sleepstart'), TIMESTAMP('$sleepend'));";
		}

		//echo "$sql";
		$res = getSqlResult($sql);
	}
	
?>
