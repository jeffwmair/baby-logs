import unittest
from datetime import datetime, timedelta
from app.domain.day import Day, DayGenerator
from app.domain.sleep import SleepSet
from app.db_records import SleepRecord
from app.sleep_row import SleepRow

class DayTest(unittest.TestCase):

    def generate_sleep_record(self, yr, mon, day, hr, mn, duration_hrs):
        start = datetime(yr, mon, day, hr, mn, 0)
        end = start + timedelta(minutes=60*duration_hrs)
        day_string = '%s-%02d-%02d' % (yr, mon, day)
        row = (1, start, end, day_string)
        return SleepRow(row)

    def test_group_by_week_sleeps(self):
        wk1sleep1 = self.generate_sleep_record(2016, 2, 21, 8, 0, 2) # the last digit is the duration
        wk1sleep2 = self.generate_sleep_record(2016, 2, 22, 8, 0, 4) # the last digit is the duration
        # wk2 avg = 
        wk2sleep1 = self.generate_sleep_record(2016, 2, 28, 8, 0, 2)
        wk2sleep2 = self.generate_sleep_record(2016, 2, 29, 8, 0, 6)
        sleeps = [ wk1sleep1, wk1sleep2, wk2sleep1, wk2sleep2 ]
        keyval_records = []
        day_generator = DayGenerator(1, True, sleeps, keyval_records)
        weeks = day_generator.get_datasets()

        self.assertEqual(2, len(weeks))
        self.assertEqual(True, weeks['2016-02-21'] != None)
        # TODO: need to assert total and unbroken night sleep
        wk1agg = weeks['2016-02-21']
        wk2agg = weeks['2016-02-28']

        day_count = 2
        self.assertEqual((6.0/day_count), wk1agg.get_sleep().get_total_sleep_hrs())
        self.assertEqual((8.0/day_count), wk2agg.get_sleep().get_total_sleep_hrs())

    def test_generate_days_correct_night_sleep(self):
        # night sleep day 1
        sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 2, 0, 0, 0), '2016-01-01')
        # overnight sleep day 2
        sleep2 = (1, datetime(2016, 1, 2, 0, 0, 0), datetime(2016, 1, 2, 4, 0, 0), '2016-01-02')
        sleep1_row = SleepRow(sleep1)
        sleep2_row = SleepRow(sleep2)
        sleep_records = [ sleep1_row, sleep2_row ]
        keyval_records = []
        babyid = 1
        day_generator = DayGenerator(babyid, False, sleep_records, keyval_records)

        days = day_generator.get_datasets()
        self.assertEqual(2, len(days))
        day1 = days['2016-01-01']
        day2 = days['2016-01-02']

        self.assertEqual(8.0, day1.get_sleep().get_unbroken_night_sleep_hrs())
        self.assertEqual(0, day2.get_sleep().get_unbroken_night_sleep_hrs())

    def test_generate_days_no_overnight_records_shows_correct(self):
        # night sleep day 1 - just went to be 1 hour ago
        sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 1, 21, 0, 0), '2016-01-01')
        sleep1_row = SleepRow(sleep1)
        sleep_records = [ sleep1_row ]
        keyval_records = []
        babyid = 1
        day_generator = DayGenerator(babyid, False, sleep_records, keyval_records)

        days = day_generator.get_datasets()
        self.assertEqual(1, len(days))
        day1 = days['2016-01-01']

        self.assertEqual(1.0, day1.get_sleep().get_unbroken_night_sleep_hrs())

    def test_generate_days_no_overnight_records_had_1_wakeup_shows_correct(self):
        # night sleep day 1 - just went to be 1 hour ago
        sleep1 = (1, datetime(2016, 1, 1, 20, 0, 0), datetime(2016, 1, 1, 23, 0, 0), '2016-01-01')
        sleep2 = (1, datetime(2016, 1, 1, 23, 30, 0), datetime(2016, 1, 2, 0, 0, 0), '2016-01-01')
        sleep1_row = SleepRow(sleep1)
        sleep2_row = SleepRow(sleep2)
        sleep_records = [ sleep1_row, sleep2_row ]
        keyval_records = []
        babyid = 1
        day_generator = DayGenerator(babyid, False, sleep_records, keyval_records)

        days = day_generator.get_datasets()
        self.assertEqual(1, len(days))
        day1 = days['2016-01-01']

        self.assertEqual(3.0, day1.get_sleep().get_unbroken_night_sleep_hrs())



