import mysql.connector
from app import app
from domain.day import DayGenerator, Day
from datetime import date, timedelta
from db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord

class QueryMapper:
	def __init__(self, credentials, baby_id):
		self._creds = credentials
		self._baby_id = baby_id

	def get_days(self, start, end):

		sleep_date_filter = ''
		keyval_date_filter = ''
		if not start == None:
			start_fmt = start.strftime('%Y-%m-%d %H:%M:%S')
			sleep_date_filter = ' and start >= TIMESTAMP("%s")' % start_fmt
			keyval_date_filter = ' and time >= TIMESTAMP("%s")' % start_fmt
		if not end == None:
			end_fmt = end.strftime('%Y-%m-%d %H:%M:%S')
			sleep_date_filter = '%s and end <= TIMESTAMP("%s")' % (sleep_date_filter, end_fmt)
			keyval_date_filter = '%s and time <= TIMESTAMP("%s")' % (keyval_date_filter, end_fmt)


		#print '%s;' % sql
		con = mysql.connector.connect(user=self._creds['user'], password=self._creds['pass'],host=self._creds['host'], database=self._creds['db'])

		try:
			cursor = con.cursor()
			sql = "select id, start, end, DATE_FORMAT(start, '%%Y-%%m-%%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() %s order by start ASC" % sleep_date_filter
			cursor.execute(sql)
			sleep_rows = cursor.fetchall()
			print '%%%'
			print sleep_rows[0]
			print type(sleep_rows[0])
			print type(sleep_rows)
			print '%%%'

			sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time <= CURRENT_TIMESTAMP() %s order by time ASC' % keyval_date_filter;
			#print '%s;' % sql
			cursor = con.cursor()
			cursor.execute(sql)
			keyval_rows = cursor.fetchall()

			day_gen = DayGenerator(1, sleep_rows, keyval_rows)
			days = day_gen.get_days()

			return days

		finally:
			con.close()
