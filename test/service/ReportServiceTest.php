<?php

require_once(__DIR__.'/../../src/mapping/RecordQueryMapper.php');
require_once(__DIR__.'/../../src/service/ReportService.php');

class ReportServiceTest extends PHPUnit_Framework_TestCase {

	function testWeekNov1appearsOnlyOnce() {

		// arrange
		//
		$days = array();

		$day1 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day1->method('getDay')->willReturn( new DateTime( '2015-10-25' ) );

		$day2 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day2->method('getDay')->willReturn( new DateTime( '2015-10-26' ) );

		$day3 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day3->method('getDay')->willReturn( new DateTime( '2015-10-27' ) );

		$day4 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day4->method('getDay')->willReturn( new DateTime( '2015-10-28' ) );

		$day5 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day5->method('getDay')->willReturn( new DateTime( '2015-10-29' ) );

		$day6 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day6->method('getDay')->willReturn( new DateTime( '2015-10-30' ) );

		$day7 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day7->method('getDay')->willReturn( new DateTime( '2015-10-31' ) );

		$day8 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day8->method('getDay')->willReturn( new DateTime( '2015-11-01' ) );

		$day9 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day9->method('getDay')->willReturn( new DateTime( '2015-11-02' ) );

		// sunday (wk1)
		$days['2015-10-25'] = $day1;
		// monday (wk1)
		$days['2015-10-26'] = $day2;
		// tuesday (wk1)
		$days['2015-10-27'] = $day3;
		// wednesday (wk1)
		$days['2015-10-28'] = $day4;
		// thursday (wk1)
		$days['2015-10-29'] = $day5;
		// friday (wk1)
		$days['2015-10-30'] = $day6;
		// saturday (wk1)
		$days['2015-10-31'] = $day7;
		// sunday (wk2)
		$days['2015-11-01'] = $day8;
		// monday (wk2)
		$days['2015-11-02'] = $day9;

		$mapperStub = $this->getMockBuilder('RecordQueryMapper')->disableOriginalConstructor()->getMock();
		$mapperStub->method('getAllDays')->willReturn($days);
		$dateService = new DateService();
		$service = new ReportService(15, $mapperStub, $dateService);

		// act
		//
		$report = $service->getBarChartReport();

		// assert
		//
		$reportWeekly = $report["weekly"];
		//var_dump($reportWeekly);

		$this->assertEquals( 2, count($reportWeekly) );
		$wkSummary1 = $reportWeekly[0];
		$this->assertEquals( '2015-10-25 00:00:00', $wkSummary1['day'] );
		$wkSummary2 = $reportWeekly[1];
		$this->assertEquals( '2015-11-01 00:00:00', $wkSummary2['day'] );

	}

	function testWeeklyAverage() {

		// arrange
		//
		$days = array();

		$day1 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day1->method('getDay')->willReturn( new DateTime( '2015-12-12' ) );
		$day1->method('getUninterruptedNightSleepTimeHrs')->willReturn( 8.25 );

		$day2 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day2->method('getDay')->willReturn( new DateTime( '2015-12-13' ) );
		$day2->method('getUninterruptedNightSleepTimeHrs')->willReturn( 9.75 );

		$day3 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day3->method('getDay')->willReturn( new DateTime( '2015-12-14' ) );
		$day3->method('getUninterruptedNightSleepTimeHrs')->willReturn( 9.5 );

		$day4 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day4->method('getDay')->willReturn( new DateTime( '2015-12-15' ) );
		$day4->method('getUninterruptedNightSleepTimeHrs')->willReturn( 9.75 );

		$day5 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day5->method('getDay')->willReturn( new DateTime( '2015-12-16' ) );
		$day5->method('getUninterruptedNightSleepTimeHrs')->willReturn( 6 );

		$day6 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day6->method('getDay')->willReturn( new DateTime( '2015-12-17' ) );
		$day6->method('getUninterruptedNightSleepTimeHrs')->willReturn( 8.75 );

		$day7 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day7->method('getDay')->willReturn( new DateTime( '2015-12-18' ) );
		$day7->method('getUninterruptedNightSleepTimeHrs')->willReturn( 9 );

		$day8 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day8->method('getDay')->willReturn( new DateTime( '2015-12-19' ) );
		$day8->method('getUninterruptedNightSleepTimeHrs')->willReturn( 9.25 );

		$day9 = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$day9->method('getDay')->willReturn( new DateTime( '2015-12-20' ) );
		$day9->method('getUninterruptedNightSleepTimeHrs')->willReturn( 8.75 );


		$days['2015-12-12'] = $day1;
		$days['2015-12-13'] = $day2;
		$days['2015-12-14'] = $day3;
		$days['2015-12-15'] = $day4;
		$days['2015-12-16'] = $day5;
		$days['2015-12-17'] = $day6;
		$days['2015-12-18'] = $day7;
		$days['2015-12-19'] = $day8;
		$days['2015-12-20'] = $day9;

		$mapperStub = $this->getMockBuilder('RecordQueryMapper')->disableOriginalConstructor()->getMock();
		$mapperStub->method('getAllDays')->willReturn($days);
		$dateService = new DateService();
		$service = new ReportService(15, $mapperStub, $dateService);

		// act
		//
		$report = $service->getBarChartReport();

		// assert
		//
		$reportWeekly = $report["weekly"];

		$this->assertEquals( 3, count($reportWeekly) );
		$wkSummary1 = $reportWeekly[0];
		$this->assertEquals( '2015-12-06 00:00:00', $wkSummary1['day'] );
		$wkSummary2 = $reportWeekly[1];
		$this->assertEquals( '2015-12-13 00:00:00', $wkSummary2['day'] );
		$wkSummary3 = $reportWeekly[2];
		$this->assertEquals( '2015-12-20 00:00:00', $wkSummary3['day'] );

		$this->assertEquals( 8.3, $wkSummary1['nightSleepHrs']);
		$this->assertEquals( 8.9, $wkSummary2['nightSleepHrs']);
		$this->assertEquals( 8.8, $wkSummary3['nightSleepHrs']);
	}

	function testWeeklyReport() {
		
		// arrange
		//
		$days = array();

		$wk1Sun = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$wk1Sun->method('getDay')->willReturn( new DateTime( '2015-12-13' ) );
		$wk1Sun->method('getTotalSleepTimeHrs')->willReturn( 14 );
		$wk1Sun->method('getUninterruptedNightSleepTimeHrs')->willReturn( 8 );
		$wk1Sun->method('getPooCount')->willReturn( 10 );
		$wk1Sun->method('getBottleMlAmount')->willReturn( 750 );
		$wk1Sun->method('getBreastFeedCount')->willReturn( 5 );

		$wk1Mon = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$wk1Mon->method('getDay')->willReturn( new DateTime( '2015-12-14' ) );
		$wk1Mon->method('getTotalSleepTimeHrs')->willReturn( 16 );
		$wk1Mon->method('getUninterruptedNightSleepTimeHrs')->willReturn( 10 );
		$wk1Mon->method('getPooCount')->willReturn( 12 );
		$wk1Mon->method('getBottleMlAmount')->willReturn( 850 );
		$wk1Mon->method('getBreastFeedCount')->willReturn( 7 );

		$wk2Mon = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$wk2Mon->method('getDay')->willReturn( new DateTime( '2015-12-21' ) );
		$wk2Mon->method('getTotalSleepTimeHrs')->willReturn( 18 );
		$wk2Mon->method('getUninterruptedNightSleepTimeHrs')->willReturn( 12 );
		$wk2Mon->method('getPooCount')->willReturn( 4 );
		$wk2Mon->method('getBottleMlAmount')->willReturn( 300 );
		$wk2Mon->method('getBreastFeedCount')->willReturn( 4 );

		$wk2Tue = $this->getMockBuilder('Day')->disableOriginalConstructor()->getMock();
		$wk2Tue->method('getDay')->willReturn( new DateTime( '2015-12-22' ) );
		$wk2Tue->method('getTotalSleepTimeHrs')->willReturn( 16 );
		$wk2Tue->method('getUninterruptedNightSleepTimeHrs')->willReturn( 11 );
		$wk2Tue->method('getPooCount')->willReturn( 5 );
		$wk2Tue->method('getBottleMlAmount')->willReturn( 400 );
		$wk2Tue->method('getBreastFeedCount')->willReturn( 8 );

		$days['2015-12-13'] = $wk1Sun;
		$days['2015-12-14'] = $wk1Mon;
		$days['2015-12-21'] = $wk2Mon;
		$days['2015-12-22'] = $wk2Tue;

		$mapperStub = $this->getMockBuilder('RecordQueryMapper')->disableOriginalConstructor()->getMock();
		$mapperStub->method('getAllDays')->willReturn($days);
		$dateService = new DateService();
		$service = new ReportService(15, $mapperStub, $dateService);

		// act
		//
		$report = $service->getBarChartReport();

		// assert
		//
		$reportWeekly = $report["weekly"];
		$expectedWeeks = 2;
		$this->assertEquals( $expectedWeeks, count($reportWeekly) );
		
		// get the summary records
		$wkSummary1 = $reportWeekly[0];
		$wkSummary2 = $reportWeekly[1];

		$this->assertEquals( '2015-12-13 00:00:00', $wkSummary1['day'] );
		$this->assertEquals( 15, $wkSummary1['totalSleepHrs']);
		$this->assertEquals( 9, $wkSummary1['nightSleepHrs'] );
		$this->assertEquals( 11, $wkSummary1['poos'] );
		$this->assertEquals( 800, $wkSummary1['bottleMl'] );
		$this->assertEquals( 6, $wkSummary1['breastCount'] );

		$this->assertEquals( '2015-12-20 00:00:00', $wkSummary2['day'] );
		$this->assertEquals( 17, $wkSummary2['totalSleepHrs']);
		$this->assertEquals( 11.5, $wkSummary2['nightSleepHrs'] );
		$this->assertEquals( 4.5, $wkSummary2['poos'] );
		$this->assertEquals( 350, $wkSummary2['bottleMl'] );
		$this->assertEquals( 6, $wkSummary2['breastCount'] );
		


	}

	function testDailyReport() {
		
		// arrange
		//
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

		$mapperStub = $this->getMockBuilder('RecordQueryMapper')->disableOriginalConstructor()->getMock();
		$mapperStub->method('getAllDays')->willReturn($days);
		$dateService = new DateService();
		$service = new ReportService( 15, $mapperStub, $dateService);

		// act
		//
		$report = $service->getBarChartReport();

		// assert
		//
		$toplevelElements = 2;
		$this->assertEquals($toplevelElements, count($report));

		$reportDaily = $report["daily"];

		// one entry for each day
		$this->assertEquals(2, count($reportDaily));

		// get the summary records
		$daySummary1 = $reportDaily[0];
		$daySummary2 = $reportDaily[1];
		
		$this->assertEquals('2000-01-01 00:00:00', $daySummary1['day']);
		$this->assertEquals(14, $daySummary1['totalSleepHrs']);
		$this->assertEquals(8, $daySummary1['nightSleepHrs']);
		$this->assertEquals(10, $daySummary1['poos']);
		$this->assertEquals(750, $daySummary1['bottleMl']);
		$this->assertEquals(5, $daySummary1['breastCount']);

		$this->assertEquals('2000-01-02 00:00:00', $daySummary2['day']);
		$this->assertEquals(16, $daySummary2['totalSleepHrs']);
		$this->assertEquals(10, $daySummary2['nightSleepHrs']);
		$this->assertEquals(12, $daySummary2['poos']);
		$this->assertEquals(850, $daySummary2['bottleMl']);
		$this->assertEquals(7, $daySummary2['breastCount']);
		
	}

}
