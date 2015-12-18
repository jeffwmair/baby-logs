<?php

class FeedRecord {

	public $time;
	public $value;

	public function __construct($time, $value) {
		$this->time = $time;
		$this->value = $value;
	}
}
