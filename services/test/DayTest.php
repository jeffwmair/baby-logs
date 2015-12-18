<?php

include_once('../src/Day.php');
include_once('../src/SleepRecord.php');

class DayTest extends PHPUnit_Framework_TestCase {

	public function testSleepSummarize() {
		$sleeps = array();
		$diapers = array();
		$feeds = array();

		array_push($sleeps, new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00") ));
		array_push($sleeps, new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00") ));
		$day = new Day(null, $sleeps, $diapers, $feeds);

		$sleepSummaries = $day->getSummarizedSleeps();
		$this->assertEquals(1, count($sleepSummaries));
		$summaryRecord = $sleepSummaries[0];
		$this->assertEquals( new DateTime("2015-12-01 08:00:00"), $summaryRecord->getStartTime() );
		$this->assertEquals( new DateTime("2015-12-01 08:30:00"), $summaryRecord->getEndTime() );
	}

	public function testSleepTotalTime() {

		$sleeps = array();
		array_push( $sleeps, new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00") ) );
		array_push( $sleeps, new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00") ) );
		array_push( $sleeps, new SleepRecord( new DateTime("2015-12-01 08:30:00"), new DateTime("2015-12-01 08:45:00") ) );

		$day = new Day( null, $sleeps, null, null );

		$this->assertEquals( 0.75, $day->getTotalSleepTimeHrs() );

	}

}
