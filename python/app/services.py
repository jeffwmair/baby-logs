from datetime import date, datetime, timedelta
from domain.day import Day

class ReportService():
	def __init__(self, datamapper):
		self._datamapper = datamapper

	def get_dashboard_data(self):

		startTodayDay = datetime.now().date()
		startToday = datetime(startTodayDay.year, startTodayDay.month, startTodayDay.day, 0, 0, 0)
		endToday = startToday + timedelta(days=1) - timedelta(seconds=1)

		days = self._datamapper.get_days(startToday, endToday)
		todayKey = startTodayDay.strftime('%Y-%m-%d')
		dayToday = None
		try:
			dayToday = days[todayKey]
		except KeyError:
			#TODO
			babyid = 1
			dayToday = Day(todayKey, babyid) 

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
						'status' : today_feed.get_feed_status(),
						'time' : self.format_date(today_feed.get_last_feed_time()),
						'minutesAgo' : today_feed.get_minutes_ago()
						}
				},
				'sleep': {
					'naps' : {
						'count' : today_sleep.get_nap_count(),
						'duration' : today_sleep.get_nap_hrs()
						},
					'prev' : {
						'status' : today_sleep.get_sleep_status(),
						'time' : self.format_date(today_sleep.get_sleep_last_time()),
						'minutesAgo' : today_sleep.get_sleep_last_minutes_ago()
						}
					},
				'pee' : {
					'prev' : {
						'status' : today_diaper.get_pee_status(),
						'time' : self.format_date(today_diaper.get_pee_last_time()),
						'minutesAgo' : today_diaper.get_pee_minutes_ago()
						}
					},
				'poo' : {
					'todayCount' : today_diaper.get_poo_count(),
					'prev' : {
						'status' : today_diaper.get_poo_status(),
						'time' : self.format_date(today_diaper.get_poo_last_time()),
						'minutesAgo' : today_diaper.get_poo_minutes_ago()
						}
					}
			}
		return data

	def format_date(self, date):
		return date.strftime('%-I:%M%p').lower()
