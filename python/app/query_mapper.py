import mysql.connector
from app import app
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

			# sleeps
			sleepRecords = list()
			for row in cursor.fetchall():
				sleepRecords.append(SleepRecord(row[0], row[1]))



		finally:
			con.close()
