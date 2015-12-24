<?php

require_once('../src/DateService.php');

class DateServiceTest extends PHPUnit_Framework_TestCase {

	public function testGetStartOfWeekTest() {

		$svc = new DateService();

		// sunday
		$a = $svc->getStartOfWeekForDate( new DateTime('2015-12-06 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $a );

		$b = $svc->getStartOfWeekForDate( new DateTime('2015-12-07 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $b );

		$c = $svc->getStartOfWeekForDate( new DateTime('2015-12-08 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $c );
		
		$d = $svc->getStartOfWeekForDate( new DateTime('2015-12-09 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $d );

		$e = $svc->getStartOfWeekForDate( new DateTime('2015-12-10 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $e );

		$f = $svc->getStartOfWeekForDate( new DateTime('2015-12-11 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $f );

		$g = $svc->getStartOfWeekForDate( new DateTime('2015-12-12 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-06 00:00:00'), $g );

		$h = $svc->getStartOfWeekForDate( new DateTime('2015-12-13 00:00:00') );
		$this->assertEquals( new DateTime('2015-12-13 00:00:00'), $h );
		
	}

}
