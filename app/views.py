"""module handles http requests"""

import traceback
import sys
from datetime import datetime
from flask import jsonify
from flask import request
from flask import render_template
from app.services import ReportService
from app.properties_reader import PropertiesReader
from app.query_mapper import QueryMapper
from app import app


@app.errorhandler(500)
def server_error(err):
    """responds with error message"""
    print err
    trace = traceback.format_exc()
    return trace


@app.route('/')
def dashboard_page():
    """show the dashboard page"""
    return render_template('index.html')


@app.route('/entry')
def entry_page():
    return render_template('entry.html')


@app.route('/charts')
def charts_page():
    return render_template('charts.html')


@app.route('/BabyApi')
def api():
    data = None

    # TODO: fix this
    babyid = 1
    credentials_file = 'credentials.properties'
    if len(sys.argv) == 2 and sys.argv[1].startswith('credentials='):
        credentials_file = sys.argv[1].split('credentials=')[1]
    credentials_reader = PropertiesReader(credentials_file)
    creds = credentials_reader.read_from_file()
    mapper = QueryMapper(creds, babyid)

    api_method = request.args['action']
    print 'processing request with action=%s' % api_method
    svc = ReportService(mapper)
    if api_method == "loadDashboard":
        try:
            data = svc.get_dashboard_data()
        except Exception as ex:
            print traceback.format_exc()

    elif api_method == "loadentrydata":
        try:
            day_string = datetime.now().strftime('%Y-%m-%d')
            if 'day' in request.args:
                day_string = request.args['day']
            data = svc.get_entry_data(day_string)
        except Exception:
            print traceback.format_exc()

    elif api_method == "removesleep":
        sleep_time = request.args['sleepstart']
        svc.remove_sleep(sleep_time)
        data = svc.get_entry_data(sleep_time)

    elif api_method == "sleep":
        start = request.args['sleepstart']
        svc.add_sleep(start)
        data = svc.get_entry_data(start)

    elif api_method == "sleeprange":
        #jsondata = json.loads(request.args['data'])
        #print jsondata['selectSleepStartHr'];
        raise Exception('Method "%s" not implemented' % api_method)

    elif api_method == "addvalue":
        time = request.args['time']
        entry_type = request.args['type']
        entry_value = request.args['value']
        svc.add_value_item(time, entry_type, entry_value)
        data = svc.get_entry_data(time)

    elif api_method == "loadreportdata_daily":
        data = svc.get_chart_data_daily(10)

    elif api_method == "loadreportdata_weekly":
        data = svc.get_chart_data_weekly()

    else:
        raise Exception('Method "%s" not implemented' % api_method)

    try:
        jsondata = jsonify(data)
        return jsondata
    except Exception:
        print traceback.format_exc()
