<?php
class RecordInsertMapper {

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
		throw new Exception("Not yet implemented");
	}


	private function saveKeyValRecord( $time, $type, $val ) {
		$formattedTime = $time->format('Y-m-d h:i:s');
		$sql = "insert into baby_keyval(time, entry_type, entry_value) values('$formattedTime', '$type', '$val');";
		$res = mysql_query($sql, $this->con);
		$err = mysql_error($this->con);
		if ($err) {
			throw new Exception($err);
		}
	}

}
