<?php
class RecordModifyMapper {

	private $con = null;

	public function __construct( $con ) {
		$this->con = $con;
	}

	public function deleteSleepRecord($record) {
		$this->validateRecordCanBeEditedBasedOnDate( $record->getStartTime() );
		$starttime = $record->getStartTime()->format('Y-m-d G:i:s');
		$sql = "delete from baby_sleep where start = TIMESTAMP('$starttime')";
		$this->executeSql($sql);
	}

	public function deleteValueItem($record) {
		$this->validateRecordCanBeEditedBasedOnDate( $record->time );
		$type = $record->type;
		$val = $record->value;
		$time = $record->time->format('Y-m-d G:i:s');
		$sql = "delete from baby_keyval where entry_type = '$type' and time = TIMESTAMP('$time') and entry_value = '$val'";
		$this->executeSql($sql);
	}


	public function saveSleepRecord( $record ) {
		$this->validateRecordCanBeEditedBasedOnDate( $record->getStartTime() );
		$start = $record->getStartTime()->format('Y-m-d G:i:s');
		$end = $record->getEndTime()->format('Y-m-d G:i:s');
		$sql = "insert into baby_sleep(start, end) values (TIMESTAMP('$start'), TIMESTAMP('$end'));";
		$this->executeSql($sql);
	}


	public function saveKeyValRecord( $record ) {
		$this->validateRecordCanBeEditedBasedOnDate( $record->time );
		// delete first just in case
		$this->deleteValueItem($record);
		$formattedTime = $record->time->format('Y-m-d G:i:s');
		$type = $record->type;
		$val = $record->value;
		$sql = "insert into baby_keyval(time, entry_type, entry_value) values('$formattedTime', '$type', '$val');";
		$this->executeSql($sql);
	}

	private function executeSql($sql) {
		$res = mysql_query($sql, $this->con);
		$err = mysql_error($this->con);
		if ($err) {
			throw new Exception($err);
		}
	}

	private function validateRecordCanBeEditedBasedOnDate( $date ) {
		$maxDays = 2;
		// if the date is older than 2 days, don't allow editing
		$daysAgo = (new DateTime())->getTimestamp() - ($maxDays * 24 * 60 * 60);
		if ( $date->getTimestamp() < $daysAgo ) {
			throw new Exception("The date is more than $maxDays days old, you cannot change the data now");
		}
	}

}
