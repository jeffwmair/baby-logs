<?php

class SleepRecord {

	private $startTime;
	private $endTime;
	private $babyid;

	function __construct($startTime, $endTime, $babyid) {
		$this->startTime = $startTime;
		$this->endTime = $endTime;
		$this->babyid = $babyid;
	}

	public function setStartTime($startTime) {
		$this->startTime = $startTime;
	}

	public function getStartTime() {
		return $this->startTime;
	}

	public function setEndTime($endTime) {
		$this->endTime = $endTime;
	}

	public function getEndTime() {
		return $this->endTime;
	}

	public function getBabyId() {
		return $this->babyid;
	}

	public function getDurationInHrs() {

		$interval = $this->startTime->diff($this->endTime);
		$hrs = $interval->days * 24;
		$hrs += $interval->h;
		$hrs += $interval->i / 60.0;

		return $hrs;

	}

}
