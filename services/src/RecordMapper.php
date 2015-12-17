<?php

require "SleepRecord.php";

class RecordMapper {

	private $connection;

	function __construct($connection) {
		$this->connection = $connection;
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
