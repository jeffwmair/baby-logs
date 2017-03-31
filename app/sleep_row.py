"""Sleep record"""

class SleepRow(object):
    """sleep record"""
    def __init__(self, row):
        self.baby_id = row[0]
        self.sleep_start = row[1]
        self.sleep_end = row[2]
        self.sleep_day_key = row[3]

    def get_baby_id(self):
        """Returns the baby id"""
        return self.baby_id

    def get_sleep_start(self):
        """Returns the sleep start time"""
        return self.sleep_start

    def get_sleep_end(self):
        """Returns the sleep end time"""
        return self.sleep_end

    def get_day_key(self):
        """Returns the day key"""
        return self.sleep_day_key

