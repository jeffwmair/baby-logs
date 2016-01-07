<?php

require_once(__DIR__.'/../domain/SleepRecord.php');
require_once(__DIR__.'/../domain/DiaperRecord.php');
require_once(__DIR__.'/../domain/FeedRecord.php');
require_once(__DIR__.'/../domain/Day.php');

class RecordQueryMapper {

	private $connection;

	function __construct($connection) {
		$this->connection = $connection;
	}

	private function createDayIfNotExists(&$days, $dayKey) {

		$day = null;
		if (!array_key_exists($dayKey, $days)) {
			$day = new Day($dayKey);
			$days["$dayKey"] = $day;
		}
		return $days["$dayKey"];

	}

	public function getAllDays() {

		$sql = "select id, start, end, DATE_FORMAT(start, '%Y-%m-%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() order by start ASC";
		$sleepRows  = getSqlResult($sql);

		$days = array();
		while ($row = @ mysql_fetch_array($sleepRows, MYSQL_ASSOC))  {
			$day = $this->createDayIfNotExists($days, $row['day']);
			$sleepRecord = new SleepRecord(new DateTime($row['start']), new DateTime($row['end']));
			$day->addSleepRecord($sleepRecord);

			/**
			 * if sleep start is between midnight and 7am, then add as night sleep to previous day
			 */
			$hr = $sleepRecord->getStartTime()->format('H');
			if ( $hr >= 00 && $hr <= 7 ) {
				// add to the previous day
				$prevDayDate = new DateTime();
				$prevDayDate->setTimestamp( $day->getDay()->getTimestamp() - ( 24 * 60 * 60 ) );
				$prevDay = $this->createDayIfNotExists($days, $prevDayDate->format('Y-m-d') );
				$prevDay->addPastMidnightSleep( $sleepRecord );
			}
		}

		$sql = "select time, DATE_FORMAT(time, '%Y-%m-%d') as day, entry_type, entry_value from baby_keyval WHERE time <= CURRENT_TIMESTAMP() order by time ASC";
		$rows  = getSqlResult($sql);

		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			$day = $this->createDayIfNotExists($days, $row['day']);
			switch ($row['entry_type']) {
				case "milk":
					$day->addMilkRecord( new FeedRecord( $row['time'], 'milk', $row['entry_value'] ) );
					break;
				case "formula":
					$day->addFormulaRecord( new FeedRecord( $row['time'], 'formula', $row['entry_value'] ) );
					break;
				case "diaper":
					$day->addDiaperRecord( new DiaperRecord( $row['time'], $row['entry_value'] ) );
					break;
			}
		}

		return $days;

	}

	public function getLatestDiaperRecord($diapertype) {
		$sql = "select time, entry_value from baby_keyval where entry_type = 'diaper' and entry_value = '$diapertype' and time <= CURRENT_TIMESTAMP() order by time DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new DiaperRecord( $row['time'], $row['entry_value'] );
		return $record;
	}


	public function getLatestSleepRecord() {
		$sql = "select id, start, end from baby_sleep where start <= CURRENT_TIMESTAMP() order by start DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new SleepRecord( new DateTime( $row['start'] ), new DateTime( $row['end'] ));
		return $record;
	}

	public function getLatestFeedRecord($feedType) {
		$sql = "select time, entry_value from baby_keyval where entry_type = '$feedType' and time <= CURRENT_TIMESTAMP() order by time DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new FeedRecord( new DateTime( $row['time'] ), $feedType, $row['entry_value'] );
		return $record;
	}


	public function getSleepRecord($time) {
		$sql = "select id, start, end from baby_sleep where start = TIMESTAMP('$time')";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new SleepRecord( new DateTime( $row['start'] ), new DateTime( $row['end'] ));
		return $record;
	}


	public function getValueItem($time, $type) {
		$sql = "select time, entry_value from baby_keyval where entry_type = '$type' and time = TIMESTAMP('$time')";	
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = null;
		if ($type == 'diaper') {
			$record = new DiaperRecord( $row['time'], $row['entry_value'] );
		}
		else if ($type == 'milk' || $type == 'formula') {
			$record = new FeedRecord( $row['time'], $type, $row['entry_value'] );
		}
		return $record;
	}

	/* helper to execute sql and deal with errors */
	private function getSqlResult($sql) {
		$res = mysql_query($sql, $this->connection);
		$err = mysql_error($conn);
		if ($err) {
			throw new Exception('SQL Error:' . $err);
		}
		return $res;
	}

}
