from datetime import date, datetime, timedelta
import traceback
from domain.day import Day, SleepSet, FeedSet, DiaperSet

class ReportService():
	def __init__(self, datamapper):
		self._datamapper = datamapper

	def get_entry_data(self, date_string):

		#sql_sleeps = "select time, entry_value, entry_type from baby_keyval
		sleeps = self._datamapper.get_sleeps_for_day(date_string)
		sleep_json = list()
		for sleep in sleeps:
			row_dict = {
					'id':sleep[0], 
					'babyid':sleep[1], 
					'start':sleep[2], 
					'end':sleep[3]
				}
			sleep_json.append(row_dict)

		data = {
			'sleeps' : sleep_json,
			'milkfeeds' : [],
			'fmlafeeds' : [],
			'diapers' : [] 
		}
		return data

	def get_dashboard_data(self):

		startTodayDay = datetime.now().date()
		startToday = datetime(startTodayDay.year, startTodayDay.month, startTodayDay.day, 0, 0, 0)
		endToday = startToday + timedelta(days=1) - timedelta(seconds=1)

		#TODO: for fun, try loading these two calls in separate threads.  Can we use something like Futures in python?
		days = self._datamapper.get_days(startToday, endToday)
		most_recent_records = self._datamapper.get_latest_each_record_type()

		last_pee = most_recent_records['last_pee']
		last_poo = most_recent_records['last_poo']
		last_feed = most_recent_records['last_feed']
		last_sleep = most_recent_records['last_sleep']

		todayKey = startTodayDay.strftime('%Y-%m-%d')
		dayToday = None
		try:
			dayToday = days[todayKey]
		except Exception:
			print traceback.format_exc()
			#TODO
			babyid = 1
			dayToday = Day(todayKey, SleepSet([]), DiaperSet([]), FeedSet([])) 

		today_sleep = dayToday.get_sleep()
		today_feed = dayToday.get_feed()
		today_diaper = dayToday.get_diaper()

		data = { 
				'feed' : 
				{ 
					'milkMlToday' : str(today_feed.get_milk_ml()) + 'ml',
					'formulaMlToday' : str(today_feed.get_fmla_ml()) + 'ml',
					'breastCountToday' : today_feed.get_breast_count(),
					'prev' : {
						'status' : self.get_feed_status(last_feed),
						'time' : self.format_date(last_feed),
						'minutesAgo' : self.get_time_minutes_ago(last_feed)
						}
				},
				'sleep': {
					'naps' : {
						'count' : today_sleep.get_nap_count(),
						'duration' : today_sleep.get_nap_hrs()
						},
					'prev' : {
						'status' : self.get_sleep_status(last_sleep),
						'time' : self.format_date(last_sleep),
						'minutesAgo' : self.get_time_minutes_ago(last_sleep)
						}
					},
				'pee' : {
					'prev' : {
						'status' : self.get_pee_status(last_pee),
						'time' : self.format_date(last_pee),
						'minutesAgo' : self.get_time_minutes_ago(last_pee)
						}
					},
				'poo' : {
					'todayCount' : today_diaper.get_poo_count(),
					'prev' : {
						'status' : self.get_poo_status(last_poo),
						'time' : self.format_date(last_poo),
						'minutesAgo' : self.get_time_minutes_ago(last_poo)
						}
					}
			}
		return data

	def get_time_minutes_ago(self, time):
		return (datetime.now() - time).seconds / 60.0

	def get_pee_status(self, time):
		min_ago = self.get_time_minutes_ago(time)
		if min_ago > 60*3.5:
			return 3
		elif min_ago > 60*2.75:
			return 2
		else:
			return 1

	def get_poo_status(self, time):
		min_ago = self.get_time_minutes_ago(time)
		if min_ago > 60*24:
			return 3
		elif min_ago > 60*6:
			return 2
		else:
			return 1

	def get_feed_status(self, time):
		min_ago = self.get_time_minutes_ago(time)
		if min_ago > 60*3.5:
			return 3
		elif min_ago > 60*2.5:
			return 2
		else:
			return 1

	def get_sleep_status(self, time):
		min_ago = self.get_time_minutes_ago(time)
		if min_ago > 60*2:
			return 3
		elif min_ago > 60*1.5:
			return 2
		else:
			return 1

	def format_date(self, date):
		return date.strftime('%-I:%M%p').lower()
