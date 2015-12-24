<?php

class DateService {

	private $ONE_DAY_IN_SEC = 24*60*60;

	public function getStartOfWeekForDate( $date ) {

		if ( $date->format("D") == "Sun" ) {
			return $date;
		}

		$shiftedDate = $this->subtract1Day( $date );
		while ( $shiftedDate->format("D") != "Sun" ) {
			$shiftedDate = $this->subtract1Day( $shiftedDate );
		}

		return $shiftedDate;

	}

	private function subtract1Day( $date ) {
		$prevDay = new DateTime();
		$prevDay->setTimestamp( $date->getTimestamp() - $this->ONE_DAY_IN_SEC );
		return $prevDay;
	}
}
