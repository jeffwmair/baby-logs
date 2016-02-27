import mysql.connector
from app import app
from domain.day import DayGenerator, Day
from datetime import date, timedelta
from db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord

class QueryMapper:
	def __init__(self, credentials, baby_id):
		self._credentials = credentials
		self._baby_id = baby_id

	def get_sleeps_for_day(self, date_string):
		sql_sleeps = "select id, babyid, date_format(start, '%%Y-%%m-%%d %%T'), date_format(end, '%%Y-%%m-%%d %%T') from baby_sleep where start >= '%s' and start <= '%s 23:59:59' order by start" % (date_string,date_string)
		con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])
		try:
			cursor = con.cursor()
			cursor.execute(sql_sleeps)
			sleeps = cursor.fetchall()
			return sleeps
		finally:
			con.close()


	def get_latest_each_record_type(self):
		# get the latest sleep, pee, poo, feed (milk or fmla)
		sql_pee = "select time from baby_keyval where entry_type = 'diaper' and entry_value = 'pee' order by time desc limit 1"
		sql_poo = "select time from baby_keyval where entry_type = 'diaper' and entry_value = 'poo' order by time desc limit 1"
		sql_feed = "select time from baby_keyval where entry_type = 'milk' or entry_type = 'formula' order by time desc limit 1"
		sql_sleep = "select end from baby_sleep where end <= current_timestamp() order by end desc limit 1"

		con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])

		try:
			cursor = con.cursor()

			cursor.execute(sql_pee)
			rows = cursor.fetchall()
			last_pee = rows[0][0]

			cursor.execute(sql_poo)
			rows = cursor.fetchall()
			last_poo = rows[0][0]

			cursor.execute(sql_feed)
			rows = cursor.fetchall()
			last_feed = rows[0][0]

			cursor.execute(sql_sleep)
			rows = cursor.fetchall()
			last_sleep = rows[0][0]

			return {'last_pee':last_pee, 'last_poo':last_poo, 'last_feed':last_feed, 'last_sleep':last_sleep}

		finally:
			con.close()


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


		con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])

		try:
			cursor = con.cursor()
			sql = "select id, start, end, DATE_FORMAT(start, '%%Y-%%m-%%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() %s order by start ASC" % sleep_date_filter
			cursor.execute(sql)
			sleep_rows = cursor.fetchall()

			sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time <= CURRENT_TIMESTAMP() %s order by time ASC' % keyval_date_filter;
			cursor = con.cursor()
			cursor.execute(sql)
			keyval_rows = cursor.fetchall()

			day_gen = DayGenerator(1, sleep_rows, keyval_rows)
			days = day_gen.get_days()

			return days

		finally:
			con.close()
