import unittest
from datetime import datetime
from app.domain.sleep import SleepSet
from app.db_records import SleepRecord

class SleepTest(unittest.TestCase):

	# merge 4 records down to 2
	def test_merge_contig_sleeps(self):

		rec1 = SleepRecord(datetime(2016, 2, 1, 0, 0), datetime(2016, 2, 1, 0, 15))
		rec2 = SleepRecord(datetime(2016, 2, 1, 0, 15), datetime(2016, 2, 1, 0, 30))
		rec3 = SleepRecord(datetime(2016, 2, 1, 8, 0), datetime(2016, 2, 1, 8, 15))
		rec4 = SleepRecord(datetime(2016, 2, 1, 8, 15), datetime(2016, 2, 1, 9, 0))
		records = [ rec1, rec2, rec3, rec4 ]

		sut = SleepSet(records)
		recs = sut.get_merged_records()
		self.assertEqual(2, len(recs), 'should be 2 records now')
		self.assertEqual(datetime(2016,2,1,0,0), recs[0].start)
		self.assertEqual(datetime(2016,2,1,0,30), recs[0].end)
		self.assertEqual(datetime(2016,2,1,8,0), recs[1].start)
		self.assertEqual(datetime(2016,2,1,9,0), recs[1].end)

	def test_night_records(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 19, 0), datetime(2016, 1, 1, 19, 15))
		records = [ rec1 ]
		sut = SleepSet(records)
		sleeps_lastnight = sut.get_last_night_sleeps()
		sleeps_day = sut.get_daytime_sleeps()
		sleeps_night = sut.get_night_sleeps()

		self.assertEqual(0, len(sleeps_lastnight))
		self.assertEqual(0, len(sleeps_day))
		self.assertEqual(1, len(sleeps_night))

	def test_daytime_records(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 7, 0), datetime(2016, 1, 1, 9, 0))
		records = [ rec1 ]
		sut = SleepSet(records)
		sleeps_lastnight = sut.get_last_night_sleeps()
		sleeps_day = sut.get_daytime_sleeps()
		sleeps_night = sut.get_night_sleeps()

		self.assertEqual(0, len(sleeps_lastnight))
		self.assertEqual(1, len(sleeps_day))
		self.assertEqual(0, len(sleeps_night))

	def test_lastnight_records(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 0, 0), datetime(2016, 1, 1, 0, 15))
		records = [ rec1 ]
		sut = SleepSet(records)
		sleeps_lastnight = sut.get_last_night_sleeps()
		sleeps_day = sut.get_daytime_sleeps()
		sleeps_night = sut.get_night_sleeps()

		self.assertEqual(1, len(sleeps_lastnight))
		self.assertEqual(0, len(sleeps_day))
		self.assertEqual(0, len(sleeps_night))

	def test_naps(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 9, 0), datetime(2016, 1, 1, 9, 15))
		rec2 = SleepRecord(datetime(2016, 1, 1, 9, 15), datetime(2016, 1, 1, 9, 30))
		rec3 = SleepRecord(datetime(2016, 1, 1, 12, 0), datetime(2016, 1, 1, 12, 15))
		rec4 = SleepRecord(datetime(2016, 1, 1, 12, 15), datetime(2016, 1, 1, 12, 30))

		records = [ rec1, rec2, rec3, rec4 ]
		sut = SleepSet(records)

		self.assertEqual(2, sut.get_nap_count())
		self.assertEqual(1.0, sut.get_nap_hrs())
