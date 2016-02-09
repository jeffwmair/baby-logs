class Db:
	def __init__(self, credentialsDict):
		self._creds = credentialsDict

	def mymethod(self):
		print self
		return self

