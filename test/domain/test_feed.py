import unittest
from datetime import datetime
from app.domain.feed import FeedSet
from app.db_records import KeyValueRecord

class FeedTest(unittest.TestCase):

    def test_milk_ml(self):
        # sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time >= "%s" and time <= CURRENT_TIMESTAMP() and babyid = %i order by time ASC' % (startDate, self._baby_id)
        r1 = { 'time': '2000-01-01 00:00:00', 'day': '2000-01-01', 'type': 'milk', 'value':'100' }
        r2 = { 'time': '2000-01-01 00:00:00', 'day': '2000-01-01', 'type': 'formula', 'value':'300' }
        records = [r1, r2]
        sut = FeedSet(records)

        self.assertEqual(100, sut.get_milk_ml())
        self.assertEqual(300, sut.get_fmla_ml())

if __name__ == '__main__':
    unittest.main()