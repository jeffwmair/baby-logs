class ReportService():
	def __init__(self, datamapper):
		self._datamapper = datamapper
		print "initialized"

	def get_dashboard_data(self):

		# same shitty implementation as the original php...

		milkMlToday = 0
		formulaMlToday = 0
		breastCountToday = 0
		feedStatus = "1"
		feedRecordTimeFmt = ''
		feedEndMinutesAgo = ''

		poosToday = 0

		napCount = 0
		napDurationHrs = 0
		sleepStatus = "1"
		sleepRecordTimeFmt = ''
		sleepEndMinutesAgo = 0

		peeStatus = "1"
		pooStatus = "1"

		peeRecordTimeFmt = ''
		pooRecordTimeFmt = ''

		peeMinutesAgo = 0
		pooMinutesAgo = 0

		startToday = None
		endToday = None
		days = self._datamapper.get_days(startToday, endToday)

		data = { 
				'feed' : 
				{ 
					'milkMlToday' : milkMlToday, 
					'formulaMlToday' : formulaMlToday,
					'breastCountToday' : breastCountToday,
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
