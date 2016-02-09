class BabyRecord:
	def __init__(self, fullname, gender, birthdate):
		self.fullname = fullname
		self.gender = gender
		self.birthdate = birthdate

class GuardianRecord:
	def __init__(self, fullname, email, baby):
		self.fullname = fullname
		self.email = email
		self.baby = baby

class KeyValueRecord:
	def __init__(self):
		print 'init'

class SleepRecord:
	def __init__(self, start, end):
		self.start = start
		self.end = end

