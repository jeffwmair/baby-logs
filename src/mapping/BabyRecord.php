<?php

class BabyRecord {
	public $fullname;
	public $gender;
	public $birthdate;

	public function __construct($fullname, $gender, $birthdate) {
		$this->fullname = $fullname;
		$this->gender = $gender;
		$this->birthdate = $birthdate;
	}
}

