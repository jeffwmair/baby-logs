from domain.day import DayGenerator, Day
from datetime import date, datetime, timedelta
from db_records import BabyRecord, GuardianRecord, SleepRecord, KeyValueRecord
from string import Template
import mysql.connector
import traceback
import logging
import json

log = logging.getLogger('QueryMapper')

JsonObjectsKeySummarizedData = 'weeklysummarized;'
class QueryMapper:
    def __init__(self, credentials):
        self._credentials = credentials
        self._baby_id = int(credentials['babyid'])
        self._queries = {
            'insertValue': Template("insert into baby_keyval (babyid, time, entry_type, entry_value) values ($babyId, '$time', '$entry_type', '$entry_value');"),
            'getBabyDetails': Template("select firstName, lastName, birthdate from baby where id = $babyId;")
        }

    def get_baby_details(self):
        record = self.execute_sql(self._queries['getBabyDetails'].substitute(babyId=self._baby_id), True)[0]
        x = {
            'firstName': record[0],
            'lastName': record[1],
            'dob': record[2],
        }
        return x

    def insert_value_item(self, time_string, entry_type, entry_value):
        self.clear_cache()
        sql = self._queries['insertValue'].substitute(babyId=self._baby_id, time=time_string, entry_type=entry_type, entry_value=entry_value)
        self.execute_sql(sql)

    def delete_value_item(self, time_string, entry_type):
        self.clear_cache()
        sql = "delete from baby_keyval where babyid = %i and time = '%s' and entry_type = '%s';" % (
            self._baby_id, time_string, entry_type)
        self.execute_sql(sql)

    def insert_sleep(self, sleep_start, sleep_end):
        self.clear_cache()
        sql = "insert into baby_sleep (babyid, start, end) values (%i, '%s', '%s');" % (
            self._baby_id, sleep_start, sleep_end)
        self.execute_sql(sql)

    def delete_sleep(self, sleep_time):
        self.clear_cache()
        sql = "delete from baby_sleep where start = '%s' and babyid = %i;" % (sleep_time, self._baby_id)
        self.execute_sql(sql)

    def get_query_keyval_in_day_by_type(self, entry_type, date_string):
        sql = "select date_format(time, '%%Y-%%m-%%d %%T'), entry_value, entry_type from baby_keyval where babyid = %i and entry_type = '%s' and time >= '%s' and time <= '%s 23:59:59' order by time" % (
            self._baby_id, entry_type, date_string, date_string)
        return sql

    def cache_data(self, data):
        json_string = json.dumps(data)
        self.execute_sql('insert into json_objects (json_key, babyid, json_content) values ("%s",%s, \'%s\')' % (JsonObjectsKeySummarizedData, self._baby_id, json_string))
        log.info('added summarized data')

    def get_cached_data(self):
        result = self.execute_sql('select json_content from json_objects where json_key = "%s" and babyid = %i' %(JsonObjectsKeySummarizedData, self._baby_id), True)
        if len(result) == 0:
            return None
        json_text = result[0][0]
        return json.loads(json_text)

    def clear_cache(self):
        log.info('deleting summarized data')
        self.execute_sql('delete from json_objects where json_key = "%s" and babyid = %s' % (JsonObjectsKeySummarizedData, self._baby_id))

    def get_chart_data(self, weekly, daysToShow=None):
        log.info('Starting get_chart_data Weekly=%s, daysToShow=%s', weekly, daysToShow)
        startDate = '2000-01-01 00:00:00'
        if daysToShow != None:
            startDate = (datetime.now() - timedelta( days=daysToShow - 1)).strftime('%Y-%m-%d')
        else:
            # first try to get cached data
            summarized_data = self.get_cached_data()
            if (summarized_data != None): return summarized_data

        sql = 'select id, start, end, date_format(start, "%%Y-%%m-%%d") as day from baby_sleep where start >= "%s" and start <= CURRENT_TIMESTAMP() and babyid = %i order by start ASC' % (startDate, self._baby_id)
        sleep_row_objects = [self.sleep_row_to_dict(row) for row in self.execute_sql(sql, True)]
        log.info('get_chart_data got sleep rows')

        sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time >= "%s" and time <= CURRENT_TIMESTAMP() and babyid = %i order by time ASC' % (startDate, self._baby_id)
        keyval_rows = self.execute_sql(sql, True)
        log.info('get_chart_data got keyval rows')
        try:
            day_gen = DayGenerator(1, weekly, sleep_row_objects, keyval_rows)
            datasets = day_gen.get_datasets()
            daily = []
            for day_key in sorted(datasets):
                day = datasets.get(day_key)
                feed = day.get_feed()
                sleep = day.get_sleep()
                diaper = day.get_diaper()
                row = {
                    'day': '%s 00:00:00' % day_key,
                    'totalSleepHrs': sleep.get_total_sleep_hrs(),
                    'nightSleepHrs': sleep.get_unbroken_night_sleep_hrs(),
                    'breastCount': feed.get_breast_count(),
                    'milkMl': feed.get_milk_ml(),
                    'solidMl': feed.get_solid_ml(),
                    'formulaMl': feed.get_fmla_ml(),
                    'poos': diaper.get_poo_count(),
                }
                daily.append(row)
            log.info('Completed get_chart_data')
            data = {'datasets':daily, 'description': 'Weekly Averages' if weekly == True else 'Last 10 Days'}
            if daysToShow == None: self.cache_data(data)
            return data
        except Exception as ex:
            log.error(traceback.format_exc())

    def get_data_for_day(self, date_string):
        sql_sleeps = "select id, babyid, date_format(start, '%%Y-%%m-%%d %%T'), date_format(end, '%%Y-%%m-%%d %%T') from baby_sleep where start >= '%s' and start <= '%s 23:59:59' and babyid = %i order by start" % (
            date_string, date_string, self._baby_id)
        sql_keyval = "select date_format(time, '%%Y-%%m-%%d %%T'), entry_value, entry_type from baby_keyval where time >= '%s' and time <= '%s 23:59:59' and babyid = %i order by time" % (
            date_string, date_string, self._baby_id)
        con = self.get_connection()
        try:
            cursor = con.cursor()
            keyval_records = self.execute_sql(sql_keyval, True, cursor)

            def get_records_by_type(typestring):
                return [x for x in keyval_records if x[2] == typestring]

            milk = get_records_by_type('milk')
            formula = get_records_by_type('formula')
            solid = get_records_by_type('solid')
            diapers = get_records_by_type('diaper')

            sleep_list = [ {
                    'id': sleep[0],
                    'babyid': sleep[1],
                    'start': sleep[2],
                    'end': sleep[3]
                } for sleep in self.execute_sql(sql_sleeps, True, cursor)]

            def get_keyval_rows(itemlist):
                return [ {
                        'time': entry[0],
                        'entry_value': entry[1],
                        'entry_type': entry[2]
                    } for entry in itemlist ]

            return {
                'milk': get_keyval_rows(milk),
                'formula': get_keyval_rows(formula),
                'solid': get_keyval_rows(solid),
                'sleep': sleep_list,
                'diapers': get_keyval_rows(diapers)
            }
        finally:
            con.close()

    def get_latest_each_record_type(self):
        # get the latest sleep, pee, poo, feed (milk or fmla)
        # we'll count a poo as a pee also because there is likely pee anyway
        sql_pee = "select time from baby_keyval where entry_type = 'diaper' and (entry_value = 'pee' or entry_value = 'poo') and babyid = %i order by time desc limit 1" % self._baby_id
        sql_poo = "select time from baby_keyval where entry_type = 'diaper' and entry_value = 'poo' and babyid = %i order by time desc limit 1" % self._baby_id
        sql_feed = "select time from baby_keyval where entry_type = 'milk' or entry_type = 'formula' or entry_type = 'solid' and babyid = %i order by time desc limit 1" % self._baby_id
        sql_sleep = "select end from baby_sleep where end <= current_timestamp() and babyid = %i order by end desc limit 1" % self._baby_id

        con = self.get_connection()
        try:
            cursor = con.cursor()

            def get_last_record_time(sql):
                rows = self.execute_sql(sql, True, cursor)
                try:
                    if len(rows) == 0:
                        return datetime(1900, 1, 1)
                    else:
                        return rows[0][0]
                except Exception:
                    log.error('Failure in executing: "%s"', sql)
                    raise

            return {
                'last_pee': get_last_record_time(sql_pee),
                'last_poo': get_last_record_time(sql_poo),
                'last_feed': get_last_record_time(sql_feed),
                'last_sleep': get_last_record_time(sql_sleep)
            }

        finally:
            con.close()

    def get_days(self, start, end):

        sleep_date_filter = ''
        keyval_date_filter = ''
        if not start == None:
            start_fmt = start.strftime('%Y-%m-%d %H:%M:%S')
            sleep_date_filter = ' and start >= TIMESTAMP("%s")' % start_fmt
            keyval_date_filter = ' and time >= TIMESTAMP("%s")' % start_fmt
        if not end == None:
            end_fmt = end.strftime('%Y-%m-%d %H:%M:%S')
            sleep_date_filter = '%s and end <= TIMESTAMP("%s")' % (
                sleep_date_filter, end_fmt)
            keyval_date_filter = '%s and time <= TIMESTAMP("%s")' % (
                keyval_date_filter, end_fmt)

        con = self.get_connection()
        try:
            cursor = con.cursor()
            sql = "select id, start, end, DATE_FORMAT(start, '%%Y-%%m-%%d') as day from baby_sleep where start <= CURRENT_TIMESTAMP() %s and babyid = %i order by start ASC" % (sleep_date_filter, self._baby_id)
            sleep_row_objects = [ self.sleep_row_to_dict(row) for row in self.execute_sql(sql, True, cursor) ]
            sql = 'select time, DATE_FORMAT(time, "%%Y-%%m-%%d") as day, entry_type, entry_value from baby_keyval WHERE time <= CURRENT_TIMESTAMP() %s and babyid = %i order by time ASC' % (keyval_date_filter, self._baby_id)
            keyval_rows = self.execute_sql(sql, True, cursor)
            weekly_grouping = False
            day_gen = DayGenerator(self._baby_id, weekly_grouping, sleep_row_objects, keyval_rows)
            return day_gen.get_datasets()
        finally:
            con.close()

    def sleep_row_to_dict(self, row):
        return {
            'baby_id': row[0],
            'sleep_start': row[1],
            'sleep_end': row[2],
            'sleep_day_key': row[3]
        }

    def get_connection(self):
        return mysql.connector.connect(
            user=self._credentials['user'],
            password=self._credentials['pass'],
            host=self._credentials['host'],
            port=self._credentials['port'],
            database=self._credentials['db'])

    def starts_with_any(self, subject, startOptions):
        return any(
            [x for x in startOptions if subject.lower().startswith(x.lower())])

    def execute_sql(self, sql, return_rows=None, cursor=None):
        if self._credentials['disable.modifications'].lower() == 'true' and self.starts_with_any(sql, ['insert', 'update', 'delete']):
            raise Exception('The application is currently disabled from further input')
        create_own_connection = cursor == None
        if create_own_connection:
            con = self.get_connection()
            cursor = con.cursor()
        try:
            cursor.execute(sql)
            if (return_rows):
                return cursor.fetchall()
        except Exception:
            raise
        finally:
            if create_own_connection:
                con.commit()
                con.close()
