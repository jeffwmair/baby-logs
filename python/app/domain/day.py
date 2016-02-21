from dateutil.parser import parse
from datetime import date, timedelta
from app.db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord
from app.domain.sleep import SleepSet
from app.domain.feed import FeedSet
from app.domain.diaper import DiaperSet

class DayGenerator:
	def __init__(self, babyid, sleep_rows, keyval_rows):

		day_sleeps = dict()
		for row in sleep_rows:

			sleep_baby_id = row[0]
			sleep_start = row[1]
			sleep_end = row[2]
			sleep_day_key = row[3]
			day_date = parse(sleep_day_key)

			if sleep_day_key not in day_sleeps:
				day_sleeps[sleep_day_key] = list()

			day_sleeps_list = day_sleeps[sleep_day_key]
			sleep_record = SleepRecord(sleep_start, sleep_end)
			day_sleeps_list.append(sleep_record)

		day_keyvals = dict()
		for row in keyval_rows:

			keyval_time = row[0]
			keyval_day = row[1]
			keyval_type = row[2]
			keyval_val = row[3]

			# create a new day if doesn't exist
			if keyval_day not in day_keyvals:
				day_keyvals[keyval_day] = list()

			day_keyval = day_keyvals[keyval_day]
			#TODO babyid
			babyid = 1
			day_keyval.append(KeyValueRecord(keyval_time, keyval_type, keyval_val, babyid))

		# get a list of all the day/keys
		day_keys = list()
		for key in day_sleeps:
			if not key in day_keys:
				day_keys.append(key)

		for key in day_keyvals:
			if not key in day_keys:
				day_keys.append(key)

		days = dict()
		for key in day_keys:
			sleeps = SleepSet(day_sleeps.get(key))
			feeds = FeedSet([x for x in day_keyvals.get(key) if x.get_type() == 'milk' or x.get_type() == 'formula'])
			diapers = DiaperSet([x for x in day_keyvals.get(key) if x.get_type() == 'diaper'])
			days[key] = Day(key, sleeps, diapers, feeds)

		self._days = days

	def get_days(self):
		return self._days

class Day:
	def __init__(self, date_string, sleep_set, diaper_set, feed_set):
		self._date_string = date_string
		self._sleep = sleep_set
		self._feed = feed_set
		self._diaper = diaper_set

	def get_feed(self):
		return self._feed

	def get_sleep(self):
		return self._sleep

	def get_diaper(self):
		return self._diaper
	