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

		$now = (new DateTime())->getTimestamp();

		// get most recent feed, sleep, pee, poo
		$feedRecord = $this->dataMapper->getLatestFeedRecord();
		$feedEndMinutesAgo = $this->getMinutesAgoFromTime($now, $feedRecord->time->getTimestamp());
		
		$sleepRecord = $this->dataMapper->getLatestSleepRecord();
		$sleepEndMinutesAgo = $this->getMinutesAgoFromTime($now, $sleepRecord->getEndTime()->getTimestamp());

		$peeRecord = $this->dataMapper->getLatestDiaperRecord(1);
		$peeMinutesAgo = $this->getMinutesAgoFromTime($now, $peeRecord->time->getTimestamp());

		$pooRecord = $this->dataMapper->getLatestDiaperRecord(2);
		$pooMinutesAgo = $this->getMinutesAgoFromTime($now, $pooRecord->time->getTimestamp());

		$data = array(
			"feed" => array(
				"prev" => array("minutesAgo"=>"$feedEndMinutesAgo","amtInMl"=>"170","breast"=>""),
				"next" => array("minutesUntil"=>"9999")),
			"sleep" => array(
				"prev" => array("minutesAgo" => "$sleepEndMinutesAgo"),
				"next" => array("minutesUntil" => "9999")),
			"pee" => array(
				"prev" => array("minutesAgo" => "$peeMinutesAgo"),
				"next" => array("minutesUntil" => "9999")),
			"poo" => array(
				"prev" => array("minutesAgo" => "$pooMinutesAgo"),
				"next" => array("minutesUntil" => "9999"))
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
				"bottleMl" => $day->getBottleMlAmount(),
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
				$summary = $this->summarizeWeek( $prevWeekSummaryStart, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $breastCount, $i );
				array_push($reportData, $summary);
				$totalSleepHrs = 0; $nightSleepHrs = 0; $poos = 0; $bottleMl = 0; $breastCount = 0; $i = 0;
				$prevWeekSummaryStart = $weekSummaryStart;
			}

			// aggregate the numbers
			$totalSleepHrs += $day->getTotalSleepTimeHrs();
			$nightSleepHrs += $day->getUninterruptedNightSleepTimeHrs();
			$poos += $day->getPooCount();
			$bottleMl += $day->getBottleMlAmount();
			$breastCount += $day->getBreastFeedCount();
			$i++;

		}

		// summarize the last week or week fragment
		if ( $i > 0 ) {
			$summary = $this->summarizeWeek( $prevWeekSummaryStart, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $breastCount, $i );
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
				//$foundSecondSunday = $foundFirstSunday;
				//$foundFirstSunday = true;
				$foundSecondSunday = true;
			}	

		}

		return $tempDay;
	}


	private function summarizeWeek($sundayDate, $totalSleepHrs, $nightSleepHrs, $poos, $bottleMl, $breastCount, $dayCount) {

		$xdate = $sundayDate->format("Y-m-d 00:00:00");

		$roundPrecision = 1;
		$summary = array(
			"day" => $sundayDate->format("Y-m-d 00:00:00"),
			"totalSleepHrs" => round($totalSleepHrs / $dayCount, $roundPrecision),
			"nightSleepHrs" => round($nightSleepHrs / $dayCount, $roundPrecision),
			"poos" => round($poos / $dayCount, $roundPrecision),
			"bottleMl" => round($bottleMl / $dayCount, $roundPrecision),
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
