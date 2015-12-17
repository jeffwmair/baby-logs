<?php

class DatasetConverter {

	private $datasets = Array();

	public function __construct($pSleepRows, $pDiaperRows, $pFeedRows) {
		foreach($pSleepRows as $sleepRow) {
			$ds = $this->getDatasetForDate(null);
		}
		foreach($pDiaperRows as $diaperRow) {
			$ds = $this->getDatasetForDate(null);
		}
		foreach($pFeedRows as $feedRow) {
			$ds = $this->getDatasetForDate(null);
		}
	}

	private function getDatasetForDate($date) {
		if (count($this->$datasets) == 0) return null;

		$ds = null;
		foreach($datasets as $dsRecord) {

		}
	}
	
}
