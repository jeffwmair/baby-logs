class SleepSet:
	def __init__(self, records):
		# anything between midnight and 7am is night sleep
		# 7am to 7:30pm, daytime
		# 7:30pm to midnight (next night) sleep

		merged = self._merge_contiguous_sleeps(records)
		self._organize_records_by_time(merged)

		# |prev n.|daytime      |night->
		# |-------|-------------|----|
		# "select id, start, end, DATE_FORMAT(start, '%%Y-%%m-%%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() %s order by start ASC" % sleep_date_filter
	
	def _organize_records_by_time(self, records):
		self._last_night = list()
		self._daytime = list()
		self._night = list()

		# TODO: find a place for these constants
		MORNING_START_HR = 7
		NIGHT_START_HR = 19

		self._nap_hrs = 0
		self._nap_count = 0

		for rec in records:
			if rec.start.hour < MORNING_START_HR:
				self._last_night.append(rec)
			elif rec.start.hour < NIGHT_START_HR:
				self._daytime.append(rec)
				self._nap_count += 1
				self._nap_hrs += rec.get_duration()
			else:
				self._night.append(rec)

	def get_last_night_sleeps(self):
		return self._last_night

	def get_daytime_sleeps(self):
		return self._daytime

	def get_night_sleeps(self):
		return self._night


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
		return self._nap_hrs

	def get_night_sleep_hrs(self):
		return 0

	def get_total_sleep_hrs(self):
		return 0

