class PropertiesReader:
    def __init__(self, filename):
        self._filename = filename

    def read_from_file(self):
        f = open(self._filename, 'r')
        keyvals = [x.replace('\n', '').split('=') for x in f if not x.startswith('#')]
        return dict((kv[0], kv[1]) for kv in keyvals)
