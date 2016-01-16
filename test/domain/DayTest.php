<?php

include_once(__DIR__.'/../../src/domain/Day.php');
include_once(__DIR__.'/../../src/mapping/SleepRecord.php');

class DayTest extends PHPUnit_Framework_TestCase {

	public function testSleepSummarize() {

		$day = new Day('2015-12-01', 1);
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00"), 1 ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00"), 1 ));
 

		$sleepSummaries = $day->getSummarizedSleeps();
		$this->assertEquals(1, count($sleepSummaries));
		$summaryRecord = $sleepSummaries[0];
		$this->assertEquals( new DateTime("2015-12-01 08:00:00"), $summaryRecord->getStartTime() );
		$this->assertEquals( new DateTime("2015-12-01 08:30:00"), $summaryRecord->getEndTime() );
	}

	public function testSleepTotalTime() {

		$day = new Day( '2015-12-01', 1 );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00"), 1 ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00"), 1 ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:30:00"), new DateTime("2015-12-01 08:45:00"), 1 ) );

		$this->assertEquals( 0.75, $day->getTotalSleepTimeHrs() );

	}

	public function testGetNightSleepDuration() {

		$day = new Day( '2015-12-01', 1 );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 20:00:00"), new DateTime("2015-12-02 00:00:00"), 1 ) );
		$day->addPastMidnightSleep( new SleepRecord( new DateTime("2015-12-02 00:00:00"), new DateTime("2015-12-02 00:30:00"), 1 ) );
		$day->addPastMidnightSleep( new SleepRecord( new DateTime("2015-12-02 01:00:00"), new DateTime("2015-12-02 06:00:00"), 1 ) );

		$this->assertEquals( 5.0, $day->getUninterruptedNightSleepTimeHrs() );
	}

	public function testPooCount() {

		$day = new Day( '2015-01-01', 1 );
		$day->addRecord( new KeyValueRecord('2015-01-01 08:00', 'diaper', 1, 1) );
		$day->addRecord( new KeyValueRecord('2015-01-01 08:15', 'diaper', 2, 1) );
		$day->addRecord( new KeyValueRecord('2015-01-01 08:30', 'diaper', 3, 1) );
		$this->assertEquals( 2, $day->getPooCount() );

	}

	public function testGetFeedAmounts() {

		$day = new Day( '2015-01-01', 1 );
		$day->addRecord( new KeyValueRecord('2015-01-01 08:00', 'milk', '100', 1) );
		$day->addRecord( new KeyValueRecord('2015-01-01 08:10', 'milk', '100', 1));
		$day->addRecord( new KeyValueRecord('2015-01-01 08:20', 'milk', 'BR', 1));
		$day->addRecord( new KeyValueRecord('2015-01-01 08:30', 'milk', 'BL', 1));
		$day->addRecord( new KeyValueRecord('2015-01-01 08:40', 'milk', 'BR', 1));
		$day->addRecord( new KeyValueRecord('2015-01-01 08:50', 'milk', '300', 1));
		$this->assertEquals( 500, $day->getMilkMlAmount() );
		$this->assertEquals( 3, $day->getBreastFeedCount() );

	}

	public function testGetNaps() {
		$day = new Day('2015-01-01', 1);
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-01-01 00:00:00"), new DateTime("2015-01-01 08:00:00"), 1 ) );

		// nap 1 - separate 15 minute records
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-01-01 9:15:00"), new DateTime("2015-01-01 09:30:00"), 1 ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-01-01 9:30:00"), new DateTime("2015-01-01 9:45:00"), 1 ) );

		// nap 2 - single record
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-01-01 12:00:00"), new DateTime("2015-01-01 14:00:00"), 1 ) );

		$this->assertEquals(2, count($day->getDaytimeSleeps()));


	}


}
