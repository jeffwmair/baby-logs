from dateutil.parser import parse

class Day:
	def __init__(self, day_string, baby_id):
		self._day = parse(day_string)
		self._baby_id = baby_id
		self._sleep_records = list()
		self._sleep_past_midnight = list()
		self._diapers = list()
		self._milk_feeds = list()
		self._formula_feeds = list()

	def add_sleep_record(self, record):
		self._sleep_records.append(record)

	# add a sleep record that is after midnight this day but before
	# what we would consider the end of the 'night' the next morning
	def add_sleep_past_midnight(self, record):
		self._sleep_past_midnight.append(record)

	def add_record(self, record):
		if record.type == 'diaper':
			self._diapers.append(record)
		elif record.type == 'milk':
			self._milk_feeds.append(record)
		elif record.type == 'formula':
			self._formula_feeds.append(record)
		else:
			raise Exception('unknown record type: %s' % record)
	
	def get_date(self):
		return self._day

