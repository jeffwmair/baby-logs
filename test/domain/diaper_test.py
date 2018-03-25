import unittest
from datetime import datetime
from app.domain.diaper import DiaperSet
from app.db_records import KeyValueRecord

class DiaperTest(unittest.TestCase):

 	def test_poo_count(self):
 		p1 = KeyValueRecord(datetime(2000, 1, 1, 0, 0), 'diaper', 'poo', 1)
 		p2 = KeyValueRecord(datetime(2001, 1, 1, 0, 15), 'diaper', 'poo', 1)
 		diapers = [p1, p2]
 		sut = DiaperSet(diapers)
 
 		self.assertEqual(0, sut.get_pee_count())
 		self.assertEqual(2, sut.get_poo_count())
 
	def test_pee_count(self):
		p1 = KeyValueRecord(datetime(2000, 1, 1, 0, 0), 'diaper', 'pee', 1)
		p2 = KeyValueRecord(datetime(2000, 1, 1, 0, 15), 'diaper', 'pee', 1)
		diapers = [p1, p2]
		sut = DiaperSet(diapers)

		self.assertEqual(2, sut.get_pee_count())
		self.assertEqual(0, sut.get_poo_count())

if __name__ == '__main__':
    unittest.main()