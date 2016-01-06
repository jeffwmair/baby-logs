<?php

class FeedRecord {

	public $time;
	public $value;
	public $type;

	public function __construct($time, $type, $value) {
		$this->time = $time;
		$this->type = $type;
		$this->value = $value;
	}
}
