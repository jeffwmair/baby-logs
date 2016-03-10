from datetime import datetime
from app.const.constants import Constants

class SleepAggregated():
	def __init__(self, total_sleep_hrs, unbroken_night_sleep_hrs):
		self._total_sleep_hrs = round(total_sleep_hrs, 1)
		self._unbroken_night_sleep_hrs = round(unbroken_night_sleep_hrs, 1)

	def get_unbroken_night_sleep_hrs(self):
		return self._unbroken_night_sleep_hrs

	def get_total_sleep_hrs(self):
		return self._total_sleep_hrs

class SleepSet:
	def __init__(self, records):

		if len(records) == 0:
			return

		self._contig_records = self._merge_contiguous_sleeps(records)
		self._organize_records_by_time(self._contig_records)

		self._night_hrs = sum(x.get_duration() for x in self._night)
		self._day_hrs = sum(x.get_duration() for x in self._daytime)
		self._last_night_hrs = sum(x.get_duration() for x in self._last_night)
		self._nap_count = len(self._daytime)

		# this will be updated if "next day's" hours are passed in
		if len(self._night) > 0:
			merged_night_sleeps = self._merge_contiguous_sleeps(self._night)
			self._unbroken_night_sleep_hrs = max(x.get_duration() for x in merged_night_sleeps)
		else:
			self._unbroken_night_sleep_hrs = 0

		# |prev n.|daytime      |night->
		# |-------|-------------|------|-----------|------
		# | Day 1 --------------| Day 2
		# Overnight sleep starts at Day 1 night and ends in Day 2 morning.

	# organize into early morning, daytime, and night
	def _organize_records_by_time(self, records):
		self._last_night = list()
		self._daytime = list()
		self._night = list()

		for rec in records:
			if rec.start.hour < Constants.MORNING_START_HR:
				self._last_night.append(rec)
			elif rec.start.hour < Constants.NIGHT_START_HR:
				self._daytime.append(rec)
			else:
				self._night.append(rec)


	# In the database we will have adjacent sleep records.
	# Merge them here to make them easier to work with.
	def _merge_contiguous_sleeps(self, records):
		prev_rec = None
		contig_records = list()
		for rec in records:
			if prev_rec == None:
				prev_rec = rec
			else:
				if rec.is_adjacent_to(prev_rec):
					prev_rec.end = rec.end
				else:
					contig_records.append(prev_rec)
					prev_rec = rec

		if not prev_rec in contig_records:
			contig_records.append(prev_rec)

		return contig_records

	def get_merged_records(self):
		return self._contig_records

	def get_last_night_records(self):
		return self._last_night

	def get_nap_count(self):
		return self._nap_count

	def get_nap_hrs(self):
		return self._day_hrs

	def set_overnight_sleep_records(self, overnight_sleep_records):
		# Here, calculate the longest unbroken sleep period.
		sleeps_merged = self._night + overnight_sleep_records
		if len(sleeps_merged) == 0:
			self._unbroken_night_sleep_hrs = 0
			return 

		contiguous_night_sleeps = self._merge_contiguous_sleeps(sleeps_merged)
		self._unbroken_night_sleep_hrs = max(x.get_duration() for x in contiguous_night_sleeps)

	def get_unbroken_night_sleep_hrs(self):
		return self._unbroken_night_sleep_hrs

	def get_total_sleep_hrs(self):
		return self._last_night_hrs + self._day_hrs + self._night_hrs
