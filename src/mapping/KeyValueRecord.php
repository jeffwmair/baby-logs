<?php

class KeyValueRecord  {
	public $type;
	public $value;
	public $time;

	public function __construct($time, $type, $value) {
		$this->time = new DateTime($time);
		$this->type = $type;
		$this->value = $value;
	}
}
