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

	def test_daytime_records(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 7, 0), datetime(2016, 1, 1, 9, 0))
		records = [ rec1 ]
		sut = SleepSet(records)
		sleeps_day = sut.get_nap_hrs()

		self.assertEqual(2, sleeps_day)

	def test_lastnight_records(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 0, 0), datetime(2016, 1, 1, 0, 15))
		records = [ rec1 ]
		sut = SleepSet(records)
		sleeps_day = sut.get_nap_hrs()

		self.assertEqual(0, sleeps_day)

	def test_unbroken_sleep(self):
		# Sleep from 8pm till 4am then 5am to 7am.
		# This should yield an 8 hour unbroken stretch

		# this "sleep set" is for Jan 1st.  The overnight records are from Jan 2nd, not 
		# part of this day, so the records need to be added outside the constructor.

		rec1 = SleepRecord(datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 2, 4, 0, 0))
		records = [ rec1 ]
		sut = SleepSet(records)

		rec2 = SleepRecord(datetime(2016, 1, 2, 5, 0, 0), datetime(2016, 1, 2, 7, 0, 0))
		records_overnight = [ rec2 ]
		sut.set_overnight_sleep_records(records_overnight)

		self.assertEqual(8.0, sut.get_unbroken_night_sleep_hrs())

	def test_naps(self):
		rec1 = SleepRecord(datetime(2016, 1, 1, 9, 0), datetime(2016, 1, 1, 9, 15))
		rec2 = SleepRecord(datetime(2016, 1, 1, 9, 15), datetime(2016, 1, 1, 9, 30))
		rec3 = SleepRecord(datetime(2016, 1, 1, 12, 0), datetime(2016, 1, 1, 12, 15))
		rec4 = SleepRecord(datetime(2016, 1, 1, 12, 15), datetime(2016, 1, 1, 12, 30))

		records = [ rec1, rec2, rec3, rec4 ]
		sut = SleepSet(records)

		self.assertEqual(2, sut.get_nap_count())
		self.assertEqual(1.0, sut.get_nap_hrs())
