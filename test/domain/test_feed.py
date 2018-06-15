import unittest
from datetime import datetime
from app.domain.feed import FeedSet
from app.db_records import KeyValueRecord

class FeedTest(unittest.TestCase):

    def test_milk_ml(self):
        r1 = KeyValueRecord(datetime(2000,1,1,8,0), 'milk', '100', 1)
        r2 = KeyValueRecord(datetime(2000,1,1,8,0), 'formula', '300', 1)
        records = [r1, r2]
        sut = FeedSet(records)

        self.assertEqual(100, sut.get_milk_ml())
        self.assertEqual(300, sut.get_fmla_ml())

if __name__ == '__main__':
    unittest.main()