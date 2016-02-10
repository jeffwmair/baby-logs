import mysql.connector
from app import app
from domain import Day
from datetime import date, timedelta
from db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord

class QueryMapper:
	def __init__(self, credentials):
		self._creds = credentials

	def get_days(self, start, end):

		sql = "select id, start, end, DATE_FORMAT(start, '%Y-%m-%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() order by start ASC"
		con = mysql.connector.connect(user=self._creds['user'], password=self._creds['pass'],host=self._creds['host'], database=self._creds['db'])

		try:
			cursor = con.cursor()
			cursor.execute(sql)

			# days
			days = dict()
			for row in cursor.fetchall():

				sleep_baby_id = row[0]
				sleep_start = row[1]
				sleep_end = row[2]
				sleep_day_key = row[3]

				if sleep_day_key not in days:
					days[sleep_day_key] = Day(sleep_day_key, sleep_baby_id)

				day_record = days[sleep_day_key]
				sleep_record = SleepRecord(sleep_start, sleep_end)
				day_record.add_sleep_record(sleep_record)

				# if the sleep start between midnight and {morning}, add as night sleep to previous day
				startHr = sleep_start.hour
				if startHr >= 0 and startHr <= 7:
					# add to the previous day
					prev_date = day_record.get_date() - timedelta(days=1)

					prev_date_string = prev_date.strftime("%Y-%m-%d %H:%M")
					if prev_date_string not in days:
						days[prev_date_string] = Day(prev_date_string, sleep_baby_id)

					day_record_prev = days[prev_date_string]
					day_record_prev.add_sleep_past_midnight(sleep_record)

			return days


		finally:
			con.close()
