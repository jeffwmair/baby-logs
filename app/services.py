"""services"""

from datetime import datetime, timedelta
from dateutil.parser import parse
import traceback
from domain.day import Day, SleepSet, FeedSet, DiaperSet

class ReportService():
    def __init__(self, datamapper):
        self._babyid = 1
        self._datamapper = datamapper
        self._feed_types = ['milk', 'formula', 'solid', 'feed']
        self._old = 3
        self._recent = 2
        self._new = 1
        self.status_calculation_map = {
            'older': {
                'sleep': 60 * 2,
                'feed': 60 * 3.5,
                'poo': 60 * 24,
                'pee': 60 * 3.5
            },
            'recent': {
                'sleep': 60 * 1.5,
                'feed': 60 * 2.5,
                'poo': 60 * 12,
                'pee': 60 * 2.75
            }
        }

    # data that drives the chart/report page
    def get_chart_data_daily(self, days):
        is_weekly = False
        return self._datamapper.get_chart_data(is_weekly, days)

    def get_chart_data_weekly(self):
        is_weekly = True
        return self._datamapper.get_chart_data(is_weekly)

    # add a new value-item
    def add_value_item(self, time_string, item_type, item_value):
        print 'adding value item: %s/%s at %s' % (item_type, item_value,
                                                  time_string)
        # delete the same type item first
        self._datamapper.delete_value_item(self._babyid, time_string,
                                           item_type)

        # this is awkward -- we might be changing from one type of feed to another, which is why we have this
        if item_type in self._feed_types:
            for feed_type in self._feed_types:
                self._datamapper.delete_value_item(self._babyid, time_string,
                                                   feed_type)

        if item_value != "none":
            self._datamapper.insert_value_item(self._babyid, time_string,
                                               item_type, item_value)

    def remove_value_item(self, time_string, item_type):
        self._datamapper.delete_value_item(time_string, item_type)

    def remove_sleep(self, sleep_time_string):
        self._datamapper.delete_sleep(sleep_time_string)

    def add_sleep(self, sleep_start_string):
        start_time = parse(sleep_start_string)
        sleep_end_string = (
            start_time + timedelta(minutes=15)).strftime('%Y-%m-%d %H:%M:%S')
        babyid = 1
        self._datamapper.insert_sleep(babyid, sleep_start_string,
                                      sleep_end_string)

    def get_entry_data(self, date_string_raw):
        # in case there is a time component, strip it off
        date_string = date_string_raw[:10]

        data = self._datamapper.get_data_for_day(date_string)
        result = {
            'sleeps': data['sleep'],
            'milkfeeds': data['milk'],
            'fmlafeeds': data['formula'],
            'solidfoodfeeds': data['solid'],
            'diapers': data['diapers']
        }

        return result

    def get_dashboard_data(self):

        startTodayDay = datetime.now().date()
        startToday = datetime(startTodayDay.year, startTodayDay.month,
                              startTodayDay.day, 0, 0, 0)
        endToday = startToday + timedelta(days=1) - timedelta(seconds=1)

        days = self._datamapper.get_days(startToday, endToday)
        most_recent_records = self._datamapper.get_latest_each_record_type()

        last_pee = most_recent_records['last_pee']
        last_poo = most_recent_records['last_poo']
        last_feed = most_recent_records['last_feed']
        last_sleep = most_recent_records['last_sleep']

        #TODO: hide the most recent activities if they are all older than X hours 

        todayKey = startTodayDay.strftime('%Y-%m-%d')
        dayToday = None
        try:
            dayToday = days[todayKey]
        except Exception:
            print traceback.format_exc()
            #TODO
            babyid = 1
            dayToday = Day(todayKey, SleepSet([]), DiaperSet([]), FeedSet([]))

        today_sleep = dayToday.get_sleep()
        today_feed = dayToday.get_feed()
        today_diaper = dayToday.get_diaper()

        return {
            'feed': {
                'milkMlToday': str(today_feed.get_milk_ml()) + 'ml',
                'formulaMlToday': str(today_feed.get_fmla_ml()) + 'ml',
                'breastCountToday': today_feed.get_breast_count(),
                'solidMlToday': str(today_feed.get_solid_ml()) + 'ml',
                'prev': {
                    'status': self.get_feed_status(last_feed),
                    'time': self.format_date(last_feed),
                    'minutesAgo': self.get_time_minutes_ago(last_feed)
                }
            },
            'sleep': {
                'naps': {
                    'count': today_sleep.get_nap_count(),
                    'duration': today_sleep.get_nap_hrs()
                },
                'prev': {
                    'status': self.get_sleep_status(last_sleep),
                    'time': self.format_date(last_sleep),
                    'minutesAgo': self.get_time_minutes_ago(last_sleep)
                }
            },
            'pee': {
                'prev': {
                    'status': self.get_pee_status(last_pee),
                    'time': self.format_date(last_pee),
                    'minutesAgo': self.get_time_minutes_ago(last_pee)
                }
            },
            'poo': {
                'todayCount': today_diaper.get_poo_count(),
                'prev': {
                    'status': self.get_poo_status(last_poo),
                    'time': self.format_date(last_poo),
                    'minutesAgo': self.get_time_minutes_ago(last_poo)
                }
            }
        }

    def get_time_minutes_ago(self, time):
        minutes_ago = (datetime.now() - time).seconds / 60.0
        days_ago = (datetime.now() - time).days
        minutes_ago = minutes_ago + days_ago * 24 * 60
        return minutes_ago

    def get_pee_status(self, time):
        return self.get_item_status('pee', self.get_time_minutes_ago(time))

    def get_poo_status(self, time):
        return self.get_item_status('poo', self.get_time_minutes_ago(time))

    def get_feed_status(self, time):
        return self.get_item_status('feed', self.get_time_minutes_ago(time))

    def get_sleep_status(self, time):
        return self.get_item_status('sleep', self.get_time_minutes_ago(time))

    def get_item_status(self, item, min_ago):
        if min_ago > self.status_calculation_map['older'][item]:
            return self._old
        elif min_ago > self.status_calculation_map['recent'][item]:
            return self._recent
        else:
            return self._new

    def format_date(self, date):
        return date.strftime('%I:%M%p').lower()
