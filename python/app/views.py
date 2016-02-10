from app import app
from flask import jsonify
from flask import request
from flask import render_template
from services import ReportService
from properties_reader import PropertiesReader
from query_mapper import QueryMapper

@app.route('/')
def dashboard_page():
	return render_template('index.html')

@app.route('/entry.html')
def entry_page():
	return render_template('entry.html')

@app.route('/charts.html')
def charts_page():
	return render_template('charts.html')

@app.route('/BabyApi.php')
def api():
	data = None

	credentialsReader = PropertiesReader('../resources/credentials.properties');
	creds = credentialsReader.read_from_file()
	mapper = QueryMapper(creds)

	apiMethod = request.args['action']
	if apiMethod == "loadDashboard":
		svc = ReportService(mapper);
		data = svc.get_dashboard_data()
	else:
		raise ValueError("method not implemented: %s" % apiMethod)

	print "Request method: %s" % request.method
	print "Request args: %s" % request.args
	return jsonify(data)
