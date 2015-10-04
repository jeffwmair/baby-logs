<?php 

class DatasetGenerator {

	private $datasets;
	public function __construct($sleepRows, $feedRows, $diaperRows) {
		$this->validateSleepDates($sleepRows);
		$this->datasets = array();

		foreach($sleepRows as $sleep) {
			$this->addSleep($sleep);
		}
		foreach($feedRows as $feed) {
			$this->addFeed($feed);
		}
		foreach($diaperRows as $diaper) {
			$this->addDiaper($diaper);
		}
	}

	private function addSleep($sleep) { }
	private function addFeed($feed) { }
	private function addDiaper($diaper) { }

	/**
	 * make sure there aren't any sleep records that start and end on different days
	 */
	private function validateSleepDates($sleepRows) {
		foreach($sleepRows as $sleepRow) {
			$starttime = strtotime($sleepRow['start']);
			$endtime = strtotime($sleepRow['end']);
			$id = $sleepRow['id'];
			if ($sleepRow['end'] != NULL && !$starttime == $endtime) {
				throw new Exception("Start and end dates of sleep with id '".$id."' are not on the same day!");
			}
		}
	}

	public function getDatasets() {
		return $this->datasets;
	}

}

class DatasetList {
	private $arr;
	public function __construct() {
		$arr = array();
	}

	public function add($ds) {
		array_push($this->arr, $ds);
	}

	/**
	 * does this DatasetList already contain the same dataset
	 */
	private function contains($ds) {
		foreach($this->arr as $existing_ds) {
			if ($ds->hasSameDate($existing_ds)) {
				return true;
			}
		}
		return false;
	}

}

class Dataset {

	private $datetime, $sleeps, $feeds, $diapers;
	public function __construct($datetime) {
		$sleeps = array();
		$feeds = array();
		$diapers = array();
		$this->datetime = $datetime;
		var_dump($this->datetime);
	}

	public function addSleep($sleep) {
		array_push($this->sleeps, $sleep);
	}
	public function addFeed($feed) {
		array_push($this->feeds, $feed);
	}
	public function addDiaper($diaper) {
		array_push($this->diapers, $diaper);
	}

	public function hasSameDate($otherDs) {

	}

	public function getSleeps() {
		return $this->sleeps;
	}

	public function getFeeds() {
		return $this->feeds;
	}

	public function getDiapers() {
		return $this->diapers;
	}

}
