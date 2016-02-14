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
