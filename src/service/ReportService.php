<?php

class ReportService {

	private $dataMapper;
	private $dateService;
	private $dailyDays;

	public function __construct($dailyDays, $dataMapper, $dateService) {
		$this->dataMapper = $dataMapper;
		$this->dateService = $dateService;
		$this->dailyDays = $dailyDays;
	}

	public function getDashboardData() {

		/** TODO: cleanup this mess */

		$dayToday = new DateTime();
		$now = $dayToday->getTimestamp();
		$startToday = $dayToday->format('Y-m-d 00:00:00');
		$endToday = $dayToday->format('Y-m-d 23:59:59');

		// result variables
		$bottleMlToday = 0;
		$formulaMlToday = 0;
		$breastCountToday = 0;
		$napCount = 0;
		$napDurationHrs = 0;
		$peeMinutesAgo = 0;
		$poosToday = 0;
		$pooMinutesAgo = 0;

		$sleepEndMinutesAgo = '';
		$feedEndMinutesAgo = '';

		$peeRecordTimeFmt = '';
		$sleepRecordTimeFmt = '';
		$feedRecordTimeFmt = '';
		$pooRecordTimeFmt = '';

		$feedStatus = 3;
		$peeStatus = 3;
		$sleepStatus = 3;
		$pooStatus = 3;

		// today's data object
		$dayArr = $this->dataMapper->getDays($startToday, $endToday);
		$todayDateFormat = $dayToday->format('Y-m-d');

		if (array_key_exists("$todayDateFormat", $dayArr)) {

			$day = $dayArr["$todayDateFormat"];

			// get most recent milk, sleep, pee, poo
			$milkRecordTime = $this->dataMapper->getLatestFeedRecord('milk')->time;
			$fmlaRecordTime = $this->dataMapper->getLatestFeedRecord('formula')->time;
			$milkRecordTimeFmt = $milkRecordTime->format("g:ia");
			$fmlaRecordTimeFmt = $fmlaRecordTime->format("g:ia");
			$milkEndMinutesAgo = $this->getMinutesAgoFromTime($now, $milkRecordTime->getTimestamp());
			$fmlaEndMinutesAgo = $this->getMinutesAgoFromTime($now, $fmlaRecordTime->getTimestamp());

			$feedEndMinutesAgo = $milkEndMinutesAgo;
			$feedRecordTimeFmt = $milkRecordTimeFmt;

			// take whichever feed type is newer; that's the most recent feeding
			if ($fmlaEndMinutesAgo < $feedEndMinutesAgo) {
				$feedEndMinutesAgo = $fmlaEndMinutesAgo;
				$feedRecordTimeFmt = $fmlaRecordTimeFmt;
			}

			if ($feedEndMinutesAgo > (60*3)) {
				$feedStatus = 3;
			}
			else if ($feedEndMinutesAgo > (60*2)) {
				$feedStatus = 2;
			}
			else {
				$feedStatus = 1;
			}

			$sleepRecordTime = $this->dataMapper->getLatestSleepRecord()->getEndTime();
			$sleepRecordTimeFmt = $sleepRecordTime->format("g:ia");
			$sleepEndMinutesAgo = $this->getMinutesAgoFromTime($now, $sleepRecordTime->getTimestamp());
			$sleepStatus = 0;
			if ($sleepEndMinutesAgo > (60*2)) {
				$sleepStatus = 3;
			}
			else if ($sleepEndMinutesAgo > (60*1.5)) {
				$sleepStatus = 2;
			}
			else {
				$sleepStatus = 1;
			}


			$peeRecordTime = $this->dataMapper->getLatestDiaperRecord(1)->time;
			$peeRecordTimeFmt = $peeRecordTime->format("g:ia");
			$peeMinutesAgo = $this->getMinutesAgoFromTime($now, $peeRecordTime->getTimestamp());
			$peeStatus = 0;
			if ($peeMinutesAgo > (60*3.5)) {
				$peeStatus = 3;
			}
			else if ($peeMinutesAgo > (60*2.75)) {
				$peeStatus = 2;
			}
			else {
				$peeStatus = 1;
			}


			$pooRecordTime = $this->dataMapper->getLatestDiaperRecord(2)->time;
			$pooRecordTimeFmt = $pooRecordTime->format("g:ia");
			$pooMinutesAgo = $this->getMinutesAgoFromTime($now, $pooRecordTime->getTimestamp());
			$pooStatus = 0;
		/*
		if ($pooMinutesAgo > (60*7)) {
			$pooStatus = 3;
		}
		 */
			if ($pooMinutesAgo > (60*5)) {
				$pooStatus = 2;
			}
			else {
				$pooStatus = 1;
			}

			// naps
			$napCount = 0;
			$napDurationHrs = 0;
			foreach($day->getDaytimeSleeps() as $daySleep) {
				$napCount += 1;
				$napDurationHrs += $daySleep->getDurationInHrs();
			}

			count($day->getDaytimeSleeps());


			$reportDataDaily = $this->getBarChartReport()['daily'];
			$latestDay = $reportDataDaily[count($reportDataDaily)-1];
			$bottleMlToday = $latestDay['milkMl'] . "ml";
			$formulaMlToday = $latestDay['formulaMl'] . "ml";
			$breastCountToday = $latestDay['breastCount'];
			$poosToday = $latestDay['poos'];
		}

	
		// construct the array of data to be returned
		$data = array(
			"feed" => array(
				"milkMlToday" => $bottleMlToday,
				"formulaMlToday" => $formulaMlToday,
				"breastCountToday" => $breastCountToday,
				"prev" => array("status" => "$feedStatus", "time" => "$feedRecordTimeFmt", "minutesAgo"=>"$feedEndMinutesAgo")),
			"sleep" => array(
				"naps" => array("count" => $napCount, "duration" => $napDurationHrs),
				"prev" => array("status" => "$sleepStatus", "time" => "$sleepRecordTimeFmt", "minutesAgo" => "$sleepEndMinutesAgo")),
			"pee" => array(
				"prev" => array("status" => "$peeStatus", "time" => "$peeRecordTimeFmt", "minutesAgo" => "$peeMinutesAgo")),
			"poo" => array(
				"todayCount" => $poosToday,
				"prev" => array("status" => "$pooStatus", "time" => "$pooRecordTimeFmt", "minutesAgo" => "$pooMinutesAgo"))
			);

		return $data;
	}

	private function getMinutesAgoFromTime($nowReference, $time) {
		return ($nowReference - $time) / 60.0;
	}

	/**
	 * Get an array of summarized data for the report
	 */
	public function getBarChartReport() {

		$days = $this->dataMapper->getAllDays();
		$reportDaily = $this->getDailyReportData( $this->dailyDays, $days );
		$reportWeekly = $this->getWeeklyReportData( $days );

		$report = array(
			"daily" => $reportDaily,
			"weekly" => $reportWeekly 
		);

		return $report;

	}


	private function getDailyReportData($nDays, $days) {

		// reverse initially so we can easily get the last N days
		$daysReversed = array_reverse($days);

		$reportDaily = array();
		$i = 1;

		foreach($daysReversed as $day) {

			// only include this many
			if ($i > $nDays) break;

			// create a summary entry array
			$daySummary = array(
				"day" => $day->getDay()->format('Y-m-d 00:00:00'),
				"totalSleepHrs" => $day->getTotalSleepTimeHrs(),
				"nightSleepHrs" => $day->getUninterruptedNightSleepTimeHrs(),
				"poos" => $day->getPooCount(),
				"milkMl" => $day->getMilkMlAmount(),
				"formulaMl" => $day->getFormulaMlAmount(),
				"breastCount" => $day->getBreastFeedCount()
			);

			array_push($reportDaily, $daySummary);
			$i++;
		}

		return array_reverse( $reportDaily );

	}


	private function getWeeklyReportData( $days ) {

		$reportData = array();

		$prevWeekSummaryStart = null;
		$i = 0;
		$totalSleepHrs = 0;
		$nightSleepHrs = 0;
		$poos = 0;
		$bottleMl = 0;
		$formulaMl = 0;
		$breastCount = 0;

		$day = null;
		foreach( $days as $day ) {

			$daystring = $day->getDay()->format("Y-m-d");

			// first time only
			if ( $prevWeekSummaryStart == null ) {
				$prevWeekSummaryStart = $this->dateService->getStartOfWeekForDate( $day->getDay() );
			}

			// summarize if we are on a new week
			$weekSummaryStart = $this->dateService->getStartOfWeekForDate( $day->getDay() );
			if ( $weekSummaryStart->getTimestamp() != $prevWeekSummaryStart->getTimestamp() && $i > 0 ) {
				$summary = $this->summarizeWeek( $prevWeekSummaryStart, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $formulaMl, $breastCount, $i );
				array_push($reportData, $summary);
				$totalSleepHrs = 0; $nightSleepHrs = 0; $poos = 0; $bottleMl = 0; $formulaMl = 0; $breastCount = 0; $i = 0;
				$prevWeekSummaryStart = $weekSummaryStart;
			}

			// aggregate the numbers
			$totalSleepHrs += $day->getTotalSleepTimeHrs();
			$nightSleepHrs += $day->getUninterruptedNightSleepTimeHrs();
			$poos += $day->getPooCount();
			$bottleMl += $day->getMilkMlAmount();
			$formulaMl += $day->getFormulaMlAmount();
			$breastCount += $day->getBreastFeedCount();
			$i++;

		}

		// summarize the last week or week fragment
		if ( $i > 0 ) {
			$summary = $this->summarizeWeek( $prevWeekSummaryStart, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $formulaMl, $breastCount, $i );
			array_push($reportData, $summary);
			$i = 0;
			$prevWeekSummaryStart = $weekSummaryStart;
		}

		return $reportData;
	}

	private function getWeekStart( $day ) {

	}


	private function getPreviousSunday( $day ) {
		// subtract from the given date until we pass 1 sunday and reach another
		$foundFirstSunday = false;
		$foundSecondSunday = false;
		$tempDay = new DateTime();
		$tempDay->setTimestamp( $day->getTimestamp() );
		while ( ! $foundSecondSunday ) {

			$tempDay->setTimestamp( $tempDay->getTimestamp() - (24 * 60 * 60) );
			if ( $tempDay->format("D") == "Sun" ) {
				$foundSecondSunday = true;
			}	

		}

		return $tempDay;
	}


	private function summarizeWeek($sundayDate, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $formulaMl, $breastCount, $dayCount) {

		$xdate = $sundayDate->format("Y-m-d 00:00:00");

		$roundPrecision = 1;
		$summary = array(
			"day" => $sundayDate->format("Y-m-d 00:00:00"),
			"totalSleepHrs" => round($totalSleepHrs / $dayCount, $roundPrecision),
			"nightSleepHrs" => round($nightSleepHrs / $dayCount, $roundPrecision),
			"poos" => round($poos / $dayCount, $roundPrecision),
			"milkMl" => round($bottleMl / $dayCount, $roundPrecision),
			"formulaMl" => round($formulaMl / $dayCount, $roundPrecision),
			"breastCount" => round($breastCount / $dayCount, $roundPrecision)
		);
		return $summary;

	}


	private function getWeekNumber( $date ) {
		$nextDay = new DateTime();
		$nextDay->setTimestamp( $date->getTimestamp() + ( 24 * 60  * 60 ) );
		return $nextDay->format("W");	
	}
}
