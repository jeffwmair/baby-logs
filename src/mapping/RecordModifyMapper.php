<?php
class RecordModifyMapper {

	private $con = null;

	public function __construct( $con ) {
		$this->con = $con;
	}


	public function saveFeedRecord( $record ) {
		$this->saveKeyValRecord( $record->time, 'feed', $record->value );
	}


	public function saveDiaperRecord( $record ) {
		$this->saveKeyValRecord( $record->time, 'diaper', $record->type );
	}


	public function saveSleepRecord( $record ) {
		$this->validateRecordCanBeEditedBasedOnDate( $record->getStartTime() );
		$start = $record->getStartTime()->format('Y-m-d G:i:s');
		$end = $record->getEndTime()->format('Y-m-d G:i:s');
		$sql = "insert into baby_sleep(start, end) values (TIMESTAMP('$start'), TIMESTAMP('$end'));";
		$this->executeSql($sql);
	}


	private function saveKeyValRecord( $time, $type, $val ) {
		$this->validateRecordCanBeEditedBasedOnDate( $time );
		$formattedTime = $time->format('Y-m-d G:i:s');
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
		// if the date is older than 3 days, don't allow editing
		$threeDaysAgo = (new DateTime())->getTimestamp() - (3 * 24 * 60 * 60);
		if ( $date->getTimestamp() < $threeDaysAgo ) {
			throw new Exception("The date is more than 3 days old, you cannot change the data now");
		}
		
	}

}
