<?php

include_once('../src/SleepRecord.php');

class SleepRecordTest extends PHPUnit_Framework_TestCase {

	public function testNewSleepRecord() {

		$startTime = new DateTime("2015-12-01 08:00");
		$endTime = new DateTime("2015-12-01 08:15");
		$rec = new SleepRecord($startTime, $endTime);
		$this->assertEquals($startTime, $rec->getStartTime());
		$this->assertEquals($endTime, $rec->getEndTime());

	}

	public function testSleepDuration() {

		$startTime = new DateTime("2015-12-01 08:00");
		$endTime = new DateTime("2015-12-01 08:15");
		$rec = new SleepRecord($startTime, $endTime);
		$this->assertEquals(0.25, $rec->getDurationInHrs());

	}
}

