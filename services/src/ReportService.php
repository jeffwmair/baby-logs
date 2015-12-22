<?php

class ReportService {

	private $dataMapper;

	public function __construct($dataMapper) {
		$this->dataMapper = $dataMapper;
	}

	/**
	 * Get an array of summarized data for the report
	 */
	public function getBarCharReport() {
		$days = $this->dataMapper->getAllDays();
		$daysReversed = array_reverse($days);

		/*
		 * last 4
		 * a b c d* e* f* g*
		 *
		 */

		$reportDaily = array();
		$maxDaily = 10;
		$i = 1;

		foreach($daysReversed as $day) {

			// only include this many
			if ($i > $maxDaily) break;

			// create a summary entry array
			$daySummary = array(
				"day" => $day->getDay()->format('Y-m-d'),
				"totalSleepHrs" => $day->getTotalSleepTimeHrs(),
				"nightSleepHrs" => $day->getUninterruptedNightSleepTimeHrs(),
				"poos" => $day->getPooCount(),
				"bottleMl" => $day->getBottleMlAmount(),
				"breastCount" => $day->getBreastFeedCount()
			);

			array_push($reportDaily, $daySummary);
			$i++;
		}

		$reportWeekly = array();

		$report = array();
		$report["daily"] = array_reverse($reportDaily);
		$report["weekly"] = array_reverse($reportWeekly);

		/**
		 *
		 * report:
		 * 		daily (10)
		 * 			total sleep
		 * 			night sleep uninterrupted
		 * 			bottle ml
		 * 			breast count
		 * 		weekly (~)
		 * 			total sleep
		 * 			night sleep uninterrupted
		 * 			bottle ml
		 * 			breast count
		 */

		return $report;

	}

}
