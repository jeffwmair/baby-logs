<?php

class BabyRecord {

	public $id;
	public $fullname;
	public $gender;
	public $birthdate;

	public function __construct($id, $fullname, $gender, $birthdate) {
		$this->id = $id;
		$this->fullname = $fullname;
		$this->gender = $gender;
		$this->birthdate = $birthdate;
	}
}

