import unittest
from datetime import datetime
from app.domain.day import Day, DayGenerator
from app.domain.sleep import SleepSet
from app.db_records import SleepRecord

class DayTest(unittest.TestCase):

	def test_generate_days_correct_night_sleep(self):
		# night sleep day 1
		sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 2, 0, 0, 0), '2016-01-01')
		# overnight sleep day 2
		sleep2 = (1, datetime(2016, 1, 2, 0, 0, 0), datetime(2016, 1, 2, 4, 0, 0), '2016-01-02')
		sleep_records = [ sleep1, sleep2 ]
		keyval_records = []
		babyid = 1
		day_generator = DayGenerator(babyid, sleep_records, keyval_records)

		days = day_generator.get_days()
		self.assertEqual(2, len(days))
		day1 = days['2016-01-01']
		day2 = days['2016-01-02']

		self.assertEqual(8.0, day1.get_sleep().get_unbroken_night_sleep_hrs())
		self.assertEqual(0, day2.get_sleep().get_unbroken_night_sleep_hrs())

	def test_generate_days_no_overnight_records_shows_correct(self):
		# night sleep day 1 - just went to be 1 hour ago
		sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 1, 21, 0, 0), '2016-01-01')
		sleep_records = [ sleep1 ]
		keyval_records = []
		babyid = 1
		day_generator = DayGenerator(babyid, sleep_records, keyval_records)

		days = day_generator.get_days()
		self.assertEqual(1, len(days))
		day1 = days['2016-01-01']

		self.assertEqual(1.0, day1.get_sleep().get_unbroken_night_sleep_hrs())

	def test_generate_days_no_overnight_records_had_1_wakeup_shows_correct(self):
		# night sleep day 1 - just went to be 1 hour ago
		sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 1, 23, 0, 0), '2016-01-01')
		sleep2 = (1, datetime(2016, 1, 1, 23, 30, 0), datetime(2016, 1, 2, 0, 0, 0), '2016-01-01')
		sleep_records = [ sleep1, sleep2 ]
		keyval_records = []
		babyid = 1
		day_generator = DayGenerator(babyid, sleep_records, keyval_records)

		days = day_generator.get_days()
		self.assertEqual(1, len(days))
		day1 = days['2016-01-01']

		self.assertEqual(3.0, day1.get_sleep().get_unbroken_night_sleep_hrs())



