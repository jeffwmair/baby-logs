from flask import Flask
app = Flask(__name__, static_url_path='/static')

import traceback
import sys
from datetime import datetime
from flask import jsonify
from flask import request
from flask import render_template
from app.services import ReportService
from app.properties_reader import PropertiesReader
from app.query_mapper import QueryMapper
import logging

# app.debug = True
logger = logging.getLogger('server')

def get_query_mapper():
    credentials_file = 'credentials.properties'
    # command-line argument with credentials filename
    if len(sys.argv) == 2 and sys.argv[1].startswith('credentials='):
        credentials_file = sys.argv[1].split('credentials=')[1]
    credentials_reader = PropertiesReader(credentials_file)
    creds = credentials_reader.read_from_file()
    return QueryMapper(creds)

@app.errorhandler(500)
def server_error(err):
    """responds with error message"""
    logger.error(err)
    return err.msg, 500

@app.route('/', methods=['GET'])
def dashboard_page():
    """show the dashboard page"""
    return render_template('index.html', babyName=firstName)

@app.route('/entry', methods=['GET'])
def entry_page():
    return render_template('entry.html', babyName=firstName)

@app.route('/charts', methods=['GET'])
def charts_page():
    return render_template('charts.html', babyName=firstName)

@app.route('/ReportData', methods=['GET'])
def report_data():
    datatype = request.args['type']
    if datatype == "daily":
        return jsonify(svc.get_chart_data_daily(10))
    elif datatype == "weekly":
        return jsonify(svc.get_chart_data_weekly())
    else:
        raise Exception("Unexpected report type" + datatype)

@app.route('/BabyApi')
def api():
    data = None
    api = request.args['action']

    if api == "loadDashboard":
        try:
            data = svc.get_dashboard_data()
        except Exception as ex:
            logger.error(traceback.format_exc())

    elif api == "loadentrydata":
        try:
            day_string = datetime.now().strftime('%Y-%m-%d')
            if 'day' in request.args:
                day_string = request.args['day']
            data = svc.get_entry_data(day_string)
        except Exception:
            logger.error(traceback.format_exc())

    elif api == "removesleep":
        sleep_time = request.args['sleepstart']
        svc.remove_sleep(sleep_time)
        data = svc.get_entry_data(sleep_time)

    elif api == "sleep":
        start = request.args['sleepstart']
        svc.add_sleep(start)
        data = svc.get_entry_data(start)

    elif api == "sleeprange":
        raise Exception('Method "%s" not implemented' % api)

    elif api == "addvalue":
        svc.add_value_item(request.args['time'], request.args['type'],
                        request.args['value'])
        data = svc.get_entry_data(request.args['time'])

    elif api == 'summarize_data':
        svc.summarize_weekly_data()
        return ''

    else:
        raise Exception('Method "%s" not implemented' % api)

    try:
        jsondata = jsonify(data)
        return jsondata
    except Exception as ex:
        logger.error(ex)


queryMapper = get_query_mapper()
svc = ReportService(queryMapper)
firstName = queryMapper.get_baby_details()['firstName']
logger.info('')

