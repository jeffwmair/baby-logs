#!flask/bin/python

from flask import Flask
from flask import jsonify
from flask import request
from db import Db
from query_mapper import QueryMapper
from services import ReportService

app = Flask(__name__)

@app.route('/BabyApi.php', methods=['GET'])
def api():
	apiMethod = request.args['method']
	db = Db()
	mapper = QueryMapper(db)

	data = None
	if apiMethod == "loadDashboard":
		svc = ReportService(mapper);
		data = svc.get_dashboard_data()
	else:
		raise ValueError("method not implemented: %s" % apiMethod)

	print "Request method: %s" % request.method
	print "Request args: %s" % request.args
	return jsonify(data)

if __name__ == '__main__':
	app.debug = True
	app.run()
