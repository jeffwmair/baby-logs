from datetime import datetime

class DiaperSet:
	"""responsible for calculating over diaper records"""
	def __init__(self, diaper_records):
		# 1 is pee
		# 2 is poo
		# 3 is both
		# TODO: again with the string values in the DB... really gotta fix that
		def get_diaper_count(diaperType): return len([x for x in diaper_records if x['type'] == diaperType])
		self._pee_count = get_diaper_count('pee')
		self._poo_count = get_diaper_count('poo')

	def get_pee_count(self):
		return self._pee_count

	def get_poo_count(self):
		return self._poo_count

class DiaperSetAggregated:
	def __init__(self, poo_count):
		self._poo_count = round(poo_count, 1)
	
	def get_poo_count(self):
		return self._poo_count
