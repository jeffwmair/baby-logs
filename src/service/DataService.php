<?php
class DataService {

	private $insertMapper = null;

	public function __construct( $insertMapper ) { 
		$this->insertMapper = $insertMapper;
	}
	
	public function addValueItem($type, $value, $time) {

		//TODO: split this into two methods
		$record = null;
		if ($type == 'diaper') {
			$record = new DiaperRecord($time, $value);	
			$this->insertMapper->saveDiaperRecord( $record );

		}
		else {
			$record = new FeedRecord($time, $value);	
			$this->insertMapper->saveFeedRecord( $record );
		}

	}


	public function addSleep($startTime, $endTime) {
		$record = new SleepRecord( new DateTime($startTime), new DateTime($endTime) );
		$this->insertMapper->saveSleepRecord($record);
	}

}
