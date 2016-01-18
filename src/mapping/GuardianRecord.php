<?php

class GuardianRecord {

	public $fullname;
	public $email;
	public $baby;

	public function __construct($fullname, $email, $baby) {
		$this->fullname = $fullname;
		$this->email = $email;
		$this->baby = $baby;
	}

}
