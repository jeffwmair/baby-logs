import mysql.connector
from app import app
from domain.day import DayGenerator, Day
from datetime import date, timedelta
from db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord

class QueryMapper:
	def __init__(self, credentials, baby_id):
		self._credentials = credentials
		self._baby_id = baby_id

	def insert_value_item(self, babyid, time_string, entry_type, entry_value):
		sql = "insert into baby_keyval (babyid, time, entry_type, entry_value) values (%i, '%s', '%s', '%s');" % (babyid, time_string, entry_type, entry_value)
		self.execute_sql(sql)

	def delete_value_item(self, babyid, time_string, entry_type):
		sql = "delete from baby_keyval where babyid = %i and time = '%s' and entry_type = '%s';" % (babyid, time_string, entry_type)
		self.execute_sql(sql)

	def insert_sleep(self, babyid, sleep_start, sleep_end):
		sql = "insert into baby_sleep (babyid, start, end) values (%i, '%s', '%s');" % (babyid, sleep_start, sleep_end)
		self.execute_sql(sql)

	def delete_sleep(self, sleep_time):
		sql = "delete from baby_sleep where start = '%s';" % (sleep_time)
		self.execute_sql(sql)
	
	def get_query_keyval_in_day_by_type(self,entry_type, date_string):
		sql = "select date_format(time, '%%Y-%%m-%%d %%T'), entry_value, entry_type from baby_keyval where entry_type = '%s' and time >= '%s' and time <= '%s 23:59:59' order by time" % (entry_type,date_string,date_string)
		return sql

	def get_chart_data(self):
		emptylist = list()
		data = dict()
		daily = list()
		row = {
				'day':'2016-02-20 00:00:00', 
				'totalSleepHrs': 1,
				'nightSleepHrs': 2,
				'breastCount': 0,
				'milkMl':400,
				'solidMl':50,
				'formulaMl':50,
				'poos':1,
				}
		daily.append(row)
		data['daily'] = daily
		data['weekly'] = list()
		print 'got chart data: %s' % data
		return data

	def get_data_for_day(self, date_string):
		data = dict()
		sql_sleeps = "select id, babyid, date_format(start, '%%Y-%%m-%%d %%T'), date_format(end, '%%Y-%%m-%%d %%T') from baby_sleep where start >= '%s' and start <= '%s 23:59:59' order by start" % (date_string,date_string)
		sql_keyval = "select date_format(time, '%%Y-%%m-%%d %%T'), entry_value, entry_type from baby_keyval where time >= '%s' and time <= '%s 23:59:59' order by time" % (date_string,date_string)
		con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])
		try:
			cursor = con.cursor()
			sleeps = self.execute_sql(sql_sleeps, True, cursor)
			keyval_records = self.execute_sql(sql_keyval, True, cursor)

			def get_records_by_type(typestring):
				return [x for x in keyval_records if x[2] == typestring]

			milk = get_records_by_type('milk')
			formula = get_records_by_type('formula')
			solid = get_records_by_type('solid')
			diapers = get_records_by_type('diaper')

			sleep_list = list()
			for sleep in sleeps:
				row = {
						'id':sleep[0], 
						'babyid':sleep[1], 
						'start':sleep[2],
						'end':sleep[3]
					}
				sleep_list.append(row)

			def get_keyval_rows(itemlist):
				rowlist = list()	
				for entry in itemlist:
					row = {
						'time':entry[0],
						'entry_value':entry[1],
						'entry_type':entry[2]
					}
					rowlist.append(row)
				return rowlist
				
			formula_list = get_keyval_rows(formula)
			milk_list = get_keyval_rows(milk)
			solids_list = get_keyval_rows(solid)
			diapers_list = get_keyval_rows(diapers)

			data['milk'] = milk_list
			data['formula'] = formula_list
			data['solid'] = solids_list
			data['sleep'] = sleep_list
			data['diapers'] = diapers_list


			return data
		finally:
			con.close()


	def get_latest_each_record_type(self):
		# get the latest sleep, pee, poo, feed (milk or fmla)
		sql_pee = "select time from baby_keyval where entry_type = 'diaper' and entry_value = 'pee' order by time desc limit 1"
		sql_poo = "select time from baby_keyval where entry_type = 'diaper' and entry_value = 'poo' order by time desc limit 1"
		sql_feed = "select time from baby_keyval where entry_type = 'milk' or entry_type = 'formula' or entry_type = 'solid' order by time desc limit 1"
		sql_sleep = "select end from baby_sleep where end <= current_timestamp() order by end desc limit 1"

		con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])

		try:
			cursor = con.cursor()

			def get_last_record_time(sql):
				rows = self.execute_sql(sql, True, cursor)
				return rows[0][0]

			last_pee = get_last_record_time(sql_pee)
			last_poo = get_last_record_time(sql_poo)
			last_feed = get_last_record_time(sql_feed)
			last_sleep = get_last_record_time(sql_sleep)

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
			sleep_rows = self.execute_sql(sql, True, cursor)

			sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time <= CURRENT_TIMESTAMP() %s order by time ASC' % keyval_date_filter;
			keyval_rows = self.execute_sql(sql, True, cursor)

			day_gen = DayGenerator(1, sleep_rows, keyval_rows)
			days = day_gen.get_days()

			return days

		finally:
			con.close()

	
	def execute_sql(self, sql, return_rows = None, cursor = None):
		print sql
		create_own_connection = cursor == None
		if create_own_connection:
			con = mysql.connector.connect(user=self._credentials['user'], password=self._credentials['pass'],host=self._credentials['host'], database=self._credentials['db'])
			cursor = con.cursor()
		try:
			cursor.execute(sql)
			print 'return_rows: %s' % return_rows
			if (return_rows):
				return cursor.fetchall()
		except Exception:
			raise
		finally:
			if create_own_connection:
				con.close()

