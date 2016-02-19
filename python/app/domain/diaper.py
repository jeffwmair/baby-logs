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

		try:
			self._last_poo_time = max(x.get_time() for x in poos)
			self._last_poo_minutes_ago = (datetime.now() - self._last_poo_time).seconds / 60.0
		except Exception:
			pass

		try:
			self._last_pee_time = max(x.get_time() for x in pees)
			self._last_pee_minutes_ago = (datetime.now() - self._last_pee_time).seconds / 60.0
		except Exception:
			pass
	
	def get_pee_count(self):
		return self._pee_count

	def get_poo_count(self):
		return self._poo_count

	def get_poo_last_time(self):
		return self._last_poo_time

	def get_pee_minutes_ago(self):
		return self._last_pee_minutes_ago

	def get_pee_last_time(self):
		return self._last_pee_time

	def get_pee_status(self):
		min_ago = self.get_pee_minutes_ago()
		if min_ago > 60*3.5:
			return 3
		elif min_ago > 60*2.75:
			return 2
		else:
			return 1

	def get_poo_minutes_ago(self):
		return self._last_poo_minutes_ago

	def get_poo_status(self):
		min_ago = self.get_poo_minutes_ago()
		if min_ago > 60*24:
			return 3
		elif min_ago > 60*6:
			return 2
		else:
			return 1


