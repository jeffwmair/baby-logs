class SleepSet:
	def __init__(self, records):
		# anything between midnight and 7am is night sleep
		# 7am to 7:30pm, daytime
		# 7:30pm to midnight (next night) sleep

		self._merge_contiguous_sleeps(records)

		# |prev n.|daytime      |night->
		# |-------|-------------|----|
		# "select id, start, end, DATE_FORMAT(start, '%%Y-%%m-%%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() %s order by start ASC" % sleep_date_filter
	
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
		return 0

	def get_nap_hrs(self):
		return 0

	def get_night_sleep_hrs(self):
		return 0

	def get_total_sleep_hrs(self):
		return 0

