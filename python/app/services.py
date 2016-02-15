from datetime import date, datetime, timedelta
from domain.day import Day

class ReportService():
	def __init__(self, datamapper):
		self._datamapper = datamapper

	def get_dashboard_data(self):

		feedRecordTimeFmt = ''
		feedEndMinutesAgo = ''

		sleepRecordTimeFmt = ''
		sleepEndMinutesAgo = 0

		feedStatus = "3"
		sleepStatus = "3"
		peeStatus = "3"
		pooStatus = "3"

		peeRecordTimeFmt = ''
		pooRecordTimeFmt = ''

		peeMinutesAgo = 0
		pooMinutesAgo = 0

		# TODO: need to get start of day today and end of day today for a filter date range
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
					'milkMlToday' : today_feed.get_milk_ml(),
					'formulaMlToday' : today_feed.get_fmla_ml(),
					'breastCountToday' : today_feed.get_breast_count(),
					'prev' : {
						'status' : feedStatus,
						'time' : feedRecordTimeFmt,
						'minutesAgo' : feedEndMinutesAgo
						}
				},
				'sleep': {
					'naps' : {
						'count' : today_sleep.get_nap_count(),
						'duration' : today_sleep.get_nap_hrs()
						},
					'prev' : {
						'status' : sleepStatus,
						'time' : sleepRecordTimeFmt,
						'minutesAgo' : sleepEndMinutesAgo
						}
					},
				'pee' : {
					'prev' : {
						'status' : peeStatus,
						'time' : peeRecordTimeFmt,
						'minutesAgo' : peeMinutesAgo
						}
					},
				'poo' : {
					'todayCount' : today_diaper.get_poo_count(),
					'prev' : {
						'status' : pooStatus,
						'time' : pooRecordTimeFmt,
						'minutesAgo' : pooMinutesAgo
						}
					}
			}
		return data
