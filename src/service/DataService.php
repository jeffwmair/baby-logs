<?php
class DataService {

	private $insertMapper = null;

	public function __construct( $insertMapper ) { 
		$this->insertMapper = $insertMapper;
	}
	
	function addValueItem($type, $value, $time) {

		$record = null;
		if ($type == 'diaper') {
			$record = new DiaperRecord($time, $value);	
			$this->insertMapper->saveDiaperRecord( $record );

		}
		else {
			$record = new FeedRecord($time, $value);	
			$this->insertMapper->saveFeedRecord( $record );
		}

	}

}
