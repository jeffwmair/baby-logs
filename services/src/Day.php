<?php

/**
 * Represents a day.  Contains the sleeps, feedings, diaper changes, etc for a particular day.
 */
class Day {

	private $sleeps;
	private $diapers;
	private $feeds;
	private $summarizedSleeps;

	public function __construct($sleeps, $diapers, $feeds) {
		$this->sleeps = $sleeps;
		$this->diapers = $diapers;
		$this->feeds = $feeds;
	}

	public function getNightSleepTimeHrs() {
		throw new Exception("not yet implemented");
	}

	public function getTotalSleepTimeHrs() {
		$hrs = 0.0;
		foreach($this->sleeps as $s) {
			$hrs += $s->getDurationInHrs();
		}
		return $hrs;
	}

	public function getNightSleeps() {
		throw new Exception("not yet implemented");
	}

	public function getSummarizedSleeps() {

		if (!isset($this->summarizedSleeps)) {
			$this->summarizedSleeps = $this->summarizeSleeps($this->sleeps);
		}

		return $this->summarizedSleeps;
	}

	/**
	 * Summarize the $sleeps records by merging those that are contiguous
	 */
	private function summarizeSleeps($sleeps) {

		$records = array();
		$sleepRecord = null;
		foreach($sleeps as $s) {
			if ($sleepRecord == null) {
				$sleepRecord = new SleepRecord($s->getStartTime(), $s->getEndTime());
			}
			else {
				if ($s->getStartTime() == $sleepRecord->getEndTime()) {
					$sleepRecord->setEndTime($s->getEndTime());
				}
				else {
					// new sleep block, so push the old one
					array_push($records, $sleepRecord);
					$sleepRecord = new SleepRecord($s->getStartTime(), $s->getEndTime());
				}
			}
		}

		// TODO: could clean this up a little
		if ($sleepRecord != null && (count($records) == 0 || $sleepRecord->getStartTime() != $records[count($records)-1]->getStartTime())) {
			array_push($records, $sleepRecord);	
		}

		return $records;
	}
}
