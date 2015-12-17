<?php

require "Day.php";

class ReportService {

	private $dataMapper;

	public function __construct($dataMapper) {
		$this->dataMapper = $dataMapper;
	}

	public function getBarCharReport() {
		$sleeps = $this->dataMapper->getAllSleepRecords();
		$day = new Day($sleeps, null, null);
		$sleepsSummarized = $day->getSummarizedSleeps();
	}

}
