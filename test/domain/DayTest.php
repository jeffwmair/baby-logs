<?php

include_once(__DIR__.'/../../src/domain/Day.php');
include_once(__DIR__.'/../../src/domain/SleepRecord.php');

class DayTest extends PHPUnit_Framework_TestCase {

	public function testSleepSummarize() {

		$day = new Day('2015-12-01');
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00") ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00") ) );
 

		$sleepSummaries = $day->getSummarizedSleeps();
		$this->assertEquals(1, count($sleepSummaries));
		$summaryRecord = $sleepSummaries[0];
		$this->assertEquals( new DateTime("2015-12-01 08:00:00"), $summaryRecord->getStartTime() );
		$this->assertEquals( new DateTime("2015-12-01 08:30:00"), $summaryRecord->getEndTime() );
	}

	public function testSleepTotalTime() {

		$day = new Day( '2015-12-01' );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:00:00"), new DateTime("2015-12-01 08:15:00") ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:15:00"), new DateTime("2015-12-01 08:30:00") ) );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 08:30:00"), new DateTime("2015-12-01 08:45:00") ) );

		$this->assertEquals( 0.75, $day->getTotalSleepTimeHrs() );

	}

	public function testGetNightSleepDuration() {

		$day = new Day( '2015-12-01' );
		$day->addSleepRecord( new SleepRecord( new DateTime("2015-12-01 20:00:00"), new DateTime("2015-12-02 00:00:00") ) );
		$day->addPastMidnightSleep( new SleepRecord( new DateTime("2015-12-02 00:00:00"), new DateTime("2015-12-02 00:30:00") ) );
		$day->addPastMidnightSleep( new SleepRecord( new DateTime("2015-12-02 01:00:00"), new DateTime("2015-12-02 06:00:00") ) );

		$this->assertEquals( 5.0, $day->getUninterruptedNightSleepTimeHrs() );
	}

	public function testPooCount() {

		$day = new Day( '2015-01-01' );
		$day->addDiaperRecord( new DiaperRecord('2015-01-01 08:00', 1) );
		$day->addDiaperRecord( new DiaperRecord('2015-01-01 08:15', 2) );
		$day->addDiaperRecord( new DiaperRecord('2015-01-01 08:30', 3) );
		$this->assertEquals( 2, $day->getPooCount() );

	}

	public function testGetFeedAmounts() {

		$day = new Day( '2015-01-01' );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:00', 'milk', '100') );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:10', 'milk', '100') );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:20', 'milk', 'BR') );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:30', 'milk', 'BL') );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:40', 'milk', 'BR') );
		$day->addMilkRecord( new FeedRecord('2015-01-01 08:50', 'milk', '300') );
		$this->assertEquals( 500, $day->getBottleMlAmount() );
		$this->assertEquals( 3, $day->getBreastFeedCount() );


	}


}
