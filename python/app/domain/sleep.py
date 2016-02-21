from datetime import datetime
from app.const.constants import Constants

class SleepSet:
	def __init__(self, records):

		merged = self._merge_contiguous_sleeps(records)
		self._organize_records_by_time(merged)

		self._night_hrs = sum(x.get_duration() for x in self._night)
		self._day_hrs = sum(x.get_duration() for x in self._daytime)
		self._last_night_hrs = sum(x.get_duration() for x in self._last_night)
		self._nap_count = len(self._daytime)

		# |prev n.|daytime      |night->
		# |-------|-------------|----|

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
		self._contig_records = list()
		for rec in records:
			if prev_rec == None:
				prev_rec = rec
			else:
				if rec.is_adjacent_to(prev_rec):
					prev_rec.end = rec.end
				else:
					self._contig_records.append(prev_rec)
					prev_rec = rec

		if not prev_rec in self._contig_records:
			self._contig_records.append(prev_rec)

		return self._contig_records

	def get_merged_records(self):
		return self._contig_records

	def get_nap_count(self):
		return self._nap_count

	def get_nap_hrs(self):
		return self._day_hrs

	def get_lastnight_sleep_hrs(self):
		return self._last_night_hrs

	def get_night_sleep_hrs(self):
		return self._night_hrs

	def get_total_sleep_hrs(self):
		return self.get_last_night_sleeps() + self.get_nap_hrs() + self.get_night_sleeps()
