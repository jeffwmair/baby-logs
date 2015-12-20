<?php

/**
 * Represents a day.  Contains the sleeps, feedings, diaper changes, etc for a particular day.
 */
class Day {

	private $day;
	private $dayEnd;
	private $sleeps;
	private $sleepsPastMidnight;
	private $diapers;
	private $feeds;
	private $summarizedSleeps;

	public function __construct($day) {
		$this->day = new DateTime($day);
		$this->dayEnd = new DateTime("$day 23:59:59");
		$this->sleeps = array();
		$this->sleepsPastMidnight = array();
		$this->diapers = array();
		$this->feeds = array();
	}

	public function addSleepRecord($record) {
		array_push($this->sleeps, $record);
	}

	public function addPastMidnightSleep( $sleepRecord ) {
		array_push( $this->sleepsPastMidnight, $sleepRecord );
	}

	public function addDiaperRecord($record) {
		array_push($this->diapers, $record);
	}

	public function addFeedRecord($record) {
		array_push($this->feeds, $record);
	}

	public function getDay() {
		return $this->day;
	}

	public function getUninterruptedNightSleepTimeHrs() {

		$eveningSleeps = $this->getSummarizedSleeps();
		$afterMidnightSleeps = $this->summarizeSleeps($this->sleepsPastMidnight);

		$nightSleeps = array();
		foreach($eveningSleeps as $s) {
			$hr = $s->getStartTime()->format('H');
			if ( $hr >= 20 ) {
				array_push( $nightSleeps, $s );
			}
		}
		foreach($afterMidnightSleeps as $s) {
			array_push( $nightSleeps, $s );
		}

		$summarizedNightSleeps = $this->summarizeSleeps( $nightSleeps );

		$maxDuration = 0;
		foreach ($summarizedNightSleeps as $s ) {
			if ( $s->getDurationInHrs() > $maxDuration ) {
				$maxDuration = $s->getDurationInHrs();
			}
		}

		return $maxDuration;

	}

	public function getTotalSleepTimeHrs() {
		$hrs = 0.0;
		foreach($this->sleeps as $s) {
			$hrs += $s->getDurationInHrs();
		}
		return $hrs;
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
