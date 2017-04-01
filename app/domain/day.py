from dateutil.parser import parse
from datetime import date, timedelta
from app.db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord
from app.domain.sleep import SleepSet, SleepAggregated
from app.domain.feed import FeedSet, FeedSetAggregated
from app.domain.diaper import DiaperSet, DiaperSetAggregated

class DayGenerator():
	def __init__(self, babyid, weekly_grouping, sleep_rows, keyval_rows):

		day_sleeps = dict()
		for row in sleep_rows:

			day_date = parse(row.get_day_key())

			if row.get_day_key() not in day_sleeps:
				day_sleeps[row.get_day_key()] = []

			day_sleeps_list = day_sleeps[row.get_day_key()]
			sleep_record = SleepRecord(row.get_sleep_start(), row.get_sleep_end())
			day_sleeps_list.append(sleep_record)

		day_keyvals = dict()
		for row in keyval_rows:

			keyval_time = row[0]
			keyval_day = row[1]
			keyval_type = row[2]
			keyval_val = row[3]

			# create a new day if doesn't exist
			if keyval_day not in day_keyvals:
				day_keyvals[keyval_day] = []

			day_keyval = day_keyvals[keyval_day]
			#TODO babyid
			babyid = 1
			day_keyval.append(KeyValueRecord(keyval_time, keyval_type, keyval_val, babyid))

		# get a list of all the day/keys
		day_keys = []
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

		if weekly_grouping:
			week_groups = dict()
			for day_key in sorted(days):
 
				# get the week that this day belongs to 
				week_key = self.get_week_start_from_day(day_key)

				# we need a list of days in this week
				if not week_key in week_groups:
					week_groups[week_key] = []
				week_group_list = week_groups[week_key]
				week_group_list.append(days[day_key])
					#this_day = Day(key, sleep_set, diaper_set, feed_set)

			# Now we have groups of day lists; we need to aggregate the lists into single "Day" objects.
			# They aren't really days anymore but we use that class.

			week_groups_aggregated = dict()
			for week_key in sorted(week_groups):
				days_in_week = week_groups[week_key]
				week_groups_aggregated[week_key] = self.get_aggregated_days(week_key, days_in_week)

			# stick it where the regular non-aggregated days go
			self._days = week_groups_aggregated


	def get_aggregated_sleeps(self, days):
		sleep_sets = [x.get_sleep() for x in days]
		tot_sleep = sum(x.get_total_sleep_hrs() for x in sleep_sets)
		avg_total_sleep = sum(x.get_total_sleep_hrs() for x in sleep_sets) / len(days) 
		avg_night_sleep = sum(x.get_unbroken_night_sleep_hrs() for x in sleep_sets) / len(days)
		return SleepAggregated(avg_total_sleep, avg_night_sleep)

	def get_aggregated_diapers(self, days):
		diaper_sets = [x.get_diaper() for x in days]
		avg_poo_count = sum(x.get_poo_count() for x in diaper_sets) / len(days)
		return DiaperSetAggregated(avg_poo_count)

	def get_aggregated_feeds(self, days):
		day_count = len(days)
		feed_sets = [x.get_feed() for x in days]
		avg_breast_count = sum(x.get_breast_count() for x in feed_sets) / day_count
		avg_milk_ml = sum(x.get_milk_ml() for x in feed_sets) / day_count
		avg_solid_ml = sum(x.get_solid_ml() for x in feed_sets) / day_count
		avg_fmla_ml = sum(x.get_fmla_ml() for x in feed_sets) / day_count
		return FeedSetAggregated(avg_breast_count, avg_milk_ml, avg_solid_ml, avg_fmla_ml)

	def get_aggregated_days(self, date_string, days):
		sleep_set = self.get_aggregated_sleeps(days)
		diaper_set = self.get_aggregated_diapers(days)
		feed_set = self.get_aggregated_feeds(days)
		return Day(date_string, sleep_set, diaper_set, feed_set)

	def get_week_start_from_day(self, date_string):
		# 6 == sunday, 0 == monday
		date_value = parse(date_string)
		day_of_week = date_value.weekday()
		if day_of_week == 6:
			return date_string
		else:
			# subtract day of week+1 days
			return (date_value - timedelta(days=(day_of_week+1))).strftime('%Y-%m-%d')

	def group_days_into_week(self):
		pass

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
