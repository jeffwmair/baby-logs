from datetime import date, datetime, timedelta
from domain.day import Day

class ReportService():
	def __init__(self, datamapper):
		self._datamapper = datamapper
		print "initialized"

	def get_dashboard_data(self):

		# same shitty implementation as the original php...

		milkMlToday = 0
		formulaMlToday = 0
		breastCountToday = 0
		feedRecordTimeFmt = ''
		feedEndMinutesAgo = ''

		poosToday = 0

		napCount = 0
		napDurationHrs = 0
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
		#print 'xxxxxxxxxxxxxxx endToday: %s xxxxxxxxxxxxxx' % endToday

		days = self._datamapper.get_days(startToday, endToday)
		todayKey = startTodayDay.strftime('%Y-%m-%d')
		dayToday = None
		try:
			dayToday = days[todayKey]
		except KeyError:
			#TODO
			babyid = 1
			dayToday = Day(todayKey, babyid) 
		print dayToday

		data = { 
				'feed' : 
				{ 
					'milkMlToday' : dayToday.get_milk_ml(),
					'formulaMlToday' : dayToday.get_fmla_ml(),
					'breastCountToday' : dayToday.get_breast_count(),
					'prev' : {
						'status' : feedStatus,
						'time' : feedRecordTimeFmt,
						'minutesAgo' : feedEndMinutesAgo
						}
				},
				'sleep': {
					'naps' : {
						'count' : napCount,
						'duration' : napDurationHrs
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
					'todayCount' : poosToday,
					'prev' : {
						'status' : pooStatus,
						'time' : pooRecordTimeFmt,
						'minutesAgo' : pooMinutesAgo
						}
					}
			}
		return data
