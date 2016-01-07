<?php

class KeyValueRecord  {
	private $type;
	private $value;
	private $time;

	public function __construct($time, $type, $value) {
		$this->time = $time;
		$this->type = $type;
		$this->value = $value;
	}
}
