<?php
class DataService {

	private $modMapper = null;
	private $queryMapper = null;

	public function __construct( $modMapper, $queryMapper ) { 
		$this->modMapper = $modMapper;
		$this->queryMapper = $queryMapper;
	}
	
	public function addValueItem($type, $value, $time) {

		$record = new KeyValueRecord($time, $type, $value);	
		$this->modMapper->saveKeyValRecord($record);

	}


	public function deleteValueItem($time, $type) {
		/*
		$record = $this->queryMapper->getValueItem($time, $type);
		$this->modMapper->deleteValueItem($record);
		 */
		throw new Exception("not implemented");
	}


	public function deleteSleep($time) {
		$record = $this->queryMapper->getSleepRecord($time);
		$this->modMapper->deleteSleepRecord($record);
	}


	public function addSleep($startTime, $endTime) {
		$record = new SleepRecord( new DateTime($startTime), new DateTime($endTime) );
		$this->modMapper->saveSleepRecord($record);
	}

}
