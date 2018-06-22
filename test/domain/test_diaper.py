import unittest
from datetime import datetime
from app.domain.diaper import DiaperSet
from app.db_records import KeyValueRecord

class DiaperTest(unittest.TestCase):

    def test_poo_count(self):
        p1 = { 'time': '2000-01-01 00:00:00', 'day': '2000-01-01', 'type': 'diaper', 'value':'poo' }
        p2 = { 'time': '2000-01-15 00:00:00', 'day': '2000-01-15', 'type': 'diaper', 'value':'poo' }
        diapers = [p1, p2]
        sut = DiaperSet(diapers)

        self.assertEqual(0, sut.get_pee_count())
        self.assertEqual(2, sut.get_poo_count())

    def test_pee_count(self):
        p1 = { 'time': '2000-01-01 00:00:00', 'day': '2000-01-01', 'type': 'diaper', 'value':'pee' }
        p2 = { 'time': '2000-01-15 00:00:00', 'day': '2000-01-15', 'type': 'diaper', 'value':'pee' }
        diapers = [p1, p2]
        sut = DiaperSet(diapers)

        self.assertEqual(2, sut.get_pee_count())
        self.assertEqual(0, sut.get_poo_count())

if __name__ == '__main__':
    unittest.main()