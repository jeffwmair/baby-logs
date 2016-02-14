import unittest
from datetime import datetime
from app.db_records import SleepRecord

class SleepRecordTest(unittest.TestCase):

	def test_duration(self):
		a = SleepRecord(datetime(2016, 1, 1, 0, 0), datetime(2016, 1, 1, 0, 30))
		self.assertEqual(0.5, a.get_duration())


