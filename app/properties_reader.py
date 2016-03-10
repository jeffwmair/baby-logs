class PropertiesReader:

	def __init__(self, filename):
		self._filename = filename

	def read_from_file(self):
		props = dict()
		f = open(self._filename, 'r')

		for line in f:
			keyval = line.replace('\n', '').split('=')
			props[keyval[0]] = keyval[1]

		return props
