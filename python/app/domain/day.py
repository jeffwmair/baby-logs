from dateutil.parser import parse
from datetime import date, timedelta
from app.db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord
from app.domain.sleep import SleepSet
from app.domain.feed import FeedSet
from app.domain.diaper import DiaperSet

class DayGenerator:
	def __init__(self, weekly_grouping, babyid, sleep_rows, keyval_rows):

		if weekly_grouping:
			print 'weekly_grouping is not yet implemented!'

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
			feeds = []
			diapers = []
			sleeps = []

			if key in day_sleeps:
				sleeps = day_sleeps.get(key)
			if key in day_keyvals:
				feeds = [x for x in day_keyvals.get(key) if x != None and x.get_type() == 'milk' or x.get_type() == 'formula' or x.get_type() == 'solid']
				diapers = [x for x in day_keyvals.get(key) if x.get_type() == 'diaper']

			sleep_set = SleepSet(sleeps)
			feed_set = FeedSet(feeds)
			diaper_set = DiaperSet(diapers)

			this_day = Day(key, sleep_set, diaper_set, feed_set)
			days[key] = this_day


		prev_key = None
		cur_key = None
		for day_key in sorted(days):
			if cur_key != None:
				prev_key = cur_key
			cur_key = day_key
			# set the 'next day' link so we can calculate night sleep using multiple days
			if prev_key != None:
				prev_day = days[prev_key]
				cur_day = days[cur_key]
				prev_day.get_sleep().set_overnight_sleep_records(cur_day.get_sleep().get_last_night_records())

		self._days = days

	def get_datasets(self):
		return self._days

class Day:
	def __init__(self, date_string, sleep_set, diaper_set, feed_set):
		self._date_string = date_string
		self._sleep = sleep_set
		self._feed = feed_set
		self._diaper = diaper_set

	def __repr__(self):
		return 'DAY: %s, sleeps:%i, feeds:%i, diapers:%s' % (self._date_string, len(self._sleep.get_merged_records()), self._feed.get_milk_ml(), self._diaper.get_poo_count())

	def get_feed(self):
		return self._feed

	def get_sleep(self):
		return self._sleep

	def get_diaper(self):
		return self._diaper
