<?php

require_once(__DIR__.'/../domain/SleepRecord.php');
require_once(__DIR__.'/../domain/DiaperRecord.php');
require_once(__DIR__.'/../domain/FeedRecord.php');
require_once(__DIR__.'/../domain/Day.php');

class RecordMapper {

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

		$days = array();

		$sql = "select id, start, end, DATE_FORMAT(start, '%Y-%m-%d') as day from baby_sleep order by start ASC";
		$sleepRows  = getSqlResult($sql);

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

		$sql = "select time, DATE_FORMAT(time, '%Y-%m-%d') as day, entry_type, entry_value from baby_keyval order by time ASC";
		$rows  = getSqlResult($sql);

		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			$day = $this->createDayIfNotExists($days, $row['day']);
			switch ($row['entry_type']) {
				case "feed":
					$day->addFeedRecord( new FeedRecord( $row['time'], $row['entry_value'] ) );
					break;
				case "diaper":
					$day->addDiaperRecord( new DiaperRecord( $row['time'], $row['entry_value'] ) );
					break;
			}
		}

		return $days;

	}

	/**
	 * Gets all the sleep records as objects
	 */
	public function getAllSleepRecords() {
		$sql = "select id, start, end from baby_sleep order by start ASC";
		$rows  = getSqlResult($sql);
		$res = Array();
		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			$sleepRecord = new SleepRecord( new DateTime( $row['start'] ), new DateTime( $row['end'] ));
			array_push($res, $sleepRecord);
		}
		return $res;
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
