<?php

/**
 * Represents a diaper change
 */
class DiaperRecord {

	public $time;
	public $type;

	public function __construct( $time, $type ) {
		if ( $type < 1 || $type > 3 ) {
			throw new Exception("Invalid diaper type: $type");
		}
		$this->time = $time;
		$this->type = $type;
	}
}
