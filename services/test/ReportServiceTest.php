<?php

require_once('../src/RecordMapper.php');
require_once('../src/ReportService.php');

class ReportServiceTest extends PHPUnit_Framework_TestCase {

	function testCorrectNumberOfDaysReturned() {
		
		// arrange
		$days = array();
		$day1 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day1->method('getDay')->willReturn( new DateTime( '2000-01-01' ) );
		$day1->method('getTotalSleepTimeHrs')->willReturn( 14 );
		$day1->method('getUninterruptedNightSleepTimeHrs')->willReturn( 8 );
		$day1->method('getPooCount')->willReturn( 10 );
		$day1->method('getBottleMlAmount')->willReturn( 750 );
		$day1->method('getBreastFeedCount')->willReturn( 5 );
		$day2 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day2->method('getDay')->willReturn( new DateTime( '2000-01-02' ) );
		$day2->method('getTotalSleepTimeHrs')->willReturn( 16 );
		$day2->method('getUninterruptedNightSleepTimeHrs')->willReturn( 10 );
		$day2->method('getPooCount')->willReturn( 12 );
		$day2->method('getBottleMlAmount')->willReturn( 850 );
		$day2->method('getBreastFeedCount')->willReturn( 7 );
		$days['2000-01-01'] = $day1;
		$days['2000-01-02'] = $day2;

		$mapperStub = $this->getMockBuilder('RecordMapper')->disableOriginalConstructor()->getMock();
		$mapperStub->method('getAllDays')->willReturn($days);
		$service = new ReportService($mapperStub);

		// act
		$report = $service->getBarCharReport();

		// assert
		$toplevelElements = 2;
		$this->assertEquals($toplevelElements, count($report));

		$reportDaily = $report["daily"];
		$reportWeekly = $report["weekly"];

		// one entry for each day
		$this->assertEquals(2, count($reportDaily));

		// test one of the day summaries
		$daySummary1 = $reportDaily[0];
		$daySummary2 = $reportDaily[1];
		
		$this->assertEquals('2000-01-01', $daySummary1['day']);
		$this->assertEquals(14, $daySummary1['totalSleepHrs']);
		$this->assertEquals(8, $daySummary1['nightSleepHrs']);
		$this->assertEquals(10, $daySummary1['poos']);
		$this->assertEquals(750, $daySummary1['bottleMl']);
		$this->assertEquals(5, $daySummary1['breastCount']);

		$this->assertEquals('2000-01-02', $daySummary2['day']);
		$this->assertEquals(16, $daySummary2['totalSleepHrs']);
		$this->assertEquals(10, $daySummary2['nightSleepHrs']);
		$this->assertEquals(12, $daySummary2['poos']);
		$this->assertEquals(850, $daySummary2['bottleMl']);
		$this->assertEquals(7, $daySummary2['breastCount']);
		
	}

	function testFoo() {
	}
	function testBar() {
	}

}
