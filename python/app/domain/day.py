from dateutil.parser import parse
from datetime import date, timedelta
from ..db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord

class DayGenerator:
	def __init__(self, babyid, sleep_rows, keyval_rows):

		day_sleeps = dict()
		day_sleeps_after_midnight = dict()
		for row in sleep_rows:

			sleep_baby_id = row[0]
			sleep_start = row[1]
			sleep_end = row[2]
			sleep_day_key = row[3]
			day_date = parse(sleep_day_key)

			if sleep_day_key not in day_sleeps:
				day_sleeps[sleep_day_key] = list()#Day(sleep_day_key, sleep_baby_id)

			day_sleeps_list = day_sleeps[sleep_day_key]
			sleep_record = SleepRecord(sleep_start, sleep_end)
			day_sleeps_list.append(sleep_record)
#			day_record.add_sleep_record(sleep_record)

			# if the sleep start between midnight and {morning}, add as night sleep to previous day
			startHr = sleep_start.hour
			if startHr >= 0 and startHr <= 7:
				# add to the previous day
				prev_date = day_date - timedelta(days=1)

				prev_date_string = prev_date.strftime("%Y-%m-%d")
				if prev_date_string not in day_sleeps_after_midnight:
					day_sleeps_after_midnight[prev_date_string] = list() #Day(prev_date_string, sleep_baby_id)

				day_record_prev = day_sleeps_after_midnight[prev_date_string]
				#day_record_prev.add_sleep_past_midnight(sleep_record)
				day_record_prev.append(sleep_record)

		day_keyvals = dict()
		for row in keyval_rows:

			keyval_time = row[0]
			keyval_day = row[1]
			keyval_type = row[2]
			keyval_val = row[3]

			# create a new day if doesn't exist
			if keyval_day not in day_keyvals:
				day_keyvals[keyval_day] = list()#Day(keyval_day, self._baby_id)

			day_keyval = day_keyvals[keyval_day]
			#TODO babyid
			babyid = 1
			day_keyval.append(KeyValueRecord(keyval_time, keyval_type, keyval_val, babyid))
			#day.add_record(KeyValueRecord(keyval_time, keyval_type, keyval_val, babyid))

		# get a list of all the day/keys
		day_keys = list()
		for key in day_sleeps:
			if not key in day_keys:
				day_keys.append(key)

		for key in day_sleeps_after_midnight:
			if not key in day_keys:
				day_keys.append(key)

		for key in day_keyvals:
			if not key in day_keys:
				day_keys.append(key)

		days = dict()
		for key in day_keys:
			days[key] = Day(key, 1, day_sleeps.get(key), day_sleeps_after_midnight.get(key), day_keyvals.get(key))

		self._days = days

	def get_days(self):
		return self._days


class Day:
	def __init__(self, day_string, baby_id, day_sleeps, day_sleeps_after_midnight, keyval_records):
		self._day = parse(day_string)
		self._baby_id = baby_id
		self._sleep_records = day_sleeps
		self._sleep_past_midnight = day_sleeps_after_midnight

		self._diapers = list()
		self._milk_feeds = list()
		self._formula_feeds = list()

		if keyval_records != None:
			for record in keyval_records:
				if record.get_type() == 'diaper':
					self._diapers.append(record)
				elif record.get_type() == 'milk':
					self._milk_feeds.append(record)
				elif record.get_type() == 'formula':
					self._formula_feeds.append(record)
				else:
					raise Exception('unknown record type: %s' % record)


	def get_breast_count(self):
		ct = 0
		for milk in self._milk_feeds:
			try:
				int(milk.get_value())
			except:
				ct += 1
		return ct

	def get_milk_ml(self):
		ml = 0
		for milk in self._milk_feeds:
			val = milk.get_value()
			try:
				val = int(milk.get_value())
				ml += val
			except:
				print 'Must have been a BR or BL; no problemo'
		return ml

	def get_fmla_ml(self):
		return sum(int(feed.get_value()) for feed in self._formula_feeds)

