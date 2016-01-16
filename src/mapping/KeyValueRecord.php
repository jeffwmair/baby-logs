<?php

class KeyValueRecord  {
	public $type;
	public $value;
	public $time;
	public $babyid;

	public function __construct($time, $type, $value, $babyid) {
		$this->time = new DateTime($time);
		$this->type = $type;
		$this->value = $value;
		$this->babyid = $babyid;
	}
}
