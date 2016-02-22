from app import app
import traceback
from datetime import datetime
from flask import jsonify, Response
from flask import request
from flask import render_template
from services import ReportService
from properties_reader import PropertiesReader
from query_mapper import QueryMapper
from exceptions import Exception, ValueError, NameError

@app.errorhandler(500)
def server_error(error):
	return traceback.format_exc()

@app.route('/')
def dashboard_page():
	print 'start'
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
	babyid = 1;

	credentialsReader = PropertiesReader('credentials.properties');
	creds = credentialsReader.read_from_file()
	mapper = QueryMapper(creds, babyid)

	apiMethod = request.args['action']
	svc = ReportService(mapper);
	if apiMethod == "loadDashboard":
		try:
			data = svc.get_dashboard_data()
		except Exception:
			print traceback.format_exc()
	elif apiMethod == "loadentrydata":
		try:
			day_string = datetime.now().strftime('%Y-%m-%d')
			if 'day' in request.args:
				day_string = request.args['day']
			print 'daystring: %s' % day_string
			data = svc.get_entry_data(day_string)
		except Exception:
			print traceback.format_exc()

	else:
		raise Exception('Method "%s" not implemented' % apiMethod)

	return jsonify(data)
