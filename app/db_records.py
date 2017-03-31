"""database records"""

class BabyRecord(object):
    """baby instance record"""
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
    def __init__(self, time, record_type, value, baby_id):
        self._time = time
        self._record_type = record_type
        self._value = value
        self._baby_id = baby_id
    def __repr__(self):
        return 'KeyValueRecord [time: %s, type: %s, value: %s]' % (self._time, self._record_type, self._value)

    def get_type(self): return self._record_type
    def get_value(self): return self._value
    def get_time(self): return self._time

class SleepRecord:
    def __init__(self, start, end):
        self.start = start
        self.end = end

    def is_adjacent_to(self, other_record):
        return self.start == other_record.end or self.end == other_record.start

    def get_duration(self):
        return (self.end - self.start).seconds / 3600.0

