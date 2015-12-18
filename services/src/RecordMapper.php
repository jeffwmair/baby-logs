<?php

require "SleepRecord.php";
require "DiaperRecord.php";
require "FeedRecord.php";

class RecordMapper {

	private $connection;

	function __construct($connection) {
		$this->connection = $connection;
	}

	public function getAllDays() {

		$sleeps = $this->getAllSleepRecords();
		$diapers = $this->getAllDiaperRecords();
		$feeds = $this->getAllFeedRecords();

		/* get all the distinct days; just getting from baby_keyval is enough because he surely eats every day */
		$sql = "select distinct(DATE_FORMAT(time, '%Y-%m-%d')) from baby_keyval order by time asc";
		$rows  = getSqlResult($sql);
		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			// day object for each day
		}

	}

	/**
	 * Gets all the sleep records as objects
	 */
	public function getAllSleepRecords() {
		$sql = "select id, start, end from baby_sleep order by start ASC";
		$rows  = getSqlResult($sql);
		$res = Array();
		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			$sleepRecord = new SleepRecord($row['start'], $row['end']);
			array_push($res, $sleepRecord);
		}
		return $res;
	}

	// time entry_type, entry_value (diaper, feed)
	//

	public function getAllDiaperRecords() {
		$diapers = array();
		$records = $this->getAllKeyValRecords();
		foreach( $records as $record ) {
			if ( $record['entry_type'] == 'diaper' ) {
				array_push($diapers, new DiaperRecord( $record['time'], $record['entry_value'] ) );
			}
		}
		return $diapers;
	}

	public function getAllFeedRecords() {
		$feeds = array();
		$records = $this->getAllKeyValRecords();
		foreach( $records as $record ) {
			if ( $record['entry_type'] == 'feed' ) {
				array_push($feeds, new FeedRecord( $record['time'], $record['entry_value'] ) );
			}
		}
		return $feeds;
	}

	private $keyvalRecords = null;
	private function getAllKeyValRecords() {

		if ($this->keyvalRecords == null) {

			$this->keyvalRecords = array();
			$sql = "select time, entry_type, entry_value from baby_keyval order by time ASC";
			$rows  = getSqlResult($sql);
			while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
				array_push($this->keyvalRecords, $row);
			}

		}

		return $this->keyvalRecords;
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
