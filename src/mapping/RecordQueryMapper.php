<?php

require_once(__DIR__.'/../mapping/SleepRecord.php');
require_once(__DIR__.'/../mapping/KeyValueRecord.php');
require_once(__DIR__.'/../mapping/BabyRecord.php');
require_once(__DIR__.'/../mapping/GuardianRecord.php');
require_once(__DIR__.'/../domain/Day.php');

class RecordQueryMapper {

	private $connection;
	private $babyid;

	function __construct($connection, $babyid) {
		$this->connection = $connection;
		$this->babyid = $babyid;
	}


	private function createDayIfNotExists(&$days, $dayKey) {

		$day = null;
		if (!array_key_exists($dayKey, $days)) {
			$day = new Day($dayKey, $this->babyid);
			$days["$dayKey"] = $day;
		}
		return $days["$dayKey"];

	}

	public function getAllDays() {
		return $this->getDays(null, null);
	}

	public function getDays($start, $end) {

		$dateFilter = "";
		if (isset($start)) {
			$dateFilter = " and start >= TIMESTAMP('$start') ";
		}
		if (isset($end)) {
			$dateFilter .= " and end <= TIMESTAMP('$end') ";

		}
		$sql = "select id, start, end, DATE_FORMAT(start, '%Y-%m-%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() $dateFilter order by start ASC";
		$sleepRows  = getSqlResult($sql);

		$days = array();
		while ($row = @ mysql_fetch_array($sleepRows, MYSQL_ASSOC))  {
			$day = $this->createDayIfNotExists($days, $row['day']);
			$sleepRecord = new SleepRecord(new DateTime($row['start']), new DateTime($row['end']), $this->babyid);
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
			$day->addRecord(new KeyValueRecord($row['time'], $row['entry_type'], $row['entry_value'], $this->babyid));
		}

		return $days;

	}

	public function getLatestDiaperRecord($diapertype) {
		$sql = "select time, entry_value, entry_type from baby_keyval where entry_type = 'diaper' and entry_value = '$diapertype' and time <= CURRENT_TIMESTAMP() order by time DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new KeyValueRecord( $row['time'], $row['entry_type'], $row['entry_value'], $this->babyid );
		return $record;
	}


	public function getLatestSleepRecord() {
		$sql = "select id, start, end from baby_sleep where start <= CURRENT_TIMESTAMP() order by start DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new SleepRecord( new DateTime( $row['start'] ), new DateTime( $row['end'] ), $this->babyid);
		return $record;
	}

	public function getLatestFeedRecord($feedType) {
		$sql = "select time, entry_value from baby_keyval where entry_type = '$feedType' and time <= CURRENT_TIMESTAMP() order by time DESC limit 1";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new KeyValueRecord( $row['time'], $feedType, $row['entry_value'], $this->babyid );
		return $record;
	}


	public function getSleepRecord($time) {
		$sql = "select id, start, end from baby_sleep where start = TIMESTAMP('$time')";
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new SleepRecord( new DateTime( $row['start'] ), new DateTime( $row['end'] ), $this->babyid);
		return $record;
	}


	public function getValueItem($time, $type, $optionalValue) {
		$sqlOptional = '';
		if (isset($optionalValue)) {
			$sqlOptional = " and entry_value = '$optionalValue'";
		}
		$sql = "select time, entry_type, entry_value from baby_keyval where entry_type = '$type' and time = TIMESTAMP('$time') $sqlOptional";	
		$rows  = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$record = new KeyValueRecord($row['time'], $row['entry_type'], $row['entry_value'], $this->babyid);
		return $record;
	}

	public function getValueItemsForDayJson($day, $type) {
		$sql = "select time, entry_value, entry_type from baby_keyval where entry_type = '$type' and time between '$day' and '$day 23:59:59'";
		$rows = getSqlResult($sql);
		$items = convertSqlRowsToArray($rows);
		return $items;
	}

	public function getSleepsForDayJson($day) {
		$sql = "select * from baby_sleep where start >= '$day' and start <= '$day 23:59:59' order by start";
		$rows = getSqlResult($sql);
		$items = convertSqlRowsToArray($rows);
		return $items;
	}


	/**
	 * Gets a GuardianRecord from the DB, by email address
	 **/
	public function getGuardianByEmailAddress($email) {
		$sql = "select g.fullname as guardianname, g.email, b.fullname as babyname, b.gender, b.birthdate from guardian g join baby b on g.babyid = b.id where g.email = '$email'";
		$rows = getSqlResult($sql);
		$guardian = null;
		while ($row = @ mysql_fetch_array($rows, MYSQL_ASSOC))  {
			$baby = new BabyRecord($row['babyname'], $row['gender'], $row['birthdate']);
			$guardian = new GuardianRecord($row['guardianname'], $row['email'], $baby);
		}
		return $guardian;
	}

	public function sessionIsValid($token) {
		$sql = "select token from usersession where token = '$token' and expiration > now()";
		$rows = getSqlResult($sql);
		$row = @ mysql_fetch_array($rows, MYSQL_ASSOC);
		$result = isset($row) && $row != false;
		return $result;
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
