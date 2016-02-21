from datetime import datetime

# responsible for calculating over diaper records
class DiaperSet:
	def __init__(self, diaper_records):

		# 1 is pee
		# 2 is poo
		# 3 is both

		# TODO: again with the string values in the DB... really gotta fix that
		pees = [x for x in diaper_records if x.get_value() == '1' or x.get_value() == '3']
		poos = [x for x in diaper_records if x.get_value() == '2' or x.get_value() == '3']

		self._pee_count = len(pees)
		self._poo_count = len(poos)

	def get_pee_count(self):
		return self._pee_count

	def get_poo_count(self):
		return self._poo_count
