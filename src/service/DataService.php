<?php
class DataService {

	private $modMapper = null;
	private $queryMapper = null;
	private $babyid;

	public function __construct( $modMapper, $queryMapper, $babyid ) { 
		$this->modMapper = $modMapper;
		$this->queryMapper = $queryMapper;
		$this->babyid = $babyid;
	}
	
	public function addValueItem($type, $value, $time) {
		$record = new KeyValueRecord($time, $type, $value, $this->babyid);	
		$this->modMapper->saveKeyValRecord($record);
	}

	public function deleteValueItem($time, $type, $val) {
		$record = $this->queryMapper->getValueItem($time, $type, $val);
		$this->modMapper->deleteValueItem($record);
	}

	public function deleteValueItemByType($time, $type) {
		$record = $this->queryMapper->getValueItem($time, $type, null);
		$this->modMapper->deleteValueItem($record);
	}

	public function deleteSleep($time) {
		$record = $this->queryMapper->getSleepRecord($time);
		$this->modMapper->deleteSleepRecord($record);
	}

	public function addSleep($startTime, $endTime) {
		$record = new SleepRecord( new DateTime($startTime), new DateTime($endTime), $this->babyid );
		$this->modMapper->saveSleepRecord($record);
	}

	public function getEntryDataJson($day) {
		$sleeps = $this->queryMapper->getSleepsForDayJson($day);
		$milkFeeds = $this->queryMapper->getValueItemsForDayJson($day, 'milk');
		$fmlaFeeds = $this->queryMapper->getValueItemsForDayJson($day, 'formula');
		$solidFoodFeeds = $this->queryMapper->getValueItemsForDayJson($day, 'solid');
		$diapers = $this->queryMapper->getValueItemsForDayJson($day, 'diaper');

		$itemArr = array();
		$itemArr["sleeps"] = $sleeps;
		$itemArr["milkfeeds"] = $milkFeeds;
		$itemArr["fmlafeeds"] = $fmlaFeeds;
		$itemArr["solidfoodfeeds"] = $solidFoodFeeds;
		$itemArr["diapers"] = $diapers;

		return $itemArr;
	}

}
