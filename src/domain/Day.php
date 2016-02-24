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
	private $milkfeeds;
	private $fmlafeeds;
	private $summarizedSleeps;
	private $babyid;


	/**
	 * Constructor
	 */
	public function __construct($day, $babyid) {

		$this->day = new DateTime($day);
		$this->babyid = $babyid;
		$this->dayEnd = new DateTime("$day 23:59:59");
		$this->sleeps = array();
		$this->sleepsPastMidnight = array();
		$this->diapers = array();
		$this->milkfeeds = array();
		$this->fmlafeeds = array();
		$this->solidfeeds = array();

	}


	public function addSleepRecord($record) {
		array_push($this->sleeps, $record);
	}


	/**
	 * Add a sleep record that is not strictly part of this day
	 * but counted as this day's night sleep.
	 */
	public function addPastMidnightSleep( $sleepRecord ) {
		array_push( $this->sleepsPastMidnight, $sleepRecord );
	}

	public function addRecord($record) {
		switch($record->type) {
		case 'diaper':
			array_push($this->diapers, $record);
			break;
		case 'milk':
			array_push($this->milkfeeds, $record);
			break;
		case 'formula':
			array_push($this->fmlafeeds, $record);
			break;
		case 'solid':
			array_push($this->solidfeeds, $record);
			break;
		}
	}


	/**
	 * What day is it?
	 */
	public function getDay() {
		return $this->day;
	}


	/**
	 * how many poopie diapers
	 */
	public function getPooCount() {
		$count = 0;
		foreach($this->diapers as $diaper) {
			if ($diaper->value == 'poo') {
				$count++;
			}
		}
		return $count;
	}

	/**
	 * solid food
	 */
	public function getSolidMlAmount() {
		$ml = 0;
		foreach($this->solidfeeds as $feed) {
			$ml += floatval($feed->value);
		}
		return $ml;
	}


	/**
	 * How many millilitres of formula in the day
	 */
	public function getFormulaMlAmount() {
		$ml = 0;
		foreach($this->fmlafeeds as $feed) {
			$ml += floatval($feed->value);
		}
		return $ml;
	}


	/**
	 * How many millilitres of bottle-fed milk in the day
	 */
	public function getMilkMlAmount() {
		$ml = 0;
		foreach($this->milkfeeds as $feed) {
			if (is_numeric($feed->value)) {
				$ml += floatval($feed->value);
			}
		}
		return $ml;
	}


	/**
	 * How many times was fed directly at the breast in the day
	 */
	public function getBreastFeedCount() {
		$num = 0;
		foreach($this->milkfeeds as $feed) {
			if ( $feed->value == 'BR' || $feed->value == 'BL' ) {
				$num++;
			}
		}
		return $num;
	}


	public function getDaytimeSleeps() {
		$allSleeps = $this->getSummarizedSleeps();
		$daySleeps = array();
		foreach($allSleeps as $s) {
			$hr = $s->getStartTime()->format('H');
			if ($hr >= 8 && $hr <= 18) {
				array_push($daySleeps, $s);
			}	
		}
		return $daySleeps;
	}


	public function getUninterruptedNightSleepTimeHrs() {

		// these aren't really eveningSleeps yet
		$eveningSleeps = $this->getSummarizedSleeps();
		$afterMidnightSleeps = $this->summarizeSleeps($this->sleepsPastMidnight);

		$nightSleeps = array();
		foreach($eveningSleeps as $s) {
			$hr = $s->getStartTime()->format('H');
			// TODO: un-hardcode this sleep start hour
			if ( $hr >= 19 ) {
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
				$sleepRecord = new SleepRecord($s->getStartTime(), $s->getEndTime(), $this->babyid);
			}
			else {
				if ($s->getStartTime() == $sleepRecord->getEndTime()) {
					$sleepRecord->setEndTime($s->getEndTime());
				}
				else {
					// new sleep block, so push the old one
					array_push($records, $sleepRecord);
					$sleepRecord = new SleepRecord($s->getStartTime(), $s->getEndTime(), $this->babyid);
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
